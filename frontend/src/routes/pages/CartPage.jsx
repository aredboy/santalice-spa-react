import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import trashIcon from "../../assets/trash.png"
import '../styles/cart.css'

export const CartPage = () => {

  const {shopList, increaseQuantity, decreaseQuantity, eliminateItem} = useContext(CartContext)

  const calculateTotal = () => {
    return shopList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const handlePrint = () => {
    print()
  }

  return (
    <>
    <table className="table-cart">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Precio</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {
          shopList.map(item => (
            <tr key={item.id}>
              <th>{item.title}</th>
              <td>${item.price}</td>
              <td>
                <button 
                  className="btn btn-outline-primary"
                  onClick={()=> decreaseQuantity(item.id)}
                  >-
                </button>
                <button className="btn btn-primary">{item.quantity}</button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={()=> increaseQuantity(item.id)}
                  >+
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn"
                  onClick={()=>eliminateItem(item.id)}
                >
                  <img className="img-eliminar" src={trashIcon} alt="eliminar" />
                </button>
              </td>
            </tr>
          ))
        }
        <tr>
          <th><b>Total:</b></th>
          <td></td>
          <td>${calculateTotal()}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div className="d-grid gap-2 col-6 mx-auto mb-5">
      <button 
      className="btn btn-primary-buy"
      onClick={handlePrint}
      disabled={shopList < 1}
      >Comprar</button>
    </div>
    </>
  )
}
