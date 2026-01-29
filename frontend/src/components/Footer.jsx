import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <h2>GET THE LATEST UPDATES</h2>

        <div className={styles.subscribeBox}>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <h1>CATURA</h1>
          <p>Try-On Without Trying</p>
        </div>

        <div className={styles.column}>
          <h3>SITEMAP</h3>
          <ul>
            <li>Home</li>
            <li>Shop</li>
            <li>Virtual Try-On</li>
            <li>Size Suggestion</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>UTILITIES</h3>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Documentation</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3>SOCIAL</h3>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>TikTok</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        © {new Date().getFullYear()} CATURA. All rights reserved.
      </div>
    </footer>
  );
}
