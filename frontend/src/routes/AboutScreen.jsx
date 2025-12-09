import { useRef, useState } from "react";
import { NavLink } from "react-router-dom"
import { motion, useMotionValue, useTransform } from "framer-motion";
import { AppointmentModal } from "./components/AppointmentModal";
import SplitMaskedText from "./components/SplitMaskedText";
import './styles/about.css'

export function AboutScreen({
  imageSrc = "images/ali.png",
  name = "Alicia Della Siega",
}) {
  // Parallax tilt for image on pointer move (desktop)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const splitRef = useRef(null);

  const [showAppointment, setShowAppointment] = useState(false);

  function handlePointer(e) {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const py = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(px * 20);
    y.set(py * 20);
  }

  function resetPointer() {
    x.set(0);
    y.set(0);
  }

  return (
    <>
    <AppointmentModal
      isOpen={showAppointment}
      onClose={()=> setShowAppointment(false)}
    />
    <section
      aria-labelledby="about-chef-title"
      className="about-chef-root"
    >
      <div className="about-chef-container">
        <header className="about-header">
          <h2 id="about-chef-title" className="title">{name}</h2>
        </header>

        <div className="about-grid">
          <div className="portrait-column">
            <div
              ref={wrapRef}
              onPointerMove={handlePointer}
              onPointerLeave={resetPointer}
              className="portrait-wrap"
              aria-hidden={false}
            />
              <div className="portrait-ring" aria-hidden />
            <motion.img
                ref={imgRef}
                src={imageSrc}
                alt={`Portrait of ${name}`}
                className="portrait-img"
                loading="lazy"
            />

            <p className="portrait-tag">Estacional, local & preparado con amor.</p>
          </div>

          <div className="text-column">
            {/* Desktop editorial float: a visual shape to make text wrap beautifully */}
            <div className="editorial-wrap" aria-hidden>
              <div className="float-shape"/>
            </div>

            <div className="bio-block">

              <SplitMaskedText ref={splitRef} className="lead">
                {`Soy Profesora de Lengua y Literatura y apasionada por la cocina.
                Desde mi infancia me interesó todo lo que tuviera que ver con el ambiente culinario. Tuve muy
                lindos modelos para seguir: mi mamá, la primera, que renegaba de la cocina pero que lo hacía
                súper bien; y mi tía abuela, Eli, maestra absoluta. Sentía una gran curiosidad por saber cómo se
                preparaban los alimentos y coleccionaba recetas de la revista Anteojito, en la que la querida
                Blanca Cotta publicaba ¨Mis comiditas¨. Teníamos permiso para usar la cocina y practicar,
                siempre con la debida supervisión. En esa época, ensayamos bizcochuelos, arrollados, tortas y
                galletitas.
                La cocina siempre es un acto de amor, es la forma de brindarse con el alma a nuestros seres
                queridos. Nunca voy a olvidar las manos de la tía Eli al hacer la comida. Sólo con presionar un
                trozo de pan casero para hacernos los sándwiches que nos encantaban, mostraba la magia que le
                aportaba el cariño que nos tenía. A la hora de la siesta, con ella veíamos los programas de la
                ecónoma Nilda de Siemienczuck, siempre con un cuadernito al lado para anotar las recetas.
                Inolvidables su pastel de manzana americano y las deliciosas pastas caseras. Contenían el
                ingrediente secreto, el que en este emprendimiento de Sant´Alice tratamos de poner en todo lo
                que hacemos: mucho amor.`}
              </SplitMaskedText>

              <div className="cta-row">
                <button 
                  className="btn primary"
                  onClick={() => setShowAppointment(true)}
                >
                    Agendá un pedido
                </button>
                    <NavLink to="/products" className="nav-link">
                      <button className="btn outline" >Conocé el menú</button>
                    </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="divider" role="presentation" />
      </div>

    </section>
    </>
  );
}
