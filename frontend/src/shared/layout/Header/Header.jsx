import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Heart,
  User,
  CarFront,
  Sparkles,
  Search,
} from "lucide-react";
import useAuthStore, { useAuthActions } from "../../../store/useAuthStore";
import styles from "./Header.module.css";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { clearUser } = useAuthActions();
  const navigate = useNavigate();

  const name = useAuthStore((state) => state.name) || "Usuário";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchNavigation = () => {
    navigate("/search");
  };

  const handleRecommendedNavigation = () => {
    navigate("/recommended");
  };

  const handleFavoritesNavigation = () => {
    navigate("/favorites");
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo} onClick={handleSearchNavigation}>
          <CarFront color="#FF6600" size={32} />
          <h1>AutoMatch</h1>
        </div>

        <nav className={styles.navMenu}>
          <button
            onClick={handleSearchNavigation}
            className={styles.navButton}
            title="Fazer Busca"
          >
            <Search size={18} />
            <span>Buscar</span>
          </button>

          <button
            onClick={handleRecommendedNavigation}
            className={styles.navButton}
            title="Recomendados"
          >
            <Sparkles size={18} />
            <span>Recomendados</span>
          </button>

          <button
            onClick={handleFavoritesNavigation}
            className={styles.navButton}
            title="Favoritos"
          >
            <Heart size={18} />
            <span>Favoritos</span>
          </button>
        </nav>

        <div className={styles.userSection} ref={dropdownRef}>
          <button
            type="button"
            className={styles.userTrigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
          >
            <div className={styles.avatar}>{name.charAt(0)?.toUpperCase()}</div>
            <span className={styles.userName}>{name}</span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${isDropdownOpen ? styles.rotate : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown} role="menu">
              <Link to="/profile" className={styles.dropdownItem}>
                <User size={18} /> Meu Perfil
              </Link>
              <div className={styles.dropdownDivider}></div>
              <button
                type="button"
                onClick={handleLogout}
                className={`${styles.dropdownItem} ${styles.logoutText}`}
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
