import { useState, useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CartContext } from "../context/CartContext";
import "../styles/appointment.css"; 

export const AppointmentModal = ({ isOpen, onClose }) => {
    const { scheduleOrder } = useContext(CartContext);
    const navigate = useNavigate();

    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    const [date, setDate] = useState("");
    const [form, setForm] = useState({
        name: "",
        deliveryType: "delivery", // or 'pickup'
        address: "",
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const dateObj = new Date(date + 'T00:00:00')
        // 1. Save data to Global Context
        scheduleOrder({
            date: dateObj,
            name: form.name,
            address: form.address,
            type: form.deliveryType,
            eventType: form.eventType,
        });

        // 2. Navigate to Shop
        navigate("/products");
    };

    const today = new Date().toISOString().split("T")[0];

    return createPortal(
        <div className="appointment-overlay" ref={overlayRef}>
            <div className="appointment-sheet" ref={modalRef}>
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>

                <h2>📅 Agendá tu Pedido</h2>

                <div className="form-row date-row">
                    <label htmlFor="date">Seleciona la fecha:</label>
                    <input
                        type="date"
                        required
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="native-date-input"
                    />
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-row">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="Ej: Alicia"
                        />
                    </div>

                    <div className="form-row">
                        <label>Tipo de Evento:</label>
                        <select
                            value={form.eventType}
                            onChange={(e) =>
                                setForm({ ...form, eventType: e.target.value })
                            }
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
                                onChange={() =>
                                    setForm({
                                        ...form,
                                        deliveryType: "delivery",
                                    })
                                }
                            />{" "}
                            Envío a Domicilio
                        </label>
                        <label className={form.deliveryType === 'pickup' ? 'active' : ''}>
                            <input
                                type="radio"
                                name="delType"
                                checked={form.deliveryType === "pickup"}
                                onChange={() =>
                                    setForm({ ...form, deliveryType: "pickup" })
                                }
                            />{" "}
                            Retiro en Local
                        </label>
                    </div>

                    {form.deliveryType === "delivery" && (
                        <div className="form-row">
                            <label>Dirección de entrega:</label>
                            <input
                                type="text"
                                required
                                value={form.address}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        address: e.target.value,
                                    })
                                }
                                placeholder="Calle y Altura"
                            />
                        </div>
                    )}

                    <button type="submit" className="btn-proceed">
                        Elegí tus Productos →
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};
