// src/Features/VirtualTryOnUpload.jsx

import styles from "./VirtualTryOnUpload.module.css";

export default function VirtualTryOnUpload({
  userImage,
  productImage,
  setUserImage,
  setProductImage,
  onNext,
}) {
  const handleUserUpload = (e) => {
    setUserImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleProductUpload = (e) => {
    setProductImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className={styles.wrapper}>
      <h2>Virtual Try-On</h2>
      <p>Upload your photo and the product image</p>

      {/* Upload User */}
      <div className={styles.uploadBox}>
        <label>User Photo:</label>
        <input type="file" accept="image/*" onChange={handleUserUpload} />
        {userImage && <img src={userImage} alt="User Preview" />}
      </div>

      {/* Upload Product */}
      <div className={styles.uploadBox}>
        <label>Product Photo:</label>
        <input type="file" accept="image/*" onChange={handleProductUpload} />
        {productImage && <img src={productImage} alt="Product Preview" />}
      </div>

      {/* Next Button */}
      <button className={styles.nextBtn} onClick={onNext}>
        Next →
      </button>
    </div>
  );
}
