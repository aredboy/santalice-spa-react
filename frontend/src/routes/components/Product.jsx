import { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductsContext } from "../context/ProductsContext";
import { CartContext } from "../context/CartContext";
import gsap from "gsap"; // Import GSAP
import "../styles/product.css";

export function Product() {
  const { id } = useParams();
  const { products } = useContext(ProductsContext);
  const { addItem } = useContext(CartContext);

  // --- 1. ALL HOOKS MUST BE DECLARED HERE (Before any return) ---
  
  // Find product safely (handle cases where products is null/empty inside the logic)
  const product = Array.isArray(products) 
    ? products.find((p) => String(p.id) === String(id)) 
    : null;

  // Normalize images
  const images = product ? (Array.isArray(product.image) ? product.image : [product.image]) : [];

  // State for carousel
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Ref for the image to animate
  const slideRefs = useRef([]);
  const prevIndexRef = useRef(0);
  const directionRef = useRef(1); // 1 for next, -1 for prev
  

  // Reset to first image when product ID changes
  useEffect(() => {
    setCurrent(0);
  }, [id]);

// --- CAROUSEL ANIMATION ---
  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    // Initial setup: ensure all slides are in correct position on first load
    if (prevIndex === current && slideRefs.current[current]) {
       gsap.set(slideRefs.current, { xPercent: 100 }); // All off to right
       gsap.set(slideRefs.current[current], { xPercent: 0 }); // Current visible
      return;
    }

    const currentSlide = slideRefs.current[current];
    const prevSlide = slideRefs.current[prevIndex];

    setIsAnimating(true);

    if (!currentSlide || !prevSlide) return;

    // Determine direction: 1 (right/next) or -1 (left/prev)
    // We assume if current < prev we are going backwards, unless wrapping around
    const isForward = directionRef.current === 1;
    const duration = 0.5;
    const ease = "power2.out";

    // Fix direction for wrap-around cases
    if (isForward) {
      gsap.set(currentSlide, { xPercent: 100 });
      gsap.to(currentSlide, { xPercent: 0, duration, ease});
      
      gsap.to(prevSlide, { 
        xPercent: -100, 
        duration, 
        ease,
        onComplete: () => {
            setIsAnimating(false);
        } 
      });
    } else {
        gsap.set(currentSlide, { xPercent: -100 });
        gsap.to(currentSlide, { xPercent: 0, duration, ease });

        // Outgoing slide slides RIGHT to 100
        gsap.to(prevSlide, { 
            xPercent: 100, 
            duration, 
            ease,
            onComplete: () => {
                setIsAnimating(false);
            }
        });
    }

    // Update refs for next time
    prevIndexRef.current = current;
    
  }, [current, images.length]);


  //------------
  // Keyboard navigation
  useEffect(() => {
    if (images.length <= 1) return;
    
    const onKey = (ev) => {
      if (ev.key === "ArrowLeft") prev();
      if (ev.key === "ArrowRight") next();
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);


  // --- Helper Functions ---

  const prev = (e) => {
    if (e) e.preventDefault();
    directionRef.current = -1;
    setCurrent((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e) => {
    if (e) e.preventDefault();
    directionRef.current = 1;
    setCurrent((i) => (i + 1) % images.length);
  };

  const handleAdd = () => {
    if (product) addItem(product);
  };

  // Helper to format category for URL
  const formatSlug = (cat) => 
    cat ? encodeURIComponent(String(cat).toLowerCase().trim().replace(/\s+/g, '-')) : '';

  const sentenceCase = (str) => 
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';


  // --- 2. CONDITIONAL RETURNS (Only after all hooks are defined) ---

  if (!products) {
    return <div className="product-page"><p>Cargando producto…</p></div>;
  }

  if (!product) {
    return (
      <div className="product-page">
        <h2>Producto no encontrado</h2>
        <Link to="/products">Volver a productos</Link>
      </div>
    );
  }

  // Define logic for links now that we know product exists
  const categorySlug = formatSlug(product.category);

  return (
    <main className="product-page">
      
      {/* --- BREADCRUMBS --- */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Inicio</Link> 
        <span className="separator"> / </span>
        <Link to="/products">Productos</Link> 
        <span className="separator"> / </span>
        <Link to={`/products/${categorySlug}`}>
            {sentenceCase(product.category)}
        </Link>
        <span className="separator"> / </span>
        <span className="current-crumb">{product.title}</span>
      </nav>

      <div className="product-detail">
      {/* Inside .product-media div */}
      <div className="product-media">
        {/* Render ALL images instead of just one */}
        {images.map((imgSrc, index) => (
          <img 
            key={index}
            ref={el => slideRefs.current[index] = el} // Store ref in array
            src={imgSrc} 
            alt={`${product.title} view ${index + 1}`} 
            className="product-image" 
            // Hide images initially to prevent flash, handled by GSAP set() in useEffect
            style={{ visibility: 'visible' }} 
          />
        ))}

        {images.length > 1 && (
          /* ... keep your existing buttons ... */
          <>
            <button 
              className="carousel-arrow left" 
              onClick={prev}
              disabled={isAnimating}>
            </button>
            <button 
              className="carousel-arrow right" 
              onClick={next}
              disabled={isAnimating}>
            </button>
            <div className="carousel-indicators">
              {images.map((_, idx) => (
                  <span 
                      key={idx} 
                      className={`dot ${idx === current ? 'active' : ''}`}
                      onClick={() => setCurrent(idx)}
                  />
              ))}
            </div>
          </>
        )}
      </div>

        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-desc">{product.description}</p>
          <p className="product-price">Precio: ${Number(product.price).toFixed(2)}</p>

          <div className="product-actions-1">
            <button className="btn-add-to-cart" onClick={handleAdd}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}