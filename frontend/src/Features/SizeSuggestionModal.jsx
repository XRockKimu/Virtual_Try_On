import { X } from "lucide-react";
import { useState } from "react";
import styles from "./SizeSuggestionModal.module.css";

export default function SizeSuggestionModal({ onClose }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  function handleNext() {
    if (!height || !weight) {
      alert("Please enter both height and weight!");
      return;
    }

    alert(`Suggested size based on ${height}cm and ${weight}kg`);
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Size Suggestion</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <div className={styles.form}>
          {/* Height */}
          <div className={styles.inputBox}>
            <label>* Height</label>
            <input
              type="number"
              placeholder="Example 170 cm"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div className={styles.inputBox}>
            <label>* Weight</label>
            <input
              type="number"
              placeholder="Example 80 kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button className={styles.nextBtn} onClick={handleNext}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
