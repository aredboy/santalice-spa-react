// import { useContext, useState, useEffect } from "react"
// import { Card } from "../components/Card"
// import { ProductsContext } from "../context/ProductsContext"
// import { CartContext } from "../context/CartContext"
// import { useParams, Link } from "react-router-dom"
// import PageTransition from "../components/PageTransition"
// import { sentenceCase, getProductImage, buildWhatsappUrl } from "../../utils"
// import siteConfig from "../../siteConfig"
// import whatsapp from "../../assets/whatsapp_edited.png"
// import cartIcon from "../../assets/bag3.png"
// import '../styles/shop.css'

// const FLOATING_BUTTON_RESTING_OFFSET = 40

// export const ShoppingPage = () => {
//   const { category } = useParams()
//   const { products } = useContext(ProductsContext)
//   const { addItem, eliminateItem, appointment, cartCount } = useContext(CartContext)
//   const [bottomOffset, setBottomOffset] = useState(FLOATING_BUTTON_RESTING_OFFSET)

//   const filteredProducts = category
//     ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
//     : products

//   // Floating button: stay above footer when it's visible
//   useEffect(() => {
//     const buffer = 10

//     const handleScroll = () => {
//       const footer = document.querySelector('.custom-footer')
//       if (!footer) return

//       const footerTop = footer.getBoundingClientRect().top
//       const overlap = Math.max(0, window.innerHeight - footerTop)
//       setBottomOffset(FLOATING_BUTTON_RESTING_OFFSET + overlap + (overlap > 0 ? buffer : 0))
//     }

//     handleScroll()
//     window.addEventListener('scroll', handleScroll)
//     window.addEventListener('resize', handleScroll)
//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//       window.removeEventListener('resize', handleScroll)
//     }
//   }, [])

//   const whatsappUrl = buildWhatsappUrl()

//   return (
//     <>
//     <PageTransition>
//       <div className="products-grid">
//         <h4 className="products-h4">
//           {category ? sentenceCase(category) : siteConfig.texts.productsTitle}
//         </h4>
//         <div className="grid-container">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map(product => (
//               <Card
//                 key={product.id}
//                 id={product.id}
//                 image={getProductImage(product)}
//                 title={product.title}
//                 description={product.description}
//                 price={product.price}
//                 handleAdd={() => addItem(product)}
//                 handleEliminate={() => eliminateItem(product.id)}
//               />
//             ))
//           ) : (
//             <p>No hay productos en esta categoría.</p>
//           )}
//         </div>
//       </div>
//       {appointment ? (
//         <Link
//           to="/cartpage"
//           className="order-float"
//           style={{
//             background: 'var(--color-primary)',
//             textDecoration: 'none',
//             position: 'fixed',
//             bottom: `${bottomOffset}px`
//           }}>
//           <span>Ir a tu Pedido</span>
//           <div className="cart-icon-container">
//             <img src={cartIcon} alt="carrito" className="main-cart" />
//             {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
//           </div>
//         </Link>
//       ) : (
//         <a
//           href={whatsappUrl}
//           className="whatsapp-float"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ position: 'fixed', bottom: `${bottomOffset}px` }}
//         >
//           <img
//             src={whatsapp}
//             alt="WhatsApp"
//             style={{ width: '100%', height: '100%', background: 'transparent' }}
//           />
//         </a>
//       )}
//     </PageTransition>
//     </>
//   )
// }
import { useContext, useState, useEffect } from "react"
import { Card } from "../components/Card"
import { ProductsContext } from "../context/ProductsContext"
import { CartContext } from "../context/CartContext"
import { useParams, Link } from "react-router-dom"
import PageTransition from "../components/PageTransition"
import { sentenceCase, getProductImage, buildWhatsappUrl } from "../../utils"
import siteConfig from "../../siteConfig"
import whatsapp from "../../assets/whatsapp_edited.png"
import cartIcon from "../../assets/bag3.png"
import '../styles/shop.css'

const FLOATING_BUTTON_RESTING_OFFSET = 40
const LOADING_TIMEOUT_MS = 40000

export const ShoppingPage = () => {
  const { category } = useParams()
  const { products } = useContext(ProductsContext)
  const { addItem, eliminateItem, appointment, cartCount } = useContext(CartContext)
  const [bottomOffset, setBottomOffset] = useState(FLOATING_BUTTON_RESTING_OFFSET)
  const [timedOut, setTimedOut] = useState(false)

  const filteredProducts = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products

  const isLoading = products.length === 0 && !timedOut

  // Timeout: after 40s without products, show "no products" message
  useEffect(() => {
    if (products.length > 0) return
    const timer = setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [products.length])

  // Floating button: stay above footer when it's visible
  useEffect(() => {
    const buffer = 10

    const handleScroll = () => {
      const footer = document.querySelector('.custom-footer')
      if (!footer) return

      const footerTop = footer.getBoundingClientRect().top
      const overlap = Math.max(0, window.innerHeight - footerTop)
      setBottomOffset(FLOATING_BUTTON_RESTING_OFFSET + overlap + (overlap > 0 ? buffer : 0))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const whatsappUrl = buildWhatsappUrl()

  return (
    <>
    <PageTransition>
      <div className="products-grid">
        <h4 className="products-h4">
          {category ? sentenceCase(category) : siteConfig.texts.productsTitle}
        </h4>
        <div className="grid-container">
          {isLoading ? (
            <div className="loading-container">
              <svg className="kite-spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="kite-orbit">
                  {/* Kite body — diamond shape */}
                  <g className="kite-body">
                    <polygon points="50,20 62,45 50,55 38,45" fill="var(--color-primary)" opacity="0.9" />
                    <polygon points="50,20 62,45 50,40 38,45" fill="var(--color-primary)" opacity="0.6" />
                    {/* Kite tail */}
                    <path d="M50,55 Q54,65 48,72 Q52,78 47,85" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  </g>
                </g>
              </svg>
              <p className="loading-text">Cargando productos...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card
                key={product.id}
                id={product.id}
                image={getProductImage(product)}
                title={product.title}
                description={product.description}
                price={product.price}
                handleAdd={() => addItem(product)}
                handleEliminate={() => eliminateItem(product.id)}
              />
            ))
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
            background: 'var(--color-primary)',
            textDecoration: 'none',
            position: 'fixed',
            bottom: `${bottomOffset}px`
          }}>
          <span>Ir a tu Pedido</span>
          <div className="cart-icon-container">
            <img src={cartIcon} alt="carrito" className="main-cart" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </Link>
      ) : (
        <a
          href={whatsappUrl}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: 'fixed', bottom: `${bottomOffset}px` }}
        >
          <img
            src={whatsapp}
            alt="WhatsApp"
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
        </a>
      )}
    </PageTransition>
    </>
  )
}
