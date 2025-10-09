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
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', message: '' }

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
  setResult(null);

  const errs = validate();
  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  setSending(true);

  try {
    const actionUrl = "https://formsubmit.co/germanrojo.biologistic@gmail.com";

    // crear form temporal
    const tempForm = document.createElement("form");
    tempForm.action = actionUrl;
    tempForm.method = "POST";
    tempForm.style.display = "none";
    // abrir en nueva pestaña para no abandonar SPA:
    tempForm.target = "_blank";

    const append = (name, value) => {
      const inp = document.createElement("input");
      inp.type = "hidden";
      inp.name = name;
      inp.value = value ?? "";
      tempForm.appendChild(inp);
    };

    // datos reales del state (no hardcode)
    append("nombre", form.nombre);
    append("email", form.email);
    append("asunto", form.asunto);
    append("comentarios", form.comentarios);

    // campos especiales para FormSubmit
    append("_captcha", "false"); // opcional
    append("_subject", `Contacto: ${form.asunto}`); // asunto del mail
    // append("_next", "https://tu-dominio.com/gracias"); // si quieres redirigir a /gracias

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);

    setResult({ type: "success", message: "Mensaje enviado. Revisa tu correo para confirmar si es la primera vez." });
    setForm({ nombre: "", email: "", asunto: "Consulta general", comentarios: "" });
  } catch (err) {
    console.error(err);
    setResult({ type: "error", message: "Error al enviar. Intenta nuevamente." });
  } finally {
    setSending(false);
  }
};

  return (
    <form 
      className="contact-form" 
      onSubmit={handleSubmit} 
      noValidate
      action="https://formsubmit.co/germanrojo.biologistic@gmail.com" 
      method="POST"
      >
      <h3>Contactanos</h3>

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
        <select name="asunto" value={form.asunto} onChange={handleChange}>
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
        <button type="submit" className="btn-send" disabled={sending}>
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {result && (
        <div
          role="status"
          className={`result ${result.type === "success" ? "success" : "error"}`}
          aria-live="polite"
        >
          {result.message}
        </div>
      )}
    </form>
  );
}

