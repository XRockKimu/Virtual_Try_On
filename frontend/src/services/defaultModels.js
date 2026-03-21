export const defaultModels = [
  { id: 1, path: '/model/01409_00.jpg', name: 'Model 1' },
  { id: 2, path: '/model/051962_0.jpg', name: 'Model 2' },
  { id: 3, path: '/model/visa_model.jpg', name: 'Model 3' },
  { id: 4, path: '/model/01543_00.jpg', name: 'Model 4' },
];

// Helper function to convert URL to File object
export async function urlToFile(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to file:', error);
    return null;
  }
}
