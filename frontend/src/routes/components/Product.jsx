import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import { CartContext } from "../context/CartContext";
import "../styles/product.css"; // opcional

export function Product() {
  const { id } = useParams();                     // <-- id viene de la URL
  const { products } = useContext(ProductsContext);
  const { addItem } = useContext(CartContext);

  // esperar a que products cargue
  if (!products) {
    return <div className="product-page">
              <p>Cargando producto…</p>
            </div>;
  }

  if (Array.isArray(products) && products.length === 0) {
    return <div className="product-page">
              <p>No hay productos todavía (cargando o error)</p>
            </div>;
  }

  // búsqueda tolerante a tipos (string vs number)
  const product = Array.isArray(products)
    ? products.find((p) => String(p.id) === String(id))
    : null;

  if (!product) {
    return (
      <div className="product-page">
        <h2>Producto no encontrado</h2>
        <p>
          No pudimos encontrar el producto con id <strong>{id}</strong>.
        </p>
        <Link to="/shopping">Volver a productos</Link>
      </div>
    );
  }

    // Normalize images: allow product.image to be a string or an array
  const images = Array.isArray(product.image) ? product.image : [product.image];

  const [current, setCurrent] = useState(0);

  // Reset to first image when product changes
  useEffect(() => {
    setCurrent(0);
  }, [product]);

  const prev = (e) => {
    if (e) e.preventDefault();
    setCurrent((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e) => {
    if (e) e.preventDefault();
    setCurrent((i) => (i + 1) % images.length);
  };

  // Keyboard navigation (left/right arrows)
  useEffect(() => {
    if (images.length <= 1) return;
    const onKey = (ev) => {
      if (ev.key === "ArrowLeft") prev();
      if (ev.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]); // only depends on images length

  const handleAdd = () => {
    addItem(product);
  };

  const categorySlug = product?.category
  ? encodeURIComponent(String(product.category).toLowerCase().trim().replace(/\s+/g, '-'))
  : null;

  return (
    <main className="product-page">
      <div className="product-detail">
        <div className="product-media">
          <img 
            src={images[current]} 
            alt={`${product.title} ${current + 1}`} 
            className="product-image" 
            loading="lazy"
          />

          {images.length > 1 && (
            <>
              <button
                className="carousel-arrow left"
                onClick={prev}
                aria-label="Imagen anterior"
                title="Anterior"
              ></button>

              <button
                className="carousel-arrow right"
                onClick={next}
                aria-label="Siguiente imagen"
                title="Siguiente"
              ></button>
            </>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-desc">{product.description}</p>
          <p className="product-price">Precio: ${Number(product.price).toFixed(2)}</p>

          <div className="product-actions-1">
            <button className="btn-add-to-cart" onClick={handleAdd}>Agregar al carrito</button>
          </div>
          <div className="product-actions-2">
            <Link
              to={categorySlug ? `/products/${categorySlug}` : '/products'}
              className="btn-back"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
