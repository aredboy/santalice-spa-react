// export const AboutScreen = () => {
//   return (
//     <div>AboutScreen</div>
//   )
// }
import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import SplitMaskedText from "./components/SplitMaskedText";
import './styles/about.css'

// AboutChef.jsx
// Mobile-first, responsive "About me" / chef profile component
// Design tokens from your brief:
//   background: #f9f8f8
//   text: #4c5b61
//   accent: #2dbcc1
// Font: EB Garamond (import recommended in your index.html or global CSS)

export function AboutScreen({
  imageSrc = "images/ali.png",
  name = "Chef Alicia Della Siega",
  role = "Head Chef & Dueña",
}) {
  // Parallax tilt for image on pointer move (desktop)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const splitRef = useRef(null);

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
    <section
      aria-labelledby="about-chef-title"
      className="about-chef-root"
    >
      <div className="about-chef-container">
        <header className="about-header">
          <span className="badge">Nuestra chef</span>
          <h2 id="about-chef-title" className="title">{name} — <span className="role">{role}</span></h2>
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
              <div className="float-shape" />
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
                <button className="btn primary">Agendá un pedido</button>
                <button className="btn outline">Conocé el menú</button>
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
