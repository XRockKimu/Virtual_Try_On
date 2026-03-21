export default function CameraModal({ cameraMode, videoRef, onCapture, onClose }) {
  if (!cameraMode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">
          Capture {cameraMode === 'front' ? 'Front' : 'Side'} Image
        </h3>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg mb-4"
        />
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCapture}
            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            Capture Photo
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
