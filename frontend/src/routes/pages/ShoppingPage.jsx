import { useContext } from "react"
import { Card } from "../components/Card"
import { ProductsContext } from "../context/ProductsContext"
import { CartContext } from "../context/CartContext"
import { useParams } from "react-router-dom"
import whatsapp from "../../assets/whatsapp.png"
import '../styles/shop.css'

export const ShoppingPage = () => {

  const { category } = useParams()

  const { products } = useContext(ProductsContext)

  const { addItem, eliminateItem } = useContext(CartContext)

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
      <a 
        href={whatsappUrl}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* If you have react-icons installed, use <FaWhatsapp /> here. 
            If not, use an img tag like below: */}
        <img 
            src={whatsapp}
            alt="WhatsApp" 
            style={{width: '100%', height: '100%', background: 'transparent'}}
        />
      </a>
    </>
  )
}
