import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/home.css"; 

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// Helper to split text into words for animation
const SplitText = ({ children }) => {
  if (typeof children !== "string") return null;
  const words = children.split(" ");
  return (
    <>
      {words.map((word, i) => ([
        <span key={i} className="word">
          {word}
        </span>,
        i < words.length - 1 ? " " : ""
      ]))}
    </>
  );
};

export function HomeScreen() {
  const mainRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const sections = gsap.utils.toArray(".story-section");
      
      sections.forEach((section, index) => {
        const img = section.querySelector(".product-img-home");
        const words = section.querySelectorAll(".word");
        const nextSection = sections[index + 1]; // Grab the next section

        ScrollTrigger.create({
          // markers: true,
          trigger: img,
          start: "top 55%", // Activate when image hits center
          
          // 2. FIX: Keep active until the NEXT section's image hits the center
          endTrigger: nextSection ? nextSection.querySelector(".product-img-home") : section,
          end: "bottom 20%", 
          
          toggleClass: "active",
          toggleActions: "play reverse play reverse",
        });

        // 2. TEXT REVEAL (Pinning)
        // Stops the scroll (pin) until all words are revealed
        if(words.length > 0) {
            gsap.to(words, {
              opacity: 1,
              stagger: .1, // Speed of word reveal
              ease: "none",
              scrollTrigger: {
                // markers: true,
                trigger: section,
                start: "top 5%", 
                end: "center center", // Pin for the duration of 1 screen height
                // scrub: true,   // Link animation to scrollbar
                // pin: true,     // Hold the section in place
              }
            });
        }
      });

      // 3. LINE ANIMATIONS (Draw SVG)
      // Line 1: From Section 1 Image to Section 2 Image
      if (line1Ref.current) {
          gsap.fromTo(line1Ref.current, 
            { strokeDashoffset: 1000 }, 
            {
              strokeDashoffset: 0,
              scrollTrigger: {
                // markers: true,
                trigger: "#section-1",
                start: "bottom 70%", // Start drawing as Section 1 leaves
                endTrigger: "#section-2",
                end: "center center",   // Finish when Section 2 arrives
                scrub: 2,
              }
            }
          );
      }

      // Line 2: From Section 2 Image to Section 3 Image
      if (line2Ref.current) {
          gsap.fromTo(line2Ref.current, 
            { strokeDashoffset: 1000 },
            {
              strokeDashoffset: 0,
              scrollTrigger: {
                // markers: true,
                trigger: "#section-2",
                start: "bottom-=150 center", // Start drawing as Section 2 leaves
                endTrigger: "#section-3",
                end: "bottom 80%",
                scrub: 1,
              }
            }
          );
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
      <div className="home-container" ref={mainRef}>

        {/* HERO INTRO SECTION */}
        <section className="hero-intro" id="intro-section">
        <div className="intro-content">
          <h1>¡Bienvenido a <span className="asterisc">Sant'Alice</span>!</h1>
          <p>
            Donde cada bocado cuenta una historia de tradición y sabor artesanal. 
            <br />
            <span className="asterisc">**</span>Desliza hacia abajo<span className="asterisc">**</span> para descubrir nuestros productos.
          </p>
        </div>
      </section>

      {/* ViewBox matches approx container size. preserveAspectRatio="none" stretches it. */}
      <svg className="lines-svg-container" viewBox="0 0 1000 3000" preserveAspectRatio="none">
        
        {/* LINE 1: Top Right (750) -> Middle Left (250) */}
        {/* Grey Background Path */}
        <path d="M 750 600 C 750 1100, 250 1100, 250 1600" className="line-path-bg" />
        {/* Cyan Active Path */}
        <path 
          ref={line1Ref}
          d="M 750 600 C 750 1100, 250 1100, 250 1600" 
          className="line-path-active"
          pathLength="1000"
          strokeDasharray="1000" 
        />

        {/* LINE 2: Middle Left (250) -> Bottom Right (750) */}
        <path d="M 250 1600 C 250 2100, 750 2100, 750 2600" className="line-path-bg" />
        <path 
          ref={line2Ref}
          d="M 250 1600 C 250 2100, 750 2100, 750 2600" 
          className="line-path-active"
          pathLength="1000"
          strokeDasharray="1000" 
        />
      </svg>

      {/* SECTION 1: TORTAS (Image Right) */}
      <section className="story-section right-img" id="section-1">
        <div className="text-box">
          <h3 className="story-paragraph title-paragraph">
            <SplitText>
              Tortas Especiales
            </SplitText>
          </h3> 
          <p className="story-paragraph">
            <SplitText>
              Nuestras tortas son una explosión de sabor artesanal. 
              Cada capa está horneada con dedicación, utilizando los 
              ingredientes más frescos para crear una experiencia 
              inolvidable en cada bocado. Descubre la dulzura real.
            </SplitText>
          </p>
        </div>
        <div className="img-box">
          <Link to="/products/tortas" className="img-a">
            <img 
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80" 
              alt="Tortas" 
              className="product-img-home"
            />
          </Link>
        </div>
      </section>

      {/* SECTION 2: BUDINES (Image Left) */}
      <section className="story-section left-img" id="section-2">
        <div className="text-box">
          <h3 className="story-paragraph title-paragraph">
            <SplitText>
              Budines
            </SplitText>
          </h3> 
          <p className="story-paragraph">
            <SplitText>
              Esponjosos, húmedos y con ese aroma a hogar que tanto amas. 
              Nuestros budines son el compañero perfecto para tu café 
              de la tarde o ese antojo de medianoche. Hechos con recetas 
              de la abuela y un toque moderno.
            </SplitText>
          </p>
        </div>
        <div className="img-box">
          <Link to="/products/budines" className="img-a">
            <img 
              src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80" 
              alt="Budines" 
              className="product-img-home"
            />
          </Link>
        </div>
      </section>

      {/* SECTION 3: MAS DULCES (Image Right) */}
      <section className="story-section right-img" id="section-3">
        <div className="text-box">
          <h3 className="story-paragraph title-paragraph">
            <SplitText>
              Otras Especialidades
            </SplitText>
          </h3> 
          <p className="story-paragraph">
            <SplitText>
              Para los que buscan algo más, tenemos una selección de 
              pequeños placeres. Desde alfajores hasta galletas decoradas, 
              cada pieza es una pequeña obra de arte comestible lista 
              para alegrar tu día.
            </SplitText>
          </p>
        </div>
        <div className="img-box">
          <Link to="/products/masdulces" className="img-a">
            <img 
              src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80" 
              alt="Dulces" 
              className="product-img-home"
            />
          </Link>
        </div>
      </section>

    </div>
  );
}