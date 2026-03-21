// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Category display name to API value mapping
export const CATEGORY_MAP = {
  'Upper-body': 'upperbody',
  'Lower-body': 'lowerbody',
  'Dresses': 'dress',
};

// Virtual Try-On API Service
export const virtualTryOnAPI = {
  tryOnHD: async (personImage, garmentImage) => {
    const formData = new FormData();
    formData.append('vton_img', personImage);
    formData.append('garm_img', garmentImage);

    const response = await fetch(`${API_BASE_URL}/api/virtual-tryon/try-on-hd`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to process virtual try-on with HD model');
    }

    return response.json();
  },

  tryOnDC: async (personImage, garmentImage, category = 'upperbody') => {
    const formData = new FormData();
    formData.append('vton_img', personImage);
    formData.append('garm_img', garmentImage);
    formData.append('category', category);

    const response = await fetch(`${API_BASE_URL}/api/virtual-tryon/try-on-dc`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to process virtual try-on with DC model');
    }

    return response.json();
  },

  tryOnGemini: async (personImage, garmentImage) => {
    const formData = new FormData();
    formData.append('vton_img', personImage);
    formData.append('garm_img', garmentImage);

    const response = await fetch(`${API_BASE_URL}/api/virtual-tryon/try-on-gemini`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to process virtual try-on with Gemini model');
    }

    return response.json();
  },
};

// Size Suggestion API Service
export const sizeSuggestionAPI = {

  predict: async (age, height, weight, modelType = 'decision_tree') => {
    const response = await fetch(`${API_BASE_URL}/api/size-suggestion/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: parseFloat(age),
        height: parseFloat(height),
        weight: parseFloat(weight),
        model_type: modelType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get size prediction');
    }

    return response.json();
  },

  getModels: async () => {
    const response = await fetch(`${API_BASE_URL}/api/size-suggestion/models`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available models');
    }

    return response.json();
  },
};

export const bodyMeasurementAPI = {
  predict: async (front, leftSide, heightCm) => {
    const formData = new FormData();
    formData.append('front', front);
    formData.append('left_side', leftSide);
    formData.append('height_cm', heightCm);

    const response = await fetch(`${API_BASE_URL}/api/body-measurements/measure`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to predict body measurements');
    }

    return response.json();
  }
}

// Utility function to get full image URL
export const getImageURL = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

// Export API base URL for other uses
export { API_BASE_URL };
