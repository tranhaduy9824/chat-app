/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("themeDark");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme: boolean) => {
      const newTheme = !prevTheme;
      localStorage.setItem("themeDark", JSON.stringify(newTheme));
      return newTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkTheme) {
      root.style.setProperty("--bg-primary", "rgb(14, 19, 65)");
      root.style.setProperty("--bg-sub-primary", "rgb(2 4 23)");
      root.style.setProperty("--text-color", "white");
      root.style.removeProperty("--clouds-display");
      root.style.setProperty("--stars-display", "block");
    } else {
      root.style.setProperty("--bg-primary", "rgb(105, 199, 254)");
      root.style.setProperty("--bg-sub-primary", "#dce2f0");
      root.style.setProperty("--text-color", "white");
      root.style.setProperty("--bg-primary-gentle", "#c2d6ff");
      root.style.setProperty("--bg-sub-primary-gentle", "#f0f5ff");
      root.style.setProperty("--clouds-display", "block");
      root.style.removeProperty("--stars-display");
    }

    root.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById("stars");
      if (starsContainer) {
        starsContainer.innerHTML = "";
        for (let i = 0; i < 100; i++) {
          const star = document.createElement("div");
          star.className = "star";
          star.style.top = `${Math.random() * 100}%`;
          star.style.left = `${Math.random() * 100}%`;
          starsContainer.appendChild(star);
        }
      }
    };

    const createShootingStar = () => {
      const starsContainer = document.getElementById("stars");
      if (starsContainer) {
        const shootingStar = document.createElement("div");
        shootingStar.className = "shooting-star";
        shootingStar.style.top = `${Math.random() * 100}%`;
        shootingStar.style.left = `${Math.random() * 100}%`;
        shootingStar.style.animationDuration = "2s";
        starsContainer.appendChild(shootingStar);

        setTimeout(() => {
          starsContainer.removeChild(shootingStar);
          createShootingStar();
        }, 2000);
      }
    };

    if (isDarkTheme) {
      createStars();
      setTimeout(createShootingStar, Math.random() * 5000);
    }
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
      <div id="clouds" style={{ display: "var(--clouds-display, none)" }}>
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
        <div className="cloud x6"></div>
        <div className="cloud x7"></div>
        <div className="cloud x8"></div>
        <div className="cloud x9"></div>
        <div className="cloud x10"></div>
      </div>
      <div id="stars" style={{ display: "var(--stars-display, none)" }}></div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
