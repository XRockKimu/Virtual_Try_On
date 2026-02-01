import { X } from "lucide-react";
import { useState } from "react";
import styles from "./SizeSuggestionModal.module.css";

export default function SizeSuggestionModal({ onClose }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleNext() {
    if (!height || !weight || !age) {
      alert("Please enter height, weight, and age!");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height_cm: parseFloat(height),
          weight_kg: parseFloat(weight),
          age: parseFloat(age),
          model_type: "decision_tree",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Prediction failed");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        {!prediction ? (
          <div className={styles.form}>
            {/* Height */}
            <div className={styles.inputBox}>
              <label>* Height</label>
              <input
                type="number"
                placeholder="Example 170 cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            {/* Age */}
            <div className={styles.inputBox}>
              <label>* Age</label>
              <input
                type="number"
                placeholder="Example 25 years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        ) : (
          <div className={styles.result}>
            <h3>Suggested Size: {prediction.recommended_size}</h3>
            {prediction.alternatives && prediction.alternatives.length > 0 && (
              <div>
                <h4>Alternatives:</h4>
                <ul>
                  {prediction.alternatives.map((alt, index) => (
                    <li key={index}>
                      {alt.size} (Score: {alt.score.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {prediction.alternatives_note && (
              <p className={styles.note}>{prediction.alternatives_note}</p>
            )}
            <p className={styles.modelVersion}>Model: {prediction.model_version}</p>
          </div>
        )}

        {/* Loading / Error */}
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>

          {!prediction && (
            <button className={styles.nextBtn} onClick={handleNext} disabled={loading}>
              Get Suggestion →
            </button>
          )}
           {prediction && (
            <button className={styles.nextBtn} onClick={onClose} disabled={loading}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
