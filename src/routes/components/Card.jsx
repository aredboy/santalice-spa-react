import { useState } from "react"
import '../styles/card.css'

export const Card = ({image, title, price, description, handleAdd, handleEliminate}) => {

    const [added, setAdded] = useState(false)

    const clickAdd = () => {
        handleAdd()
        setAdded(true)
    }
    const clickRemove = () => {
        handleEliminate()
        setAdded(false)
    }

  return (
    <div className="card">
        <img src={image} alt={title} className="card-img"/>
        <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <p className="card-price">{price}</p>

        {added
        ? <button 
        type="button"
        className="btn-remove"
        onClick={clickRemove}
        >
            Quitar del Carrito
        </button>
        : <button 
        type="button"
        className="btn-add"
        onClick={clickAdd}
        >
            Agregar al Carrito
        </button>
        }
        </div>
    </div>
  )
}
