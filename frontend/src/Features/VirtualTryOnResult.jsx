// src/Features/VirtualTryOnResult.jsx

import styles from "./VirtualTryOnResult.module.css";

export default function VirtualTryOnResult({ resultImage, onBack }) {
  return (
    <div className={styles.wrapper}>
      <h2>Try-On Result</h2>
      <p>Your virtual outfit preview is ready</p>

      {/* Result Image */}
      <div className={styles.resultBox}>
        <img src={resultImage} alt="Try On Result" />
      </div>

      {/* Back Button */}
      <button className={styles.backBtn} onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}
