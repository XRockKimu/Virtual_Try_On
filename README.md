# Virtual Try-On and Size Suggestion Capstone Project

## Introduction

This capstone project is a comprehensive AI-powered fashion technology solution that addresses two critical challenges in online shopping: **uncertainty about garment fit** and **difficulty visualizing how clothes will look**. By combining advanced computer vision and machine learning techniques, our system provides users with personalized size recommendations and realistic virtual try-on experiences.

The platform consists of two main components:
- **Frontend**: A modern, responsive web application built with React and Vite
- **Backend API**: A production-ready FastAPI service that handles ML model inference and image processing

### Problem Statement

Online shopping faces significant obstacles:
- High return rates due to incorrect sizing (estimated 30-40% in fashion e-commerce)
- Inability to physically try on clothes before purchase
- Lack of personalized recommendations based on body measurements
- Inconsistent sizing standards across brands

### Our Solution

We developed an integrated system that:
1. **Predicts optimal clothing sizes** using machine learning models trained on body measurements (age, height, weight)
2. **Generates realistic virtual try-on images** using state-of-the-art diffusion models (OOTDiffusion)
3. **Provides multiple model options** for flexibility and accuracy comparison
4. **Delivers a seamless user experience** through an intuitive web interface

## Core Features

### 1. Virtual Try-On System
- **OOTDiffusion Integration**: High-quality virtual try-on generation using advanced diffusion models for controllable and realistic garment fitting
- **Dual-Category Support**: Separate processing for upper-body garments (tops, shirts) and lower-body garments (pants, skirts)
- **Multiple Quality Options**: Choose between HD quality (OOTDiffusion) and AI-generated results (Gemini Imagen)
- **Image Upload**: Support for user photos and garment images
- **Real-time Processing**: Efficient model inference with optimized pipelines

### 2. Size Suggestion Engine
- **Multi-Model Approach**: Two trained ML models for size prediction:
  - Decision Tree Model: Fast, interpretable predictions
  - Neural Network (MLP): High accuracy with complex pattern recognition
- **Personal Measurements**: Size recommendations based on:
  - Age
  - Height (cm)
  - Weight (kg)
- **Standardized Sizes**: Predictions for standard clothing sizes (XS, S, M, L, XL, XXL)
- **Model Selection**: Users can choose their preferred prediction model

### 3. Technical Features
- **RESTful API**: Well-documented endpoints with FastAPI
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **File Management**: Secure upload and temporary file handling
- **Error Handling**: Comprehensive error responses and validation
- **Logging System**: Detailed logging for debugging and monitoring
- **Static File Serving**: Efficient delivery of generated images

### 4. User Interface
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Body Measurements Input**: User-friendly form for entering measurements
- **Product Detail Pages**: Integrated size suggestion and try-on features
- **Modal-based Interactions**: Clean, focused user experience for each feature
- **Result Visualization**: Clear display of generated try-on images and size recommendations

## Constraints and Limitations

### Technical Constraints
- **Model Size**: OOTDiffusion models are large (8GB), requiring significant storage and memory
- **Processing Time**: Virtual try-on generation can take 30-60 seconds depending on hardware
- **GPU Requirements**: Optimal performance requires CUDA-compatible GPU
- **Image Quality**: Input images must meet certain quality standards for best results
- **File Size Limits**: Upload size restrictions to prevent resource exhaustion

### Model Limitations
- **Size Prediction Scope**: Currently limited to standard sizes (XS-XXL); doesn't account for brand-specific sizing variations
- **Virtual Try-On Quality**: 
  - Best results with clear, well-lit photos with minimal background clutter
  - May struggle with complex patterns or textures
  - Performance varies with pose and body position
- **Training Data**: Size prediction model trained on specific demographic data; accuracy may vary for edge cases

### System Limitations
- **Single User Processing**: No concurrent request handling optimization in current implementation
- **Temporary Storage**: Generated images stored temporarily; no persistent user data storage
- **Network Dependency**: Requires stable internet connection for API communication
- **Browser Compatibility**: Best performance on modern browsers with JavaScript enabled

### Scope Limitations
- **Garment Types**: Currently optimized for tops and bottoms; accessories and full-body outfits not fully supported
- **Body Measurements**: Limited to age, height, and weight; doesn't include detailed measurements (chest, waist, hips)
- **Personalization**: No user accounts or history tracking
- **Multi-language**: Currently English-only interface



## Acknowledgement

```
@article{xu2024ootdiffusion,
  title={OOTDiffusion: Outfitting Fusion based Latent Diffusion for Controllable Virtual Try-on},
  author={Xu, Yuhao and Gu, Tao and Chen, Weifeng and Chen, Chengcai},
  journal={arXiv preprint arXiv:2403.01779},
  year={2024}
}
```

## Under Adivsory
- Ms. Sam Sreyleak

## Teammember
- Both Chealean
- Chheang Sovanpanha
- Huy Visa
- Ly Kimkheng
- Nem Vuthsovannath