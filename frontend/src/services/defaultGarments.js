export const defaultGarments = {
  'Upper-body': [
    { id: 1, path: '/garments/upper/00859_00.jpg', category: 'Upper-body' },
    { id: 2, path: '/garments/upper/00906_00.jpg', category: 'Upper-body' },
    { id: 3, path: '/garments/upper/01382_00.jpg', category: 'Upper-body' },
    { id: 4, path: '/garments/upper/04269_00.jpg', category: 'Upper-body' },
    { id: 5, path: '/garments/upper/04719_00.jpg', category: 'Upper-body' },
  ],
  'Lower-body': [
    { id: 6, path: '/garments/lower/051412_1.jpg', category: 'Lower-body' },
    { id: 7, path: '/garments/lower/051473_1.jpg', category: 'Lower-body' },
    { id: 8, path: '/garments/lower/051515_1.jpg', category: 'Lower-body' },
    { id: 9, path: '/garments/lower/051517_1.jpg', category: 'Lower-body' },
    { id: 10, path: '/garments/lower/051827_1.jpg', category: 'Lower-body' },
    { id: 11, path: '/garments/lower/051946_1.jpg', category: 'Lower-body' },
    { id: 12, path: '/garments/lower/051988_1.jpg', category: 'Lower-body' },
    { id: 13, path: '/garments/lower/051991_1.jpg', category: 'Lower-body' },
  ],
  'Dresses': [
    { id: 14, path: '/garments/dress/051998_1.jpg', category: 'Dresses' },
    { id: 15, path: '/garments/dress/052234_1.jpg', category: 'Dresses' },
    { id: 16, path: '/garments/dress/053290_1.jpg', category: 'Dresses' },
    { id: 17, path: '/garments/dress/053319_1.jpg', category: 'Dresses' },
    { id: 18, path: '/garments/dress/053742_1.jpg', category: 'Dresses' },
    { id: 19, path: '/garments/dress/053744_1.jpg', category: 'Dresses' },
    { id: 20, path: '/garments/dress/053786_1.jpg', category: 'Dresses' },
    { id: 21, path: '/garments/dress/053790_1.jpg', category: 'Dresses' },
  ],
};

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
