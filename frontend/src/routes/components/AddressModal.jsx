import { useState, useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { CartContext } from "../context/CartContext";
import gsap from "gsap";
import "../styles/modal.css";

export const AddressModal = ({ isOpen, onClose, onConfirm }) => {
    const [tab, setTab] = useState("pickup");
    const [errors, setErrors] =useState({});
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        phone: "",
    });

    const { appointment } = useContext(CartContext);

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

    useEffect(() => {
        setErrors({});
    }, [tab])

    // 2. Pre-fill logic using useEffect
    useEffect(() => {
        if (appointment && isOpen) {
            setTab(appointment.type); // 'delivery' or 'pickup'
            setFormData(prev => ({
                ...prev,
                name: appointment.name || "",
                address: appointment.address || "",
                // We keep city/phone empty to force verification, or add them if collected in calendar
            }));
        }
    }, [appointment, isOpen]); // Run when modal opens or appointment changes

    if (!isOpen) return null;

    const modalTitle = appointment ? "Verificá los datos del envío" : "¿Cómo entregamos tu pedido?";
    
    // 2. Validation Logic (Adapted from ContactScreen)
    const validate = () => {
        const errs = {};

        // Name is required for both tabs
        if (!formData.name.trim()) errs.name = "El nombre es obligatorio.";

        // Specific validation for Delivery tab
        if (tab === "delivery") {
            if (!formData.address.trim()) errs.address = "La dirección es obligatoria.";
            if (!formData.city.trim()) errs.city = "La localidad es obligatoria.";
            
            if (!formData.phone.trim()) {
                errs.phone = "El teléfono es obligatorio.";
            } else {
                // Simple regex to check if it contains at least some numbers
                const phoneRegex = /^[0-9+\-\s()]*$/;
                if (!phoneRegex.test(formData.phone) || formData.phone.length < 6) {
                    errs.phone = "Ingresa un número de teléfono válido.";
                }
            }
        }

        return errs;
    };

    // 3. Handle Change with Error Clearing
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field as user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    // 4. Handle Submit with Validation Check
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errs = validate();
        
        // If there are errors, stop and show them
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        // Validation passed, proceed
        onConfirm({ type: tab, ...formData });
    };

    return createPortal(
        <div className="modal-overlay" ref={overlayRef}>
            <div className="modal-box" ref={modalRef}>
                <div className="modal-header">
                    <h3 className="modal-h3">{modalTitle}</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-tabs">
                    <button
                        className={tab === "pickup" ? "tab active" : "tab"}
                        onClick={() => setTab("pickup")}
                    >
                        Retiro en Local
                    </button>
                    <button
                        className={tab === "delivery" ? "tab active" : "tab"}
                        onClick={() => setTab("delivery")}
                    >
                        Envío a Domicilio
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Common Field: Name */}
                    <div className="form-group">
                        <span className="label">Tu Nombre *</span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Juan Pérez"
                            className={errors.name ? "input-error" : ""}
                            aria-invalid={errors.name ? "true" : "false"}
                        />
                        {errors.name && <small className="error-msg">{errors.name}</small>}
                    </div>

                    {tab === "pickup" ? (
                        <div className="pickup-info">
                            <p>📍 <b>Dirección del local:</b> A convenir con nuestro representante.</p>
                            <p>🕒 <b>Horarios:</b> A convenir.</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <span className="label">Dirección *</span>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Calle y Altura"
                                    className={errors.address ? "input-error" : ""}
                                    aria-invalid={errors.address ? "true" : "false"}
                                />
                                {errors.address && <small className="error-msg">{errors.address}</small>}
                            </div>

                            <div className="form-group">
                                <span className="label">Localidad / Barrio *</span>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Ej: Palermo"
                                    className={errors.city ? "input-error" : ""}
                                    aria-invalid={errors.city ? "true" : "false"}
                                />
                                {errors.city && <small className="error-msg">{errors.city}</small>}
                            </div>

                            <div className="form-group">
                                <span className="label">Teléfono de contacto *</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Ej: 11 1234 5678"
                                    className={errors.phone ? "input-error" : ""}
                                    aria-invalid={errors.phone ? "true" : "false"}
                                />
                                {errors.phone && <small className="error-msg">{errors.phone}</small>}
                            </div>

                            <div className="form-group">
                                <span className="label info-text">
                                    El costo del envío dependerá de la distancia y será informado una vez calculado.<br></br>
                                    Los pedidos se confirman con el 50% de adelanto.
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
