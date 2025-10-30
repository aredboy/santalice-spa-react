// export const AboutScreen = () => {
//   return (
//     <div>AboutScreen</div>
//   )
// }
import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
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
  bio = `Mariana brings 20 years of artisanal baking and home-cooking experience to the table. She blends traditional techniques with playful, seasonal flavors — always sourcing locally and cooking with heart. Her signature is simple: honest ingredients, confident hands, and an eye for beauty.`,
}) {
  // Parallax tilt for image on pointer move (desktop)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);

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
              <p className="lead">{bio}</p>

              <p className="lead">She believes that cooking is a conversation — with the ingredients, the season, and the people we share the table with. Each plate tells a short story, and every menu is a new chapter.</p>

              <div className="cta-row">
                <button className="btn primary">Book a tasting</button>
                <button className="btn outline">View menu</button>
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
