import { Link, NavLink } from "react-router-dom";
import '../styles/footer.css'
import logoIcon from "../../assets/logo group.png"
import insta from "../../assets/insta.png"
import whatsapp from "../../assets/whatsa.png"
import email from "../../assets/email.png"

export const Footer = () => {
    return (
        <>
        <footer className="custom-footer py-4">
                <div className="row">
                    <div>
                        <Link to='/' className="nav-logo">
                            <img src={logoIcon} alt="logo" className="logo"/>
                        </Link>
                    </div>
                    <div className="col-md-4 mb-3">
                        <ul className="list-unstyled">
                            <li>
                                <NavLink
                                    to="/about"
                                    className="nav-link text-dark text-decoration-none"
                                >
                                    SOBRE MI
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/products"
                                    className="nav-link text-dark text-decoration-none"
                                >
                                    NUESTROS PRODUCTOS
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/FAQ"
                                    className="nav-link text-dark text-decoration-none"
                                >
                                    PREGUNTAS FRECUENTES
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>CONTACTO</h5>
                        <Link to='/' className="nav-logo">
                            <img src={email} alt="email" className="link"/>
                            <p>support@example.com</p>
                        </Link>
                        <Link to='/' className="nav-logo">
                            <img src={whatsapp} alt="whatsapp" className="link"/>
                            <p>Teléfono: (123) 456-7890</p>
                        </Link>
                        <Link to='https://www.instagram.com/santalicedya/' className="nav-logo">
                            <img src={insta} alt="instagram" className="link"/>
                            <p>santalicedya</p>
                        </Link>
                    </div>
                </div>
                <div className="mt-3">
                    <p>
                        &copy; {new Date().getFullYear()} Sant'Alice.
                        All rights reserved.
                    </p>
                </div>
        </footer>
        </>
    );
};
