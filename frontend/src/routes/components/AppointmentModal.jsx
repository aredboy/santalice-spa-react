import { useState, useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CartContext } from "../context/CartContext";
import "../styles/appointment.css"; 
// import { set } from "mongoose";

export const AppointmentModal = ({ isOpen, onClose }) => {
    const { scheduleOrder } = useContext(CartContext);
    const navigate = useNavigate();

    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    const [date, setDate] = useState("");
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        name: "",
        phone: "",
        deliveryType: "delivery",
        address: "",
        city: "",
        eventType: "Cena Familiar", // default
    });

    // GSAP Slide Up Animation
    useEffect(() => {
        if (isOpen) {
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.3,
                pointerEvents: "auto",
            });
            gsap.fromTo(
                modalRef.current,
                { y: "100%" },
                { y: "0%", duration: 0.5, ease: "power3.out" }
            );
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                pointerEvents: "none",
            });
            gsap.to(modalRef.current, { y: "100%", duration: 0.3 });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Clear error for this field as user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const validate = () => {
        const errs = {};
        
        // 1. Validate Date (now mandatory)
        if (!date) {
            errs.date = "Debes seleccionar una fecha para agendar el pedido.";
        } else {
            // Optional: Check if the date is in the past (based on your `min={today}`)
            const today = new Date().toISOString().split('T')[0];
            if (date < today) {
                errs.date = "No puedes seleccionar una fecha pasada.";
            }
        }

        // 2. Validate Name
        if (!form.name.trim()) errs.name = "El nombre es obligatorio.";

        // 3. Validate Delivery fields if deliveryType is 'delivery'
        if (form.deliveryType === "delivery") {
            if (!form.address.trim()) errs.address = "La dirección es obligatoria.";
            if (!form.city.trim()) errs.city = "La localidad es obligatoria.";
            
            // Phone validation
            if (!form.phone.trim()) {
                errs.phone = "El teléfono es obligatorio.";
            } else {
                const phoneRegex = /^[0-9+\-\s()]*$/;
                if (!phoneRegex.test(form.phone) || form.phone.length < 6) {
                    errs.phone = "Ingresa un número de teléfono válido.";
                }
            }
        }
        
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Corre validacion.
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        // 2. Paso validacion. Save data to Global Context
        const dateObj = new Date(date + 'T00:00:00')
        scheduleOrder({
            date: dateObj,
            name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city,
            type: form.deliveryType,
            eventType: form.eventType,
        });

        // 3. Navigate to Shop
        navigate("/products");
    };

    const today = new Date().toISOString().split("T")[0];

    const portalRoot = document.getElementById("portal-root") || document.body;
    
    return createPortal(
        <div className="appointment-overlay" ref={overlayRef}>
            <div className="appointment-sheet" ref={modalRef}>
            <div className="modal-header-1">
                <h3 className="modal-h3-ap">📅 Agendá tu Pedido</h3>
                <button className="modal-close-btn-app" onClick={onClose}>
                    &times;
                </button>
            </div>

            <form onSubmit={handleSubmit} className="appointment-form" noValidate>
                <div className={`form-row ${errors.date ? 'form-row-error' : ''}`}>
                    <label className="label-app" htmlFor="date">Seleciona la fecha *</label>
                    <input
                        type="date"
                        name="date"
                        required
                        id="date"
                        min={today}
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value)
                            if (errors.date) {
                                setErrors({ ...errors, date: undefined })
                            }}}
                        className={errors.date ? "native-date-input input-error" : "native-date-input"}
                        aria-invalid={errors.date ? "true" : "false"}
                    />
                    {errors.date && <span className="error-msg">{errors.date}</span>}
                </div>
                <div className={`form-row ${errors.name ? 'form-row-error' : ''}`}>
                    <label className="label-app" htmlFor="name">Nombre *</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className={errors.name ? "input-error" : ""} 
                        aria-invalid={errors.name ? "true" : "false"}
                        placeholder="Ej: Alicia"
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className={`form-row ${errors.phone ? 'form-row-error' : ''}`}>
                    <label className="label-app" htmlFor="phone">Teléfono *</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Ej: 11 5555 9999"
                        className={errors.phone ? "input-error" : ""} 
                        aria-invalid={errors.phone ? "true" : "false"}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>

                <div className="form-row">
                    <label className="label-app" htmlFor="eventType">Tipo de Evento</label>
                    <select
                        name="eventType"
                        id="eventType"
                        value={form.eventType}
                        onChange={handleChange}    
                    >
                        <option>Cena Familiar</option>
                        <option>Cumpleaños</option>
                        <option>Evento Corporativo</option>
                        <option>Otro</option>
                    </select>
                </div>

                <div className="form-toggle">
                    <label className={form.deliveryType === 'delivery' ? 'active' : ''}>
                        <input
                            type="radio"
                            name="delType"
                            checked={form.deliveryType === "delivery"}
                            onChange={() => {
                                setForm({
                                    ...form,
                                    deliveryType: "delivery",
                                });
                                setErrors({});
                            }}
                        />{" "}
                        Envío a Domicilio
                    </label>
                    <label className={form.deliveryType === 'pickup' ? 'active' : ''}>
                        <input
                            type="radio"
                            name="delType"
                            checked={form.deliveryType === "pickup"}
                            onChange={() => {
                                setForm({ ...form, deliveryType: "pickup" })
                                setErrors({});
                            }}
                        />{" "}
                        Retiro en Local
                    </label>
                </div>

                {form.deliveryType === "delivery" && (
                <>
                    <div className={`form-row ${errors.address ? 'form-row-error' : ''}`}>
                        <label className="label-app" htmlFor="address">Dirección de entrega *</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            required
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Calle y Altura"
                            className={errors.address ? "input-error" : ""}
                            aria-invalid={errors.address ? "true" : "false"}
                        />
                        {errors.address && <span className="error-msg">{errors.address}</span>}
                    </div>
                    <div className={`form-row ${errors.city ? 'form-row-error' : ''}`}>
                        <label className="label-app" htmlFor="city">Localidad / Barrio *</label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            required
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Ej: Palermo"
                            className={errors.city ? "input-error" : ""}
                            aria-invalid={errors.city ? "true" : "false"}
                        />
                        {errors.city && <span className="error-msg">{errors.city}</span>}
                    </div>
                </>
                )}

                <div className="actions">
                <button type="submit" className="btn-proceed">
                    Elegí tus Productos
                </button>
                </div>
            </form>
        </div>
    </div>,
    portalRoot
    );
};
