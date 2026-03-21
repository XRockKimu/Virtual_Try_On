# Virtual Try-On & Size Suggestion API

## Introduction

This project is a comprehensive AI-powered fashion technology solution that combines **Virtual Try-On** and **Size Suggestion** capabilities. Built with FastAPI, this production-ready API enables users to virtually try on clothing items using advanced diffusion models and receive personalized size recommendations based on their body measurements using machine learning algorithms.

The system leverages:
- **OOTDiffusion** for high-quality virtual try-on generation
- **Google Virtual Try-On** via Gemini API for AI-generated try-on images
- **Machine Learning models** (Decision Tree and Neural Network) for accurate size predictions
- **FastAPI** for a robust and scalable REST API architecture

## Project Objectives

### Primary Objectives
1. **Virtual Try-On Service**: Enable users to visualize how garments look on them by uploading a person image and a garment image
2. **Size Recommendation**: Provide accurate clothing size suggestions based on user's age, height, and weight measurements
3. **Multi-Model Support**: Offer multiple ML models (Decision Tree and Neural Network) for size prediction with model selection flexibility
4. **Production-Ready API**: Deliver a scalable, well-documented, and maintainable API service

### Key Features
- **Multiple Try-On Methods**: HD quality using OOTDiffusion and AI-generated using Gemini Imagen
- **Smart Size Prediction**: ML-powered size recommendations for different body types

## Project Structure

```
api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── api/                    # API endpoints
│   │   ├── size_suggestion.py  # Size prediction endpoints
│   │   └── virtual_tryon.py    # Virtual try-on endpoints
│   ├── core/                   # Core configurations
│   │   ├── config.py           # Settings and environment variables
│   │   └── logging.py          # Logging configuration
│   ├── schemas/                # Pydantic models
│   │   ├── request.py          # Request schemas
│   │   └── response.py         # Response schemas
│   └── services/               # Business logic
│       ├── file_handler.py     # File upload/download handling
│       ├── model_loader.py     # ML model loading
│       ├── predictor.py        # Prediction logic
│       └── preprocessor.py     # Data preprocessing
├── data/
|   └── final_dataset.csv       # Dataset
├── models/                     # Trained ML models
│   ├── decision_tree_model.pkl
│   └── mlp_model.pkl
├── notebooks
|   ├── gemini_services.ipynb   #
|   ├── OOTDiffusion.ipynb      #
|   └── size_suggestion.ipynb   #
├── temp/                       # Temporary file storage
│   ├── upload/                 # Uploaded images
│   └── output/                 # Generated results
├── .env                        # Local Environment Variable
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Project Setup

### Prerequisites
- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd api
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Create virtual environment
   py -3.12 -m venv .venv
   
   # Activate on Linux/Mac
   source .venv/bin/activate
   
   # Activate on Windows
   # .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MODEL_DECISION_TREE_PATH="models/decision_tree_model.pkl"
   MODEL_NEURAL_NETWORK_PATH="models/mlp_model.pkl"
   MODEL_VERSION="dev"

   GOOGLE_CLOUD_PROJECT=your-gcp-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   GOOGLE_GENAI_USE_VERTEXAI=true
   VIRTUAL_TRY_ON_MODEL="virtual-try-on-001"
   ```

5. **Authenticate with Hugging Face** (Required for OOTDiffusion)
   
   The OOTDiffusion model on Hugging Face may require authentication. Set up your Hugging Face token:
   
   ```bash
   # Install huggingface-hub if not already installed
   pip install huggingface-hub
   
   # Login with your Hugging Face token
   huggingface-cli login
   ```

   When prompted, paste your Hugging Face token. Get your token from: https://huggingface.co/settings/tokens

   More details: [link](./docs/AUTHENTICATION.md#1-hugging-face-authentication)

6. **Authenticate with Google Cloud** (Required for Gemini Virtual Try-On)
   
   For Vertex AI and Gemini API access:
   
   ```bash
   # Install Google Cloud SDK if not already installed
   # Download from: https://cloud.google.com/sdk/docs/install
   
   # Login to Google Cloud
   gcloud auth login
   
   # Set your project
   gcloud config set project YOUR_PROJECT_ID
   
   # Authenticate for application default credentials
   gcloud auth application-default login
   
   # Enable required APIs
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable generativelanguage.googleapis.com
   ```
   
   Make sure your Google Cloud project has:
   - Vertex AI API enabled
   - Generative Language API enabled
   - Appropriate billing configured

   More details: [link](./docs/AUTHENTICATION.md#2-google-cloud-authentication)

  > ** Detailed Authentication Guide:** See [AUTHENTICATION.md](./docs/AUTHENTICATION.md) for comprehensive setup instructions, troubleshooting, and best practices.

7. **Ensure required directories exist**
   ```bash
   # On Linux/Mac
   mkdir -p temp/upload temp/output data
   
   # On Windows PowerShell
   New-Item -ItemType Directory -Force -Path temp\upload, temp\output, data
   ```

8. **Run the application**
   ```bash
   # using uvicorn 
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

9. **Access the API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Postman Testing Tips

1. **Environment Variables**: Create a Postman environment with:
   - `base_url`: `http://localhost:8000`
   - Then use `{{base_url}}/api/size-suggestion/predict` in requests

2. **Image Testing**: 
   - Keep test images in a dedicated folder
   - Use images with clear person and garment visibility
   - Recommended formats: JPG, PNG
   - Recommended size: Under 10MB

3. **View Generated Images**: 
   - The API returns a relative URL in `image_url` field
   - Access images via: `http://localhost:8000` + `image_url`
   - Example: `http://localhost:8000/outputs/hd_tryon_abc123.jpg`
   - You can also browse all outputs at `http://localhost:8000/outputs/`

4. **Error Handling Test Cases**:
   - Invalid data (negative values, missing fields)
   - Unsupported file types
   - Missing API keys (for Gemini endpoints)
   - Missing authentication (Hugging Face token, Google Cloud credentials)

5. **Collection Export**: Save your Postman collection for reuse:
   - Click on collection → Export → Collection v2.1
   - Share with team members

## Troubleshooting

### Common Issues

1. **Models Not Loading**
   - Ensure `.pkl` files exist in the `models/` directory
   - Check file paths in `.env` configuration

2. **Gemini API Errors**
   - Check API quota and billing status

3. **OOTDiffusion Connection Failed**
   - Check internet connection
   - Gradio space might be temporarily unavailable
   - Verify Hugging Face authentication: `huggingface-cli whoami`
   - Try logging in again: `huggingface-cli login`

4. **File Upload Errors**
   - Ensure `temp/upload` and `temp/output` directories exist
   - Check file size limits and permissions

5. **Google Cloud / Vertex AI Errors**
   - Verify authentication: `gcloud auth list`
   - Check project is set: `gcloud config get-value project`
   - Ensure APIs are enabled: `gcloud services list --enabled`
   - Verify application default credentials: `gcloud auth application-default print-access-token`
   - Check billing is enabled for your project

## Technology Stack

- **Framework**: FastAPI
- **ML Libraries**: scikit-learn, joblib
- **AI Services**: Gradio Client (OOTDiffusion), Google Gemini
- **Data Validation**: Pydantic
- **Server**: Uvicorn
- **Image Processing**: PIL, base64
- **Environment Management**: python-dotenv

## Contributing

This is a capstone project for Cambodia Academy of Digital Technology. For questions or contributions, please contact the development team.

## License

This project is developed as part of academic coursework at Cambodia Academy of Digital Technology.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  