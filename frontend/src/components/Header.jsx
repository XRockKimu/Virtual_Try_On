import styles from "./Header.module.css";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>

      <div className={styles.logo}>CATURA</div>

      <nav className={styles.nav}>
        <a href="#">Home</a>
        <a href="#">Men</a>
        <a href="#">Women</a>
        <a href="#">Child</a>
      </nav>

      <div className={styles.icons}>
        <Search size={20} />
        <Heart size={20} />
        <ShoppingBag size={20} />
        <User size={20} />
      </div>
    </header>
  );
}
