import btnAdd from "../../assets/bag.png"
import '../styles/card.css'

export const Card = ({image, title, price, handleAdd}) => {

  const clickAdd = () => {
      handleAdd()
  }

  return (
    <>
    <div className="product-card">
        <img src={image} alt={title} className="product-img"/>
        <div className="product-content">
        <h4 className="product-title">{title}</h4>
        <p className="product-price">${price}</p>
        <button 
        type="button"
        className="btn-add"
        onClick={clickAdd}
        >
          <img className="img-add" src={btnAdd} alt="Agregar Carrito" />
        </button>
        </div>
    </div>
    </>
  )
}
