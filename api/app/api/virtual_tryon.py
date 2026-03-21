from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Form
from gradio_client import Client, handle_file
import logging
import time
from uuid import uuid4

import os
from google import genai
from app.core.config import settings
from google.genai.types import (
    Image,
    ProductImage,
    RecontextImageConfig,
    RecontextImageSource,
)
from app.schemas.virtual_tryon import GarmentCategory, VirtualTryOnResponse
from app.services.file_handler import (
    save_upload_file,
    save_result_image,
    cleanup_files,
    cleanup_old_files,
    UPLOAD_TEMP_DIR,
    OUTPUT_TEMP_DIR
)
from app.services.garment_classifier import get_garment_classifier

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Client
OOTDIFFUSION_CLIENT = None
VERTEXAI_CLIENT = None

def get_ootdiffusion_client():
    global OOTDIFFUSION_CLIENT
    if OOTDIFFUSION_CLIENT is None:
        try:
            OOTDIFFUSION_CLIENT = Client("levihsu/OOTDiffusion")
            logger.info("OOTDiffusion client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OOTDiffusion client: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to connect to OOTDiffusion service")
    return OOTDIFFUSION_CLIENT

def get_vertexai_client():
    global VERTEXAI_CLIENT
    if VERTEXAI_CLIENT is None:
        try:
            VERTEXAI_CLIENT = genai.Client(
                vertexai=settings.GOOGLE_GENAI_USE_VERTEXAI,
                project=settings.GOOGLE_CLOUD_PROJECT,
                location=settings.GOOGLE_CLOUD_LOCATION
            )
            logger.info("Vertex AI client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Vertex AI client: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to connect to Vertex AI service")
    return VERTEXAI_CLIENT

async def _validate_garment(garm_img: UploadFile) -> bytes:
    
    classifier = get_garment_classifier()
    if classifier is None or not classifier.is_ready():
        logger.warning("Garment classifier not available - skipping content check")
        garm_img_bytes = await garm_img.read()
        await garm_img.seek(0)
        return garm_img_bytes

    garm_img_bytes = await garm_img.read()
    await garm_img.seek(0)

    restricted, class_name, confidence = classifier.is_restricted(garm_img_bytes)
    logger.info(f"Garment classified as '{class_name}' ({confidence:.1%})")

    if restricted:
        logger.warning(f"Blocked restricted garment class: {class_name} ({confidence:.1%})")
        raise HTTPException(status_code=400, detail="Inappropriate Garment Detected")

    return garm_img_bytes

@router.post("/try-on-hd", response_model=VirtualTryOnResponse)
async def virtual_try_on_hd(
    vton_img: UploadFile = File(..., description="Person image"),
    garm_img: UploadFile = File(..., description="Garment image")
):
    await _validate_garment(garm_img)
    start_time = time.time()
    
    # Cleanup old files periodically
    cleanup_old_files(UPLOAD_TEMP_DIR)
    cleanup_old_files(OUTPUT_TEMP_DIR)
    
    # Default parameters
    n_samples = 1
    n_steps = 20
    image_scale = 2.0
    seed = -1
    
    vton_path = None
    garm_path = None
    
    try:
        client = get_ootdiffusion_client()
        
        # Save uploaded files to temp/upload folder
        vton_path = await save_upload_file(vton_img, prefix="person")
        garm_path = await save_upload_file(garm_img, prefix="garment")
        
        logger.info(f"Processing try-on (VITON-HD Dataset)")
        
        # Call OOTDiffusion API
        result = client.predict(
            handle_file(str(vton_path)),
            handle_file(str(garm_path)),
            n_samples,
            n_steps,
            image_scale,
            seed,
            api_name="/process_hd"
        )
        
        result_image = result[0]['image'] if isinstance(result, list) and len(result) > 0 else result
        output_path = save_result_image(result_image, prefix="hd_tryon")
        
        processing_time = time.time() - start_time
    
        image_url = f"/outputs/{output_path.name}"
        logger.info(f"HD try-on completed in {processing_time:.2f}s")
        
        return VirtualTryOnResponse(
            image_url=image_url,
            message="Virtual try-on completed successfully",
            category="Upper Body",
            processing_time=processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in virtual try-on HD: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Virtual try-on failed: {str(e)}")
    finally:
        cleanup_files(vton_path, garm_path)


@router.post("/try-on-dc", response_model=VirtualTryOnResponse)
async def virtual_try_on_dc(
    vton_img: UploadFile = File(..., description="Person image"),
    garm_img: UploadFile = File(..., description="Garment image"),
    category: GarmentCategory = Form(GarmentCategory.UPPER_BODY, description="Garment category")
):
    await _validate_garment(garm_img)
    start_time = time.time()
    
    # Cleanup old files periodically
    cleanup_old_files(UPLOAD_TEMP_DIR)
    cleanup_old_files(OUTPUT_TEMP_DIR)
    
    # Default parameters
    n_samples = 1
    n_steps = 20
    image_scale = 2.0
    seed = -1
    
    vton_path = None
    garm_path = None
    
    try:
        client = get_ootdiffusion_client()
        
        vton_path = await save_upload_file(vton_img, prefix="person")
        garm_path = await save_upload_file(garm_img, prefix="garment")
        
        logger.info(f"Processing try-on (Dresscode dataset)")
    
        result = client.predict(
            vton_img=handle_file(str(vton_path)),
            garm_img=handle_file(str(garm_path)),
            category=category.value,
            n_samples=n_samples,
            n_steps=n_steps,
            image_scale=image_scale,
            seed=seed,
            api_name="/process_dc"
        )

        result_image = result[0]['image'] if isinstance(result, list) and len(result) > 0 else result
        output_path = save_result_image(result_image, prefix=f"dc_tryon_{category.value.lower()}")
        
        processing_time = time.time() - start_time
        
        image_url = f"/outputs/{output_path.name}"
        
        logger.info(f"DC try-on completed in {processing_time:.2f}s")
        
        return VirtualTryOnResponse(
            image_url=image_url,
            message="Virtual try-on completed successfully",
            category=category.value,
            processing_time=processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in virtual try-on DC: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Virtual try-on failed: {str(e)}")
    finally:
        cleanup_files(vton_path, garm_path)


@router.post("/try-on-gemini", response_model=VirtualTryOnResponse)
async def virtual_try_on_gemini(
    vton_img: UploadFile = File(..., description="Person image"),
    garm_img: UploadFile = File(..., description="Garment image"),
):
    await _validate_garment(garm_img)
    start_time = time.time()
    
    # Cleanup old files periodically
    cleanup_old_files(UPLOAD_TEMP_DIR)
    cleanup_old_files(OUTPUT_TEMP_DIR)
    
    vton_path = None
    garm_path = None
    
    try:
        client = get_vertexai_client()
    
        vton_path = await save_upload_file(vton_img, prefix="person")
        garm_path = await save_upload_file(garm_img, prefix="garment")
        
        logger.info(f"Processing Google Vertex try-on")
        
        response = client.models.recontext_image(
            model=settings.VIRTUAL_TRY_ON_MODEL,
            source=RecontextImageSource(
                person_image=Image.from_file(location=str(vton_path)),
                product_images=[
                    ProductImage(product_image=Image.from_file(location=str(garm_path)))
                ],
            ),
            config=RecontextImageConfig(
                output_mime_type="image/jpeg",
                number_of_images=1,
                safety_filter_level="BLOCK_LOW_AND_ABOVE",
            )
        )
        
        result_image = response.generated_images[0].image
        
        unique_filename = f"gemini_tryon_{uuid4().hex}.jpeg"
        output_path = OUTPUT_TEMP_DIR / unique_filename
        result_image.save(str(output_path))
        
        processing_time = time.time() - start_time
        
        image_url = f"/outputs/{output_path.name}"
        
        logger.info(f"Google Vertex try-on completed in {processing_time:.2f}s")
        
        return VirtualTryOnResponse(
            image_url=image_url,
            message="Virtual try-on completed successfully",
            category="Google Vertex",
            processing_time=processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in virtual try-on Google Vertex: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Virtual try-on failed: {str(e)}")
    finally:
        cleanup_files(vton_path, garm_path)