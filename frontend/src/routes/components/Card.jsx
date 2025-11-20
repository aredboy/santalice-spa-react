
import { useRef } from "react"
import gsap from "gsap"
import btnAddLarge from "../../assets/bag3.png"
import btnAddSmall from "../../assets/bag1.png"
import { Link } from "react-router-dom"
import '../styles/card.css'

export const Card = ({image, title, price, id, handleAdd, description}) => {

  const shineRef = useRef(null);

  const clickAdd = () => {
      handleAdd()

      gsap.fromTo(shineRef.current,
        {
          xPercent: -250, 
          skewX: -25,
          opacity: 0.8 
        },
        {
          xPercent: 200,
          skewX: -25,
          duration: 0.6,
          ease: "power1.out",
          opacity: 0,
  });
  }

  return (
    <>
    <article className="product-card" tabIndex="0" aria-label={`title-${id}`}>
      <Link to={`/product/${id}`} className="img-container">
        <img src={image} alt={title} className="product-img"/>
      </Link>
        <div className="product-content">
          <Link to={`/product/${id}`} className="product-title-link">
            <h4 className="product-title">{title}</h4>
          </Link>
          <p className="card-desc">{description}</p>
          <div className="price-container">
          <p className="product-price">Precio: ${price}</p>
          </div>
          <button 
            type="button"
            className="btn-add"
            onClick={clickAdd}
            aria-label={`Agregar ${title}`}
          >
            <div ref={shineRef} className="btn-shine-effect"></div>
            <span className="btn-span">Añadir al Pedido</span>
            <picture className="img-add-picture" aria-hidden="true">
              <source media="(min-width: 1200px)" srcSet={btnAddLarge} />
              <img src={btnAddSmall} alt="Agregar al Carrito" className="img-add" />
            </picture>
          </button>
        </div>
    </article>
    </>
  )
}
