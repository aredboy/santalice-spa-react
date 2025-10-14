import { Link, NavLink } from "react-router-dom"
import { Badge } from "@mui/material"
import { useContext, useState } from "react"
import { CartContext } from "../context/CartContext"
import  Dropdown  from "./Dropdown"
import cartIcon from "../../assets/bag1.png"
import logoIcon from "../../assets/logo.png"
import '../styles/navbar.css'

export const NavBar = () => {
    
    const {cartCount} = useContext(CartContext)

    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => setMenuOpen((s) => !s)
    
    const closeMobile = () => setMenuOpen(false)

    return (
    <>
    <nav className="app-navbar">
        <div className="nav-top">
            <div className="nav-left">
                <Link to='/' className="nav-logo" onClick={closeMobile}>
                    <img src={logoIcon} alt="logo" className="logo"/>
                </Link>
            </div>
            <button className="hamburger" onClick={toggleMenu}  aria-expanded={menuOpen}>
                ☰{/* <span className="navbar-toggler-icon"></span> */}
            </button>
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : '' }`}>
            <li>
                <NavLink to='/about' className="nav-link" onClick={closeMobile}>
                    SOBRE MÍ
                </NavLink>
            </li>

            <li className={`nav-item ${open ? "open" : ""}`}>
                <Dropdown 
                    label={
                    <NavLink to="/products" className="nav-link">
                        NUESTROS PRODUCTOS
                    </NavLink>
                    }
                >
                    <NavLink to="/products/budines" className="portal-dropdown-item" >BUDINES</NavLink>
                    <NavLink to="/products/tortas" className="portal-dropdown-item" >TORTAS</NavLink>
                    <NavLink to="/products/masdulces" className="portal-dropdown-item" >MÁS DULCES</NavLink>
                </Dropdown>
            </li>

            <li>
                <NavLink to='/contact' className="nav-link">CONTACTO</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to='/cartpage' className="myorder">
                    MI PEDIDO
                    <Badge badgeContent={cartCount} color="none" className="btn main-cart" type="button">
                        <img src={cartIcon} alt="carrito" className="main-cart" />
                    </Badge>
                </NavLink>
            </li>
        </ul>
    </nav>
    </>
    )
}
