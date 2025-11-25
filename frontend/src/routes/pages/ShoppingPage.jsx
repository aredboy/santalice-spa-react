import { useContext, useState, useEffect } from "react"
import { Card } from "../components/Card"
import { Badge } from "@mui/material"
import { ProductsContext } from "../context/ProductsContext"
import { CartContext } from "../context/CartContext"
import { useParams, Link } from "react-router-dom"
import whatsapp from "../../assets/whatsapp_edited.png"
import cartIcon from "../../assets/bag3.png"
import '../styles/shop.css'

export const ShoppingPage = () => {

  const { category } = useParams()

  const { products } = useContext(ProductsContext)
  const { addItem, eliminateItem, appointment, cartCount } = useContext(CartContext)

  const DEFAULT_BOTTOM = 20
  const [bottomOffset, setBottomOffset] = useState(DEFAULT_BOTTOM)

  const filteredProducts = category
    ? products.filter(product => product.category.toLowerCase() === category.toLowerCase())
    : products;

  const handleAdd = (shop) => {
    addItem(shop)
  }
  const handleEliminate = (id) => {
    eliminateItem(id)
  }

  const sentenceCase = (s) => {
    if (!s) return '';
    const normalized = s.replace(/[-_]+/g, ' '); // optional
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  }

  // 2. The Magic Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      // Select your footer element. 
      // If your footer has a class, use querySelector('.footer-class')
      const footer = document.querySelector('.custom-footer'); 
      
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if the top of the footer is visible in the viewport
      if (footerRect.top < windowHeight) {
        // Calculate how much of the footer is visible
        const overlap = windowHeight - footerRect.top;
        // Set bottom to (Default 40px) + (Amount of footer visible) + (Buffer 10px)
        setBottomOffset(40 + overlap + 10); 
      } else {
        // Reset to default if footer is not visible
        setBottomOffset(40);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phoneNumber = '5491161377819';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <>
      <div className="products-grid">
        <h4 className="products-h4">
          {category ? sentenceCase(category) : 'Nuestros productos'}
        </h4>
        <div className="grid-container">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              const image = Array.isArray(product.image)
                ? (product.image[0] || '/images/placeholder.png')
                : (product.image || '/images/placeholder.png')

              return (
                <Card
                  key={product.id}
                  id={product.id}
                  image={image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  handleAdd={() => handleAdd(product)}
                  handleEliminate={() => handleEliminate(product.id)}
                />
              )
            })
          ) : (
            <p>No hay productos en esta categoría.</p>
          )}
        </div>
      </div>
      {appointment ? (
        <Link 
          to="/cartpage" 
          className="order-float" 
          style={{
            background: '#2dbcc1', 
            textDecoration: 'none',
            bottom: `${bottomOffset}px`
            }}>
          <span>
              Ir a tu Pedido
          </span>
          <Badge badgeContent={cartCount} color="none" className="btn-2 main-cart" type="button">
              <img src={cartIcon} alt="carrito" className="main-cart" />
          </Badge>
        </Link>
      ) : (
        <a 
          href={whatsappUrl}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          style={{ bottom: `${bottomOffset}px` }}
        >
          <img 
              src={whatsapp}
              alt="WhatsApp" 
              style={{
                width: '100%', 
                height: '100%', 
                background: 'transparent'
              }}
          />
        </a>
      )}
    </>
  )
}
