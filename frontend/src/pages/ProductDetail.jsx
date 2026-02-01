import { useState } from "react";
import styles from "./ProductDetail.module.css";
import { Heart } from "lucide-react";

import VirtualTryOnModal from "../Features/VirtualTryOnModal";
import SizeSuggestionModal from "../Features/SizeSuggestionModal";

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const sizes = ["S", "M", "L"];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <div className={styles.thumbnails}>
            <img src="/shirt.png" alt="thumb" />
            <img src="/shirt.png" alt="thumb" />
            <img src="/shirt.png" alt="thumb" />
          </div>

          <div className={styles.mainImage}>
            <img src="/shirt.png" alt="product" />
          </div>

          <button
            className={styles.tryOnBtn}
            onClick={() => setShowModal(true)}
          >
            Try On Virtually
          </button>
        </div>

        <div className={styles.detailsSection}>
          <h1 className={styles.title}>Regular Sleeve T-Shirt</h1>

          <p className={styles.price}>
            <span className={styles.newPrice}>$6.88</span>
            <span className={styles.discount}>-35%</span>
            <span className={styles.oldPrice}>$10.59</span>
          </p>

          <div className={styles.optionBlock}>
            <h3>Size</h3>

            <div className={styles.sizes}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${
                    selectedSize === size ? styles.active : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              className={styles.sizeSuggest}
              onClick={() => setShowSizeModal(true)}
            >
              Size Suggestion
            </button>

            <p className={styles.helperText}>
              Unsure about what size to choose?
            </p>
          </div>

          <div className={styles.optionBlock}>
            <h3>Quantity</h3>

            <div className={styles.quantity}>
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                −
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className={styles.wishlist}>
            <Heart size={20} />
          </button>
        </div>
      </div>

      {showModal && <VirtualTryOnModal onClose={() => setShowModal(false)} />}

      {showSizeModal && (
        <SizeSuggestionModal onClose={() => setShowSizeModal(false)} />
      )}
    </>
  );
}
