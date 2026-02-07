// src/Features/VirtualTryOnModal.jsx

import { useState } from "react";
import VirtualTryOnUpload from "./VirtualTryOnUpload";
import VirtualTryOnResult from "./VirtualTryOnResult";
import { generateTryOn } from "./virtualTryOnService";

import styles from "./VirtualTryOnModal.module.css";

export default function VirtualTryOnModal({ onClose }) {
  const [step, setStep] = useState(1);

  const [userImage, setUserImage] = useState(null);
  const [productImage, setProductImage] = useState(null);

  const [resultImage, setResultImage] = useState(null);

  // When user clicks Next
  const handleNext = async () => {
    if (!userImage || !productImage) {
      alert("Please upload both user and product images.");
      return;
    }

    // Generate demo result (later ML API)
    const result = await generateTryOn(userImage, productImage);

    setResultImage(result);
    setStep(2);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Step 1 Upload */}
        {step === 1 && (
          <VirtualTryOnUpload
            userImage={userImage}
            productImage={productImage}
            setUserImage={setUserImage}
            setProductImage={setProductImage}
            onNext={handleNext}
          />
        )}

        {/* Step 2 Result */}
        {step === 2 && (
          <VirtualTryOnResult
            resultImage={resultImage}
            onBack={() => setStep(1)}
          />
        )}
      </div>
    </div>
  );
}
