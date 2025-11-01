import { Link, NavLink } from "react-router-dom"
import { Badge } from "@mui/material"
import { useContext, useState, useEffect } from "react"
import { CartContext } from "../context/CartContext"
import  Dropdown  from "./Dropdown"
import cartIcon from "../../assets/bag1.png"
import logoIcon from "../../assets/logo.png"
import '../styles/navbar.css'

export const NavBar = () => {
    
    const {cartCount} = useContext(CartContext)

    const [menuOpen, setMenuOpen] = useState(false)

      // track whether viewport is "mobile" (< 992px)
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        function handleResize() {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        // if switching to desktop, ensure menu is closed
        if (!mobile && menuOpen) setMenuOpen(false);
        }
        window.addEventListener("resize", handleResize, { passive: true });
        // run once in case initial render differs
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [menuOpen]);

    const toggleMenu = () => {
        // only toggle on mobile — desktop will be independent
        if (isMobile) setMenuOpen((s) => !s);
    };

    
    const closeMobile = () => setMenuOpen(false)

    return (
    <>
    <nav className={`app-navbar ${menuOpen && isMobile ? "menu-open" : ""}`}>
        <div className="nav-top">
            <div className="nav-left">
                <Link to='/' className="nav-logo" onClick={closeMobile}>
                    <img src={logoIcon} alt="logo" className="logo"/>
                </Link>
            </div>
            <div className="nav-right">
                <NavLink to='/cartpage' className="myorder nav-top-myorder" aria-label="Mi pedido">
                    <span className="myorder-label">MI PEDIDO</span>
                    <Badge badgeContent={cartCount} color="none" className="btn main-cart" type="button">
                        <img src={cartIcon} alt="carrito" className="main-cart" />
                    </Badge>
                </NavLink>
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle-menu" aria-expanded={isMobile ? menuOpen : false}>
                    ☰{/* <span className="navbar-toggler-icon"></span> */}
                </button>
            </div>
        </div>
        <ul className={`nav-links ${menuOpen && isMobile ? 'open' : '' }`}>
            <li>
                <NavLink to='/about' className="nav-link" onClick={closeMobile}>
                    SOBRE MÍ
                </NavLink>
            </li>

            <li className='nav-item'>
                <Dropdown 
                    label={
                    <NavLink to="/products" className="nav-link">
                        NUESTROS PRODUCTOS
                    </NavLink>
                    }
                >
                    <NavLink to="/products/tortas" className="portal-dropdown-item" >TORTAS</NavLink>
                    <NavLink to="/products/budines" className="portal-dropdown-item" >BUDINES</NavLink>
                    <NavLink to="/products/masdulces" className="portal-dropdown-item" >MÁS DULCES</NavLink>
                </Dropdown>
            </li>

            <li>
                <NavLink to='/contact' className="nav-link">CONTACTO</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to='/cartpage' className="myorder" aria-label="Mi pedido">
                    <span className="myorder-label">MI PEDIDO</span>
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
