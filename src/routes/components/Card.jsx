import btnAdd from "../../assets/bag.png"
import '../styles/card.css'

export const Card = ({image, title, price, handleAdd}) => {


    const clickAdd = () => {
        handleAdd()
        // setAdded(true)
    }

  return (
    <>
    <div className="card">
        <img src={image} alt={title} className="card-img"/>
        <div className="card-content">
        <h4 className="card-title">{title}</h4>

        <p className="card-price">${price}</p>

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
