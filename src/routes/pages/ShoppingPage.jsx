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

  return (
    <>
    <div className="products-grid">
    <h4>
      {category ? category.toUpperCase() : 'Todos nuestros productos:'}
    </h4>
    <hr />
      <div className="grid-container">
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
        <div key={product.id} className="col-12 col-md-4 mb-3">
        <Card
          key={product.id}
          image={product.image}
          title={product.title}
          description={product.description}
          price={product.price}
          handleAdd={() => handleAdd(product)}
          handleEliminate={() => handleEliminate(product.id)}
        ></Card>
        </div>
        ))
      ) : (
        <p>No hay productos en esta categoría.</p>
      )}
      </div>
    </div>
    </>
  )
}
