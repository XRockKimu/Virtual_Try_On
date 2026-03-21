# Authentication Setup Guide

This guide provides detailed instructions for setting up authentication for the Virtual Try-On & Size Suggestion API.

## Overview

The API requires authentication for two main services:
1. **Hugging Face** - For OOTDiffusion virtual try-on (HD and DC endpoints)
2. **Google Cloud / Vertex AI** - For Gemini virtual try-on (Gemini endpoint)

## 1. Hugging Face Authentication

### Why is it needed?
The OOTDiffusion model requires Hugging Face authentication to access the Gradio space and download model weights.

### Setup Methods

#### Method A: CLI Login (Recommended)

```bash
# Install huggingface-hub (included in requirements.txt)
pip install huggingface-hub

# Login with your token
huggingface-cli login
```

When prompted, paste your Hugging Face token. Get your token from: https://huggingface.co/settings/tokens

#### Method B: Environment Variable

Add to your `.env` file or system environment:

```bash
# Windows PowerShell
$env:HF_TOKEN="hf_your_token_here"

# Linux/Mac
export HF_TOKEN="hf_your_token_here"
```

### Verify Authentication

```bash
# Check if you're logged in
huggingface-cli whoami

# Expected output: your_username
```

### Troubleshooting

**Error: "401 Unauthorized"**
- Token is invalid or expired
- Generate a new token at https://huggingface.co/settings/tokens
- Make sure the token has read permissions

**Error: "Connection refused"**
- Check internet connection
- Verify proxy settings if behind corporate firewall

## 2. Google Cloud Authentication

### Why is it needed?
The Gemini virtual try-on endpoint uses Vertex AI's Imagen model for AI-generated try-on images.

### Prerequisites

1. **Google Cloud Account**
   - Create account at https://cloud.google.com/
   - Enable billing (required for Vertex AI)

2. **Install Google Cloud SDK**
   - Windows: Download from https://cloud.google.com/sdk/docs/install
   - Mac: `brew install google-cloud-sdk`
   - Linux: Follow instructions at https://cloud.google.com/sdk/docs/install

### Setup Steps

#### Step 1: Initialize gcloud

```bash
# Login to Google Cloud
gcloud auth login

# This will open a browser for authentication
# Login with your Google account
```

#### Step 2: Set your project

```bash
# Set the project ID
gcloud config set project YOUR_PROJECT_ID

# Verify
gcloud config get-value project
```

#### Step 3: Application Default Credentials

```bash
# Authenticate for application use
gcloud auth application-default login

# Verify by printing access token
gcloud auth application-default print-access-token
```

#### Step 4: Enable Required APIs

```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Enable Generative Language API
gcloud services enable generativelanguage.googleapis.com

# Verify enabled services
gcloud services list --enabled | grep -E "aiplatform|generativelanguage"
```

#### Step 5: Update .env file

```env
GOOGLE_CLOUD_PROJECT=your-actual-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_GENAI_USE_VERTEXAI=true
VIRTUAL_TRY_ON_MODEL=virtual-try-on-001
```

### Verify Authentication

```bash
# Check authentication status
gcloud auth list

# Check active project
gcloud config list

# Test API access
gcloud ai models list --region=us-central1
```

### Troubleshooting

**Error: "Project not found"**
- Verify project ID: `gcloud projects list`
- Set correct project: `gcloud config set project PROJECT_ID`

**Error: "API not enabled"**
- Enable required APIs (see Step 4 above)
- Wait a few minutes for APIs to propagate

**Error: "Insufficient permissions"**
- Your account needs "Vertex AI User" role
- Grant role: `gcloud projects add-iam-policy-binding PROJECT_ID --member="user:EMAIL" --role="roles/aiplatform.user"`

**Error: "Billing not enabled"**
- Enable billing at https://console.cloud.google.com/billing
- Link billing account to your project

**Error: "Quota exceeded"**
- Check quota limits at https://console.cloud.google.com/iam-admin/quotas
- Request quota increase if needed

## Complete Authentication Checklist

Before running the API, ensure:

- [ ] Hugging Face CLI login successful (`huggingface-cli whoami` works)
- [ ] Google Cloud CLI login successful (`gcloud auth list` shows active account)
- [ ] Google Cloud project is set (`gcloud config get-value project` returns correct ID)
- [ ] Application default credentials configured (`gcloud auth application-default login` completed)
- [ ] Vertex AI API enabled (`aiplatform.googleapis.com`)
- [ ] Generative Language API enabled (`generativelanguage.googleapis.com`)
- [ ] `.env` file configured with correct project ID and location
- [ ] Billing enabled on Google Cloud project

## Testing Authentication

### Test Hugging Face
```python
from huggingface_hub import whoami
print(whoami())
```

### Test Google Cloud
```python
from google import genai

client = genai.Client(
    vertexai=True,
    project="your-project-id",
    location="us-central1"
)
print("Successfully authenticated with Vertex AI!")
```

### Test via API
```bash
# Test OOTDiffusion endpoint (requires Hugging Face)
curl -X POST http://localhost:8000/api/virtual-tryon/try-on-hd \
  -F "vton_img=@person.jpg" \
  -F "garm_img=@garment.jpg"

# Test Gemini endpoint (requires Google Cloud)
curl -X POST http://localhost:8000/api/virtual-tryon/try-on-gemini \
  -F "vton_img=@person.jpg" \
  -F "garm_img=@garment.jpg"
```

## Additional Resources

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Google Cloud Authentication](https://cloud.google.com/docs/authentication)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Imagen API Reference](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview)

## Support

If you encounter issues not covered in this guide:
1. Check the main README.md for troubleshooting tips
2. Review API documentation at `/docs` endpoint
3. Check service status pages:
   - Hugging Face: https://status.huggingface.co/
   - Google Cloud: https://status.cloud.google.com/
