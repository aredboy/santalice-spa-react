import { Link, NavLink } from "react-router-dom"
import { Badge, Typography } from "@mui/material"
import { ShoppingCart } from "@mui/icons-material"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"


export const NavBar = () => {
    
    const {shopList} = useContext(CartContext)
    
    return (
    <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <Link className="navbar-brand" href="#">Sant'Alice</Link>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item">
                <NavLink to='/' className="nav-link">Home</NavLink>
                </li>
                <li className="nav-item">
                <NavLink to='/about' className="nav-link">Sobre mí</NavLink>
                </li>
                <li className="nav-item dropdown">
                <NavLink to='/cart' className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Nuestros productos
                </NavLink>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" >Budines</a></li>
                    <li><a className="dropdown-item" >Tortas</a></li>
                    <li><a className="dropdown-item" >Más dulces</a></li>
                </ul>
                </li>
                <li className="nav-item">
                <NavLink to='/cart' className="nav-link">Pedí online</NavLink>
                </li>
                <li className="nav-item">
                <NavLink to='/contact' className="nav-link">Contacto</NavLink>
                </li>
                <li className="nav-item">
                <NavLink to='/FAQ' className="nav-link">Preguntas frecuentes</NavLink>
                </li>
                <li className="nav-item">
                <NavLink to='/login' className="nav-link">Login</NavLink>
                </li>
            </ul>
            <NavLink to='/cartpage' className="ms-auto">
            <Typography variant="h6">
                <Badge  badgeContent={shopList.length} 
                        color="primary" 
                        className="btn btn-outline-info" 
                        type="button"
                        >
                    <ShoppingCart color="action" />
                </Badge>
            </Typography>
            </NavLink>
            </div>
        </div>
        </nav>
    </>
    )
}
