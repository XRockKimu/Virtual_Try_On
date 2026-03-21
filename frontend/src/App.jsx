import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import SizeSuggestionPage from './pages/SizeSuggestionPage';
import BodyMeasurementsPage from './pages/BodyMeasurementsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="py-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/body-measurements" replace />} />
            <Route path="/virtual-tryon" element={<VirtualTryOnPage />} />
            <Route path="/size-suggestion" element={<SizeSuggestionPage />} />
            <Route path="/body-measurements" element={<BodyMeasurementsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;