# Default Garment Images

This folder contains default garment images organized by category for the Virtual Try-On feature.

## Folder Structure

- `upper/` - Upper body garments (t-shirts, hoodies, jackets, shirts, etc.)
- `lower/` - Lower body garments (jeans, pants, shorts, skirts, etc.)
- `dress/` - Full dresses and gowns

## How to Add Images

1. Place your garment images in the appropriate category folder
2. Update the `src/services/defaultGarments.js` file to reference your new images

### Image Guidelines

- **Format**: JPG or PNG
- **Size**: Recommended 512x512px or 1024x1024px
- **Background**: Plain or transparent background works best
- **Quality**: High resolution for better try-on results
- **Naming**: Use descriptive names (e.g., `tshirt-1.jpg`, `hoodie-blue.jpg`)

## Example File Names

### Upper Body
- `tshirt-1.jpg`
- `hoodie-1.jpg`
- `jacket-1.jpg`
- `shirt-1.jpg`

### Lower Body
- `jeans-1.jpg`
- `pants-1.jpg`
- `shorts-1.jpg`
- `skirt-1.jpg`

### Dresses
- `dress-1.jpg`
- `gown-1.jpg`
- `dress-2.jpg`

## After Adding Images

After adding new images, update the paths in `src/services/defaultGarments.js`:

```javascript
export const defaultGarments = {
  'Upper-body': [
    { id: 1, name: 'Your Garment Name', path: '/garments/upper/your-file.jpg' },
    // Add more...
  ],
  // ...
};
```
