import { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"
import { AddressModal } from "../components/AddressModal"
import trashIcon from "../../assets/trash.png"
import '../styles/cart.css'

export const CartPage = () => {

  const {shopList, increaseQuantity, decreaseQuantity, eliminateItem, appointment} = useContext(CartContext)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateTotal = () => {
    return shopList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const handlePurchase = (deliveryData) => {
    const phoneNumber = "5491161377819";
    let message = "";

    if (appointment) {
      const dateObj = new Date(appointment.date);
      const dateString = dateObj.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })
      message = `¡Hola! Soy ${deliveryData.name}.\n`; 
      message = `Me gustaría agendar un pedido para el ${dateString}.\n`;
      message = `Tipo de evento: ${appointment.eventType}.\n\n`;
      message = `-------------------------\n`;
      message = `MI PEDIDO:\n`;
    } else {
      message = `¡Hola! Soy ${deliveryData.name}.\n`; 
      message = `Me gustaría confirmar el siguiente pedido:\n\n`;
    }

    shopList.forEach(item => {
      const subtotal = (item.price * item.quantity).toFixed(2);
      message += `- ${item.title} (Cantidad: ${item.quantity}) - Subtotal: $${subtotal}\n`;
    })
    message += `\nTotal sin envío: $${calculateTotal()}\n\nGracias!`;
    message += `--------------------------\n`;
    if (deliveryData.type === "pickup") {
      message += `Tipo de entrega: 📦 *Retiro en local*.\n`;
      message += `(Coordiná la dirección y el horario de retiro con nuestro representante.)\n`;
    } else {
      message += `Tipo de entrega: *Envío a domicilio*.\n`;
      message += `Dirección: ${deliveryData.address}, ${deliveryData.city}.\n`;
      if (deliveryData.phone) message += `📞 Teléfono: ${deliveryData.phone}`;
    }
    
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  }

  return (
    <>
    <AddressModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={handlePurchase}
    />
    <h4></h4>
    <table className="table-cart">
      <thead>
        <tr className="table-row">
          <th scope="col">Nombre</th>
          <th scope="col">Precio</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {
          shopList.map(item => (
            <tr key={item.id} className="table-row">
              <th className="table-head-title">{item.title}</th>
              <td className="table-content-price">${item.price}</td>
              <td className="table-content-btn-container">
                <button 
                  className="btn-decrease"
                  onClick={()=> decreaseQuantity(item.id)}
                  >-
                </button>
                <button className="btn-quantity">{item.quantity}</button>
                <button 
                  className="btn-increase"
                  onClick={()=> increaseQuantity(item.id)}
                  >+
                </button>
              </td>
              <td className="table-content-btn-container">
                <button
                  type="button"
                  className="btn-eliminate"
                  onClick={()=>eliminateItem(item.id)}
                >
                  <img className="img-eliminar" src={trashIcon} alt="eliminar" />
                </button>
              </td>
            </tr>
          ))
        }
        <tr>
          <th className="table-row-total"><b>Total:</b></th>
          <td className="table-price-total">${calculateTotal()}</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div className="d-grid gap-2 col-6 mx-auto mb-5">
      <button 
        className="btn-buy"
        onClick={() => setIsModalOpen(true)}
        disabled={shopList.length < 1}
      >
        Comprar
      </button>
    </div>
    </>
  )
}
