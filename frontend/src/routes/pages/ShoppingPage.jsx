import { useContext } from "react"
import { Card } from "../components/Card"
import { ProductsContext } from "../context/ProductsContext"
import { CartContext } from "../context/CartContext"
import '../styles/shop.css'
import { useParams } from "react-router-dom"

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

  return (
    <>
    <div className="products-grid">
    <h4 className="products-h4">
      {category ? sentenceCase(category) : 'Nuestros productos'}
    </h4>
      <div className="grid-container">
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
        <Card
          key={product.id}
          id={product.id}
          image={product.image}
          title={product.title}
          description={product.description}
          price={product.price}
          handleAdd={() => handleAdd(product)}
          handleEliminate={() => handleEliminate(product.id)}
        ></Card>
        ))
      ) : (
        <p>No hay productos en esta categoría.</p>
      )}
      </div>
    </div>
    </>
  )
}
