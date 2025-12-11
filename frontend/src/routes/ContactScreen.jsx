import { useState } from "react";
import './styles/contact.css'

export function ContactScreen() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "Consulta general",
    comentarios: ""
  });

  const [errors, setErrors] = useState({});

  const temas = [
    "Consulta general",
    "Pedido / Compra",
    "Problema con producto",
    "Colaboraciones",
    "Otro"
  ];

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
    if (!form.email.trim()) errs.email = "El correo electrónico es obligatorio.";
    else {
      // simple email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(form.email)) errs.email = "Introduce un correo válido.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((es) => ({ ...es, [name]: undefined }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const errs = validate();
  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  // 3. SI NO HAY ERRORES:
  // Disparamos el envío nativo del formulario HTML.
  // Esto usa el 'action' que pusiste en el JSX y abre la nueva pestaña sin bloqueos.
  e.target.submit();

  // Opcional: Limpiar el formulario visualmente (aunque el usuario estará en otra pestaña)
    setForm({ nombre: "", email: "", asunto: "Consulta general", comentarios: "" });
};

  return (
    <form 
      className="contact-form" 
      onSubmit={handleSubmit} 
      target="_blank"
      noValidate
      action="https://formsubmit.co/76873159ba20b128215a46e1328864af" 
      method="POST"
      >
      <h3>Contactanos</h3>
      {/* 1. Redirección al enviar: Cambia esta URL por la tuya de Netlify */}
      <input type="hidden" name="_next" value="https://santalice.netlify.app/contact" />

      {/* 2. Evitar Captcha (Opcional, hace el envío más rápido) */}
      <input type="hidden" name="_captcha" value="false" />

      <label className="field">
        <span className="label">Nombre *</span>
        <input
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          aria-invalid={errors.nombre ? "true" : "false"}
          placeholder="Tu nombre"
          required
        />
        {errors.nombre && <small className="error">{errors.nombre}</small>}
      </label>

      <label className="field">
        <span className="label">Email *</span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          aria-invalid={errors.email ? "true" : "false"}
          placeholder="tu@ejemplo.com"
          required
        />
        {errors.email && <small className="error">{errors.email}</small>}
      </label>

      <label className="field">
        <span className="label">Asunto</span>
        <select name="asunto" 
          value={form.asunto} 
          onChange={handleChange} >
          {temas.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="label">Comentarios</span>
        <textarea
          name="comentarios"
          rows="5"
          value={form.comentarios}
          onChange={handleChange}
          placeholder="Escribe aquí tu mensaje..."
        />
      </label>

      <div className="actions">
        <button type="submit" className="btn-send">
          "Enviar"
        </button>
      </div>
    </form>
  );
}

