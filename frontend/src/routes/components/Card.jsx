import btnAdd from "../../assets/bag.png"
import { Link } from "react-router-dom"
import '../styles/card.css'

export const Card = ({image, title, price, id, handleAdd}) => {

  const clickAdd = () => {
      handleAdd()
  }

  return (
    <>
    <div className="product-card">
      <Link to={`/product/${id}`}>
        <img src={image} alt={title} className="product-img"/>
      </Link>
        <div className="product-content">
          <Link to={`/product/${id}`} className="product-title-link">
            <h4 className="product-title">{title}</h4>
          </Link>
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
