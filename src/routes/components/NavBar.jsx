import { Link, NavLink, useNavigate } from "react-router-dom"
import { Badge, Typography } from "@mui/material"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import cartIcon from "../../assets/bag.png"
import logoIcon from "../../assets/logo.png"
import '../styles/navbar.css'

export const NavBar = () => {
    
    const {cartCount} = useContext(CartContext)
    const navigate = useNavigate()

    const handleNavClick = (e) => {
        e.preventDefault()
        navigate("/cart")
        }

    return (
    <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link to='/' className="navbar-brand" href="#">
                <img src={logoIcon} alt="logo" className="logo"/>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item">
                <NavLink to='/about' className="nav-link">SOBRE MÍ</NavLink>
                </li>
                <li className="nav-item dropdown">
                <NavLink 
                    to='/cart'
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={handleNavClick}>
                    NUESTROS PRODUCTOS
                </NavLink>
                <ul className="dropdown-menu">
                    <li><NavLink to="/products/budines" className="dropdown-item" >BUDINES</NavLink></li>
                    <li><NavLink to="/products/tortas" className="dropdown-item" >TORTAS</NavLink></li>
                    <li><NavLink to="/products/masdulces" className="dropdown-item" >MÁS DULCES</NavLink></li>
                </ul>
                </li>
                <li>
                    <NavLink to='/contact' className="nav-link">CONTACTO</NavLink>
                </li>
                <li className="nav-item d-flex align-items-center gap-2 d-lg-none">
                    <NavLink to='/cart' className="nav-link">MI PEDIDO</NavLink>
                    <NavLink to='/cartpage'>
                    <Badge badgeContent={cartCount} color="none" className="btn main-cart-vertical" type="button">
                    <img src={cartIcon} alt="carrito" className="main-cart" />
                    </Badge>
                    </NavLink>
                </li>
            </ul>
            <NavLink to='/cartpage' style={{ textDecoration: 'none' }} className="ms-auto d-none d-lg-block">
            <Typography variant="h6" className="myorder">
                MI PEDIDO
                <Badge  badgeContent={cartCount}
                        color="none"
                        className="btn main-cart"
                        type="button"
                        >
                    <img src={cartIcon} alt="carrito" className="main-cart"/>
                </Badge>
            </Typography>
            </NavLink>
            </div>
        </div>
        </nav>
    </>
    )
}
