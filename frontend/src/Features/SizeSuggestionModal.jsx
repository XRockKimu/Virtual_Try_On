import { X } from "lucide-react";
import { useState } from "react";
import styles from "./SizeSuggestionModal.module.css";

export default function SizeSuggestionModal({ onClose }) {
  // Form Inputs
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [modelType, setModelType] = useState("decision_tree");

  // Prediction Result
  const [prediction, setPrediction] = useState(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  // Submit Prediction Request
  async function handlePredict() {
    // Validation: Empty fields
    if (!height || !weight || !age) {
      alert("Please enter height, weight, and age.");
      return;
    }

    // Validation: Positive values only
    if (height <= 0 || weight <= 0 || age <= 0) {
      alert("Please enter valid positive numbers.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height_cm: parseFloat(height),
          weight_kg: parseFloat(weight),
          age: parseInt(age),
          model_type: modelType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Prediction failed.");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Reset Prediction
  function handleTryAgain() {
    setPrediction(null);
    setError(null);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/*  HEADER  */}
        <div className={styles.header}>
          <h2>Size Suggestion</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/*  FORM  */}
        {!prediction ? (
          <div className={styles.form}>
            {/* Height */}
            <div className={styles.inputBox}>
              <label>* Height (cm)</label>
              <input
                type="number"
                placeholder="Example: 170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Weight */}
            <div className={styles.inputBox}>
              <label>* Weight (kg)</label>
              <input
                type="number"
                placeholder="Example: 80"
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
                placeholder="Example: 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Model Selection */}
            <div className={styles.inputBox}>
              <label>* Model</label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                disabled={loading}
              >
                <option value="decision_tree">Decision Tree</option>
                <option value="neural_network">Neural Network (MLP)</option>
                <option value="naive_bayes">Naive Bayes</option>
              </select>
            </div>
          </div>
        ) : (
          // RESULT
          <div className={styles.result}>
            <h3>
               Suggested Size:{" "}
              <span className={styles.size}>{prediction.recommended_size}</span>
            </h3>

            {/* Confidence + Alternatives */}
            {prediction.alternatives && prediction.alternatives.length > 0 && (
              <div className={styles.altBox}>
                <h4>Other Possible Sizes:</h4>

                <ul>
                  {prediction.alternatives
                    // Remove duplicate recommended size
                    .filter(
                      (alt) => alt.size !== prediction.recommended_size
                    )
                    .map((alt, index) => (
                      <li key={index}>
                        {alt.size} — Confidence:{" "}
                        <strong>
                          {(alt.score * 100).toFixed(1)}%
                        </strong>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Note */}
            {prediction.alternatives_note && (
              <p className={styles.note}>{prediction.alternatives_note}</p>
            )}

            {/* Model Version */}
            <p className={styles.modelVersion}>
              Model Used: {prediction.model_version}
            </p>
          </div>
        )}

        {/* LOADING / ERROR */}
        {loading && (
          <p className={styles.loading}>Predicting your best size...</p>
        )}

        {error && <p className={styles.error}>⚠ {error}</p>}

        {/* ACTIONS  */}
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          {!prediction && (
            <button
              className={styles.nextBtn}
              onClick={handlePredict}
              disabled={loading}
            >
              Get Suggestion →
            </button>
          )}

          {prediction && (
            <>
              <button
                className={styles.nextBtn}
                onClick={handleTryAgain}
                disabled={loading}
              >
                Try Again
              </button>

              <button
                className={styles.nextBtn}
                onClick={onClose}
                disabled={loading}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
