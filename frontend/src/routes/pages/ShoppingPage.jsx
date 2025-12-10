import { useContext, useState, useEffect } from "react"
import { Card } from "../components/Card"
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

  const FLOATING_BUTTON_RESTING_OFFSET = 40
  const [bottomOffset, setBottomOffset] = useState(FLOATING_BUTTON_RESTING_OFFSET)

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
    if (s.toLowerCase() === 'masdulces') {
      return 'Más Dulces';
    }
    const normalized = s.replace(/[-_]+/g, ' '); // optional
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  }

// ... (Component start and state definition)

// Inside ShoppingPage component
useEffect(() => {
  const FLOATING_BUTTON_RESTING_OFFSET = 40;
  // const buttonHeight = 60; // Not needed for the calculation below
  const buffer = 10; 
  
  const handleScroll = () => {
    const footer = document.querySelector('.custom-footer'); 
    const windowHeight = window.innerHeight;
    
    if (!footer) return;
    
    const footerRect = footer.getBoundingClientRect();
    
    // --- CRITICAL CHECK: The condition for pushing the button up ---
    // This is true when the footer's top edge is visible in the viewport (footerRect.top < windowHeight)
    if (footerRect.top < windowHeight) {
      
      // Calculate how far the button needs to be pushed up to clear the footer's top edge.
      const overlap = windowHeight - footerRect.top;
      
      // The new offset ensures the button's bottom is 'overlap' + 'resting offset' above the viewport bottom.
      const newOffset = overlap + FLOATING_BUTTON_RESTING_OFFSET + buffer;
      
      // Ensure we don't accidentally calculate a value LESS than the resting offset
      if (newOffset > FLOATING_BUTTON_RESTING_OFFSET) {
        setBottomOffset(newOffset);
      } else {
        // Fallback to resting position if the math somehow yields a lower value
        setBottomOffset(FLOATING_BUTTON_RESTING_OFFSET);
      }
      
    } else {
      // --- THE RESET CONDITION (Runs when footerRect.top >= windowHeight) ---
      // This MUST run when you scroll up and the footer leaves the view
      setBottomOffset(FLOATING_BUTTON_RESTING_OFFSET);
    }
  };
  
  // Run once immediately on mount
  handleScroll(); 

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  };
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
            position: 'fixed',
            bottom: `${bottomOffset}px`
            }}>
          <span>
              Ir a tu Pedido
          </span>
          <div className="cart-icon-container">
              <img src={cartIcon} alt="carrito" className="main-cart" />
          { cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
          )}
          </div>
        </Link>
      ) : (
        <a 
          href={whatsappUrl}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: `${bottomOffset}px` 
          }}
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
