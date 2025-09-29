import { Link, NavLink } from "react-router-dom";
import '../styles/footer.css'

export const Footer = () => {
    return (
        <>
        <footer className="custom-footer py-4 mt-auto">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5>Navegación</h5>
                        <ul className="list-unstyled">
                            <li>
                                <NavLink
                                    to="/contact"
                                    className="nav-link text-dark text-decoration-none"
                                >
                                    CONTACTO
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
                            <li>
                                <NavLink
                                    to="/login"
                                    className="nav-link text-dark text-decoration-none"
                                >
                                    LOGIN
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Acerca de mí</h5>
                        <p>
                            We are a company dedicated to providing the best
                            products and services.
                        </p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Informacion de Contacto</h5>
                        <p>Email: support@example.com</p>
                        <p>Teléfono: (123) 456-7890</p>
                    </div>
                </div>
                <div className="mt-3">
                    <p>
                        &copy; {new Date().getFullYear()} Sant'Alice.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
        </>
    );
};
