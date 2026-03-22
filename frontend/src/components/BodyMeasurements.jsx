import { useState, useRef } from "react";
import { bodyMeasurementAPI } from "../services/api";
import ImageUploadSection from "./BodyMeasurements/ImageUploadSection";
import HeightInput from "./BodyMeasurements/HeightInput";
import CameraModal from "./BodyMeasurements/CameraModal";
import MeasurementResult from "./BodyMeasurements/MeasurementResult";

export default function BodyMeasurements() {
  const [frontImage, setFrontImage] = useState(null);
  const [frontImagePreview, setFrontImagePreview] = useState(null);
  const [leftSideImage, setLeftSideImage] = useState(null);
  const [leftSideImagePreview, setLeftSideImagePreview] = useState(null);
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [cameraMode, setCameraMode] = useState(null); // 'front' or 'side'
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frontFileInputRef = useRef(null);
  const sideFileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'front') {
        setFrontImage(file);
        setFrontImagePreview(URL.createObjectURL(file));
      } else {
        setLeftSideImage(file);
        setLeftSideImagePreview(URL.createObjectURL(file));
      }
    }
  };

  // Start camera
  const startCamera = async (type) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setCameraMode(type);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], `${cameraMode}-image.jpg`, { type: 'image/jpeg' });
        
        if (cameraMode === 'front') {
          setFrontImage(file);
          setFrontImagePreview(URL.createObjectURL(file));
        } else {
          setLeftSideImage(file);
          setLeftSideImagePreview(URL.createObjectURL(file));
        }
        
        stopCamera();
      }, 'image/jpeg');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraMode(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!frontImage || !leftSideImage || !height) {
      setError('Please provide both images and height.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await bodyMeasurementAPI.predict(frontImage, leftSideImage, parseFloat(height));
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to process measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFrontImage(null);
    setFrontImagePreview(null);
    setLeftSideImage(null);
    setLeftSideImagePreview(null);
    setHeight('');
    setResult(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-brand-950 mb-3">Body Measurements</h2>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl leading-relaxed">Upload or capture your front and side images to get accurate body measurements for a perfect fit.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {/* Camera View */}
        <CameraModal
          cameraMode={cameraMode}
          videoRef={videoRef}
          onCapture={capturePhoto}
          onClose={stopCamera}
        />

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* Front Image Upload */}
            <ImageUploadSection
              type="front"
              preview={frontImagePreview}
              onFileUpload={(e) => handleFileUpload(e, 'front')}
              onStartCamera={() => startCamera('front')}
              onRemove={() => {
                setFrontImage(null);
                setFrontImagePreview(null);
              }}
              fileInputRef={frontFileInputRef}
            />

            {/* Side Image Upload */}
            <ImageUploadSection
              type="side"
              preview={leftSideImagePreview}
              onFileUpload={(e) => handleFileUpload(e, 'side')}
              onStartCamera={() => startCamera('side')}
              onRemove={() => {
                setLeftSideImage(null);
                setLeftSideImagePreview(null);
              }}
              fileInputRef={sideFileInputRef}
            />
          </div>

          {/* Height Input */}
          <HeightInput height={height} setHeight={setHeight} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <button
              type="submit"
              disabled={loading || !frontImage || !leftSideImage || !height}
              className="px-16 py-4 bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 disabled:bg-brand-200 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center min-w-[280px]"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Analysis...
                </span>
              ) : (
                'Get Measurements'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-10 py-4 bg-white border border-gray-200 text-gray-600 font-bold text-lg rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results Section */}
        {result && (
          <MeasurementResult result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
