import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  // Extraemos la ruta actual (pathname)
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que cambia la ruta, hacemos scroll arriba a la izquierda
    window.scrollTo(0, 0);
  }, [pathname]); // Se ejecuta cuando 'pathname' cambia

  return null; // Este componente no renderiza nada visual
};

