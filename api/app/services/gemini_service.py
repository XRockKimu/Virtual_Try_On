import logging
import os
from pathlib import Path
from google import genai

logger = logging.getLogger(__name__)

# Gemini client
GEMINI_CLIENT = None


def get_gemini_client():
    global GEMINI_CLIENT
    if GEMINI_CLIENT is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        GEMINI_CLIENT = genai.Client(api_key=api_key)
        logger.info("Gemini client initialized successfully")
    
    return GEMINI_CLIENT


async def generate_tryon_with_imagen(
    person_image_path: Path,
    garment_image_path: Path,
    model: str = "imagen-3.0-generate-001"
) -> bytes:
    try:
        client = get_gemini_client()
        
        # Read both images as binary data
        with open(person_image_path, "rb") as f:
            person_image_data = f.read()
        
        with open(garment_image_path, "rb") as f:
            garment_image_data = f.read()
        
        # Create detailed prompt with reference to both images
        prompt = """
        Create a photorealistic virtual try-on image. 
        Take the person from the first image and dress them in the garment from the second image.
        
        Requirements:
        - Place the garment naturally on the person's body matching their pose
        - Maintain realistic proportions and proper fit
        - Preserve the person's original pose, face, and background
        - Add natural shadows, lighting, and fabric wrinkles
        - Ensure the garment drapes realistically on the body
        - Keep clothing colors and patterns from the garment image
        """
        
        # Generate image with Imagen using both reference images
        response = client.models.generate_images(
            model=model,
            prompt=prompt,
            number_of_images=1,
            reference_images=[
                {"image": person_image_data, "reference_type": "STYLE"},
                {"image": garment_image_data, "reference_type": "SUBJECT"}
            ],
            config={
                "aspect_ratio": "1:1",
                "safety_filter_level": "block_some",
                "person_generation": "allow_adult"
            }
        )
        
        # Get the generated image
        generated_image = response.generated_images[0].image.image_bytes
        
        logger.info("Imagen API generated virtual try-on successfully.")
        return generated_image
        
    except Exception as e:
        logger.error(f"Error in Imagen virtual try-on: {str(e)}")
        raise
