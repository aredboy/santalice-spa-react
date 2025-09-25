import { useContext } from "react"
import { Card } from "../components/Card"
import { ProductsContext } from "../context/ProductsContext"
import { CartContext } from "../context/CartContext"

export const ShoppingPage = () => {

  const { products } = useContext(ProductsContext)

  const { addItem, eliminateItem } = useContext(CartContext)

  const handleAdd = (shop) => {
    addItem(shop)
  }
  const handleEliminate = (id) => {
    eliminateItem(id)
  }

  return (
    <>
    <h3>
      Compras:
    </h3>
    <hr />
    
    {products.map(product => (
      <Card
        key={product.id}
        image={product.image}
        title={product.title}
        description={product.description}
        price={product.price}
        handleAdd={() => handleAdd(product)}
        handleEliminate={() => handleEliminate(product.id)}
      ></Card>
    ))}
    </>
  )
}
