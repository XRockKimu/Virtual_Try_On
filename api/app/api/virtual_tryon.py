from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from gradio_client import Client, handle_file
import logging
import time

from app.schemas.request import GarmentCategory
from app.schemas.response import VirtualTryOnResponse
from app.services.file_handler import (
    save_upload_file,
    save_result_image,
    cleanup_files,
    cleanup_old_files,
    UPLOAD_TEMP_DIR,
    OUTPUT_TEMP_DIR
)
from app.services.gemini_service import generate_tryon_with_imagen

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Gradio Client
OOTDIFFUSION_CLIENT = None


def get_client():
    global OOTDIFFUSION_CLIENT
    if OOTDIFFUSION_CLIENT is None:
        try:
            OOTDIFFUSION_CLIENT = Client("levihsu/OOTDiffusion")
            logger.info("OOTDiffusion client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OOTDiffusion client: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to connect to OOTDiffusion service")
    return OOTDIFFUSION_CLIENT

@router.get("/")
async def root():
    return {"message": "Virtual Try-On API is running."}

@router.post("/try-on-hd", response_model=VirtualTryOnResponse)
async def virtual_try_on_hd(
    vton_img: UploadFile = File(..., description="Person image"),
    garm_img: UploadFile = File(..., description="Garment image")
):
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
        client = get_client()
        
        # Save uploaded files to temp/upload folder
        vton_path = await save_upload_file(vton_img, prefix="person")
        garm_path = await save_upload_file(garm_img, prefix="garment")
        
        logger.info(f"Processing HD try-on with person: {vton_path.name}, garment: {garm_path.name}")
        
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
        
        # Extract the result image path from Gradio response
        result_image = result[0]['image'] if isinstance(result, list) and len(result) > 0 else result
        
        # Save result to temp/output folder
        output_path = save_result_image(result_image, prefix="hd_tryon")
        
        processing_time = time.time() - start_time
        
        # Generate accessible URL for frontend
        image_url = f"/outputs/{output_path.name}"
        
        logger.info(f"HD try-on completed in {processing_time:.2f}s, output: {output_path.name}")
        
        return VirtualTryOnResponse(
            image_url=image_url,
            message="Virtual try-on completed successfully",
            category="HD",
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
        client = get_client()
        
        # Save uploaded files to temp/upload folder
        vton_path = await save_upload_file(vton_img, prefix="person")
        garm_path = await save_upload_file(garm_img, prefix="garment")
        
        logger.info(f"Processing DC try-on for category: {category.value} with person: {vton_path.name}, garment: {garm_path.name}")
        
        # Call OOTDiffusion API
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
        
        # Extract the result image path from Gradio response
        result_image = result[0]['image'] if isinstance(result, list) and len(result) > 0 else result
        
        # Save result to temp/output folder
        output_path = save_result_image(result_image, prefix=f"dc_tryon_{category.value.lower()}")
        
        processing_time = time.time() - start_time
        
        # Generate accessible URL for frontend
        image_url = f"/outputs/{output_path.name}"
        
        logger.info(f"DC try-on completed in {processing_time:.2f}s, output: {output_path.name}")
        
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


@router.post("/imagen-try-on", response_model=VirtualTryOnResponse)
async def virtual_try_on_imagen(
    vton_img: UploadFile = File(..., description="Person image"),
    garm_img: UploadFile = File(..., description="Garment image")
):
    start_time = time.time()
    
    # Cleanup old files periodically
    cleanup_old_files(UPLOAD_TEMP_DIR)
    cleanup_old_files(OUTPUT_TEMP_DIR)
    
    vton_path = None
    garm_path = None
    
    try:
        # Save uploaded files to temp/upload folder
        vton_path = await save_upload_file(vton_img, prefix="person_imagen")
        garm_path = await save_upload_file(garm_img, prefix="garment_imagen")
        
        logger.info(f"Processing Imagen try-on with person: {vton_path.name}, garment: {garm_path.name}")
        
        # Generate virtual try-on using Imagen
        result_bytes = await generate_tryon_with_imagen(
            person_image_path=vton_path,
            garment_image_path=garm_path
        )
        
        # Save the generated image bytes to output folder
        from uuid import uuid4
        output_filename = f"imagen_tryon_{uuid4().hex}.png"
        output_path = OUTPUT_TEMP_DIR / output_filename
        
        with open(output_path, "wb") as f:
            f.write(result_bytes)
        
        processing_time = time.time() - start_time
        
        # Generate accessible URL for frontend
        image_url = f"/outputs/{output_path.name}"
        
        logger.info(f"Imagen try-on completed in {processing_time:.2f}s, output: {output_path.name}")
        
        return VirtualTryOnResponse(
            image_url=image_url,
            message="Virtual try-on with Imagen completed successfully",
            category="Imagen AI",
            processing_time=processing_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in virtual try-on Imagen: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Imagen virtual try-on failed: {str(e)}")
    finally:
        cleanup_files(vton_path, garm_path)