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
    return <div className="product-page"><p>Cargando producto…</p></div>;
  }

  if (Array.isArray(products) && products.length === 0) {
    return <div className="product-page"><p>No hay productos todavía (cargando o error)</p></div>;
  }

  // búsqueda tolerante a tipos (string vs number)
  const product = Array.isArray(products)
    ? products.find((p) => String(p.id) === String(id))
    : null;

  if (!product) {
    return (
      <div className="product-page">
        <h2>Producto no encontrado</h2>
        <p>No pudimos encontrar el producto con id <strong>{id}</strong>.</p>
        <Link to="/shopping">Volver a productos</Link>
      </div>
    );
  }

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
          <img src={product.image} alt={product.title} className="product-image" />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-desc">{product.description}</p>
          <p className="product-price">${Number(product.price).toFixed(2)}</p>

          <div className="product-actions">
            <button className="btn-add-to-cart" onClick={handleAdd}>Agregar al carrito</button>

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
