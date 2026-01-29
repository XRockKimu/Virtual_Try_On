import { X, UploadCloud } from "lucide-react";
import styles from "./VirtualTryOnModal.module.css";

export default function VirtualTryOnModal({ onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Virtual Try-On</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Upload Box */}
        <div className={styles.uploadBox}>
          <UploadCloud size={40} />

          <p>
            Drag your file(s) or <span>browse</span>
          </p>

          <small>
            Max 10 MB files are allowed <br />
            Only support .jpg and .png files
          </small>
        </div>

        {/* Buttons */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.uploadBtn}>
            Upload →
          </button>
        </div>
      </div>
    </div>
  );
}
