# Virtual Try-On & Size Suggestion - Frontend

## Introduction

Frontend application built with **React** and **Vite** that provides a user interface for virtual try-on generation and personalized size recommendations.

## Tech Stack

- **React 19.2.4** + **Vite 7.2.4**
- **Tailwind CSS 3.4.19** - Styling
- **React Router DOM 7.13.0** - Routing
- **Lucide React** - Icons
- **ESLint** - Code quality

## Features

- **Virtual Try-On Interface** - Upload person and garment images, or choose from default garments organized by category
- **Default Garment Gallery** - Pre-loaded clothing options for quick try-on (upper body, lower body, dresses)
- **Size Suggestion System** - Get personalized size recommendations based on body measurements
- **Responsive Design** - Works on desktop and mobile devices
- **Modal-based UI** - Clean, focused user interactions

## Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- Backend API running

### Installation
```bash
cd frontend
npm install
```

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

### Run Development Server
```bash
npm run dev
```

### Adding Default Garment Images

To add default garment images for the virtual try-on feature:

1. Place images in `public/garments/` folders:
   - `upper/` - Upper body garments (t-shirts, jackets, etc.)
   - `lower/` - Lower body garments (jeans, pants, etc.)
   - `dress/` - Dresses and gowns

2. Update `src/services/defaultGarments.js` with your image paths

See `public/garments/README.md` for detailed instructions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── App.jsx          # Main app with React Router configuration
├── components/      # Reusable UI components
│   ├── VirtualTryOn/   # Modular sub-components for virtual try-on
│   │   ├── ImageUpload.jsx
│   │   ├── PreviewCard.jsx
│   │   ├── ModelSelector.jsx
│   │   ├── CategorySelector.jsx
│   │   ├── GarmentGallery.jsx
│   │   └── ResultDisplay.jsx
│   ├── SizeSuggestion/  # Modular sub-components for size suggestion
│   │   ├── MeasurementInputs.jsx
│   │   ├── ModelTypeSelector.jsx
│   │   └── SizeResult.jsx
│   ├── BodyMeasurements/ # Modular sub-components for body measurements
│   │   ├── MeasurementGuide.jsx
│   │   ├── MeasurementForm.jsx
│   │   └── MeasurementResult.jsx
│   ├── VirtualTryOn.jsx
│   ├── SizeSuggestion.jsx
│   ├── BodyMeasurements.jsx
│   └── Navbar.jsx
├── pages/           # Page components for routing
│   ├── VirtualTryOnPage.jsx
│   ├── SizeSuggestionPage.jsx
│   └── BodyMeasurementsPage.jsx
└── services/        # API integration (api.js, defaultGarments.js)
```

## Routes

- `/` - Redirects to Virtual Try-On
- `/virtual-tryon` - Virtual try-on interface
- `/size-suggestion` - Size recommendation system
- `/body-measurements` - Body measurements input

---

**CADT Capstone Project 2026**