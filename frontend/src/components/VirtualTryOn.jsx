import { useState } from 'react';
import { virtualTryOnAPI, CATEGORY_MAP } from '../services/api';
import { urlToFile } from '../services/defaultGarments';
import { urlToFile as modelUrlToFile } from '../services/defaultModels';
import ImageUpload from './VirtualTryOn/ImageUpload';
import ModelSelector from './VirtualTryOn/ModelSelector';
import CategorySelector from './VirtualTryOn/CategorySelector';
import GarmentGallery from './VirtualTryOn/GarmentGallery';
import ModelGallery from './VirtualTryOn/ModelGallery';
import ResultDisplay from './VirtualTryOn/ResultDisplay';

export default function VirtualTryOn() {
  const [personImage, setPersonImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [personPreview, setPersonPreview] = useState(null);
  const [garmentPreview, setGarmentPreview] = useState(null);
  const [category, setCategory] = useState('Upper-body');
  const [model, setModel] = useState('dc');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [garmentMode, setGarmentMode] = useState('upload');

  const handleModelChange = (newModel) => {
    setModel(newModel);
    if (newModel === 'hd' && (category === 'Lower-body' || category === 'Dresses')) {
      setCategory('Upper-body');
    }
  };

  const handlePersonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPersonPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGarmentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGarmentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setGarmentPreview(reader.result);
      reader.readAsDataURL(file);
      setGarmentMode('upload');
    }
  };

  const handleDefaultGarmentSelect = async (garment) => {
    try {
      setLoading(true);
      const filename = garment.path.split('/').pop();
      const file = await urlToFile(garment.path, filename);
      if (file) {
        setGarmentImage(file);
        setGarmentPreview(garment.path);
        setGarmentMode('default');
      }
    } catch (error) {
      setError('Failed to load default garment');
      console.error('Error loading garment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDefaultModelSelect = async (model) => {
    try {
      setLoading(true);
      const filename = model.path.split('/').pop();
      const file = await modelUrlToFile(model.path, filename);
      if (file) {
        setPersonImage(file);
        setPersonPreview(model.path);
      }
    } catch (error) {
      setError('Failed to load default model');
      console.error('Error loading model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTryOn = async () => {
    if (!personImage || !garmentImage) {
      setError('Please upload both person and garment images');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      
      if (model === 'hd') {
        data = await virtualTryOnAPI.tryOnHD(personImage, garmentImage);
      } else if (model === 'dc') {
        data = await virtualTryOnAPI.tryOnDC(personImage, garmentImage, CATEGORY_MAP[category] ?? category);
      } else if (model === 'gemini') {
        data = await virtualTryOnAPI.tryOnGemini(personImage, garmentImage);
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPersonImage(null);
    setGarmentImage(null);
    setPersonPreview(null);
    setGarmentPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {!result ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Card - Left Side */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-brand-950 mb-3">Virtual Try-On</h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl leading-relaxed">Experience fashion instantly. Upload your photo and choose a garment to see your new look.</p>

            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUpload
                  type="person"
                  preview={personPreview}
                  onImageChange={handlePersonImageChange}
                  onRemove={() => {
                    setPersonImage(null);
                    setPersonPreview(null);
                  }}
                />

                <ImageUpload
                  type="garment"
                  preview={garmentPreview}
                  onImageChange={handleGarmentImageChange}
                  onRemove={() => {
                    setGarmentImage(null);
                    setGarmentPreview(null);
                    setGarmentMode('upload');
                  }}
                />
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <ModelSelector model={model} setModel={handleModelChange} />
              </div>

              {model === 'dc' && garmentMode === 'upload' && (
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <CategorySelector category={category} setCategory={setCategory} />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-xl text-sm font-medium flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleTryOn}
                  disabled={!personImage || !garmentImage || loading}
                  className="w-full max-w-md px-10 py-5 bg-brand-600 text-white font-bold text-xl rounded-2xl hover:bg-brand-700 disabled:bg-brand-200 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Generate My Look
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Galleries Stack */}
          <div className="flex flex-col gap-8 w-full lg:w-96 flex-shrink-0">
            {/* Default Models Gallery */}
            <ModelGallery
              personPreview={personPreview}
              onModelSelect={handleDefaultModelSelect}
              onClearSelection={() => {
                setPersonImage(null);
                setPersonPreview(null);
              }}
              loading={loading}
            />

            {/* Default Garments Gallery */}
            <GarmentGallery
              category={category}
              setCategory={setCategory}
              garmentPreview={garmentPreview}
              onGarmentSelect={handleDefaultGarmentSelect}
              onClearSelection={() => {
                setGarmentImage(null);
                setGarmentPreview(null);
              }}
              loading={loading}
              garmentMode={garmentMode}
              setGarmentMode={setGarmentMode}
              model={model}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <ResultDisplay result={result} model={model} onReset={resetForm} />
        </div>
      )}
    </div>
  );
}
