import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import "../styles/modal.css";

export const AddressModal = ({ isOpen, onClose, onConfirm }) => {
    const [tab, setTab] = useState("pickup");
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        phone: "",
    });

    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo(
                modalRef.current,
                { y: -50, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send data back to CartPage
        onConfirm({ type: tab, ...formData });
    };

    return createPortal(
        <div className="modal-overlay" ref={overlayRef}>
            <div className="modal-box" ref={modalRef}>
                <div className="modal-header">
                    <h3 className="modal-h3">¿Cómo entregamos tu pedido?</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-tabs">
                    <button
                        className={tab === "pickup" ? "tab active" : "tab"}
                        onClick={() => setTab("pickup")}
                    >
                        🏢 Retiro en Local
                    </button>
                    <button
                        className={tab === "delivery" ? "tab active" : "tab"}
                        onClick={() => setTab("delivery")}
                    >
                        🛵 Envío a Domicilio
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Common Field: Name */}
                    <div className="form-group">
                        <span className="label">Tu Nombre:</span>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>

                    {tab === "pickup" ? (
                        <div className="pickup-info">
                            <p>
                                📍 <b>Dirección del local:</b> A convenir con nuestro representante.
                            </p>
                            <p>
                                🕒 <b>Horarios:</b> A convenir.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <span className="label">Dirección:</span>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Calle y Altura"
                                />
                            </div>
                            <div className="form-group">
                                <span className="label">Localidad / Barrio:</span>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Ej: Palermo"
                                />
                            </div>
                            <div className="form-group">
                                <span className="label">Teléfono de contacto:</span>
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Ej: 541134560000"
                                />
                            </div>
                            <div className="form-group">
                                <span className="label">
                                    El costo del envío dependerá de la distancia y será informado una vez calculado.
                                </span>
                            </div>
                        </>
                    )}
                    <div className="actions">
                        <button type="submit" className="btn-confirm-modal">
                            Confirmar y Comprar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
