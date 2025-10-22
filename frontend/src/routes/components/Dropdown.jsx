// src/context/Dropdown.jsx
// import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
// import { createPortal } from "react-dom";

// export default function Dropdown({ label, children, className = "" }) {
//   const [open, setOpen] = useState(false);        // controls "open" class (for CSS transitions)
//   const [mounted, setMounted] = useState(false);  // controls whether portal/backdrop are mounted
//   const [isDesktop, setIsDesktop] = useState(false); // >=1200px
//   const triggerRef = useRef(null);
//   const wrapRef = useRef(null);
//   const portalRootRef = useRef(null);
//   const portalListRef = useRef(null);
//   const closeTimerRef = useRef(null);
//   const transitionMs = 220; // matches CSS transition durations

//   const [coords, setCoords] = useState({ top: 0, left: 0, width: 220 });

//   // create portal root on mount
//   useEffect(() => {
//     if (typeof document === "undefined") return;
//     const el = document.createElement("div");
//     el.className = "dropdown-portal-root";
//     document.body.appendChild(el);
//     portalRootRef.current = el;
//     return () => {
//       if (portalRootRef.current) document.body.removeChild(portalRootRef.current);
//       portalRootRef.current = null;
//     };
//   }, []);

//   // media query for desktop
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(min-width: 1200px)");
//     const sync = () => setIsDesktop(Boolean(mq.matches));
//     sync();
//     const listener = () => sync();
//     if (mq.addEventListener) mq.addEventListener("change", listener);
//     else mq.addListener(listener);
//     return () => {
//       if (mq.removeEventListener) mq.removeEventListener("change", listener);
//       else mq.removeListener(listener);
//     };
//   }, []);

//   // compute coords
//   const updateCoords = () => {
//     const nav = document.querySelector(".app-navbar");
//     const trigger = triggerRef.current;
//     if (!trigger || !nav) {
//       setCoords((c) => ({ ...c, top: 96 }));
//       return;
//     }
//     const trigRect = trigger.getBoundingClientRect();
//     const navRect = nav.getBoundingClientRect();
//     let desiredWidth = Math.max(180, Math.round(trigRect.width));
//     let left = Math.round(trigRect.left);
//     const maxRight = window.innerWidth - 12;
//     if (left + desiredWidth > maxRight) left = Math.max(12, maxRight - desiredWidth);
//     const top = Math.round(navRect.bottom + 8);
//     setCoords({ top, left, width: desiredWidth });
//   };

//   // update coords on resize/scroll when desktop
//   useEffect(() => {
//     if (!isDesktop) return;
//     updateCoords();
//     const onResize = () => updateCoords();
//     window.addEventListener("resize", onResize);
//     window.addEventListener("scroll", onResize, true);
//     return () => {
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("scroll", onResize, true);
//     };
//   }, [isDesktop]);

//   // open with mount + small frame for transition
//   const openWithAnimation = () => {
//     if (closeTimerRef.current) {
//       clearTimeout(closeTimerRef.current);
//       closeTimerRef.current = null;
//     }
//     if (!mounted) setMounted(true);
//     // allow DOM to mount then add .open so CSS transitions can run
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => setOpen(true));
//     });
//     // compute coords fresh
//     if (isDesktop) updateCoords();
//   };

//   // close with animation then unmount
//   const closeWithAnimation = () => {
//     // remove open class -> runs CSS transition out
//     setOpen(false);
//     // unmount after transition
//     closeTimerRef.current = setTimeout(() => {
//       setMounted(false);
//       closeTimerRef.current = null;
//     }, transitionMs + 10);
//   };

//   // Toggle open (click)
//   const toggle = () => {
//     if (open) closeWithAnimation();
//     else openWithAnimation();
//   };

//   // Hover handlers (only effective on desktop)
//   const handleMouseEnter = () => {
//     if (!isDesktop) return;
//     openWithAnimation();
//   };
//   const handleMouseLeave = () => {
//     if (!isDesktop) return;
//     // small delay to avoid flicker when moving between trigger and dropdown
//     closeWithAnimation();
//   };

//   // Close on outside click / escape — use animated close
//   useEffect(() => {
//     const onDocPointer = (e) => {
//       if (!mounted) return; // nothing to do if not mounted
//       // if click inside trigger or portal keep open
//       if (wrapRef.current && wrapRef.current.contains(e.target)) return;
//       if (portalRootRef.current && portalRootRef.current.contains(e.target)) {
//         // inside portal -> if it is link, handler will call handleItemClick
//         return;
//       }
//       // clicked outside -> animated close
//       closeWithAnimation();
//     };
//     const onKey = (e) => { if (e.key === "Escape") closeWithAnimation(); };
//     document.addEventListener("mousedown", onDocPointer);
//     document.addEventListener("touchstart", onDocPointer);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", onDocPointer);
//       document.removeEventListener("touchstart", onDocPointer);
//       document.removeEventListener("keydown", onKey);
//       if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
//     };
//   }, [mounted]);

//   // when open/mounted changes we ensure navbar doesn't get pushed (no changes to navbar)
//   useLayoutEffect(() => {
//     // keep measuring for diagnostic/coord refresh, but do not mutate navbar layout
//     if (mounted && isDesktop) updateCoords();
//   }, [mounted, open, isDesktop, coords.left]);

//   // when a dropdown item is clicked, close with animation
//   const handleItemClick = () => {
//     closeWithAnimation();
//   };

//   // Portal content: backdrop + dropdown. Mount portal only if mounted && isDesktop
//   const portal = portalRootRef.current && isDesktop && mounted
//     ? createPortal(
//         <>
//           {/* backdrop */}
//           <div
//             className={`dropdown-backdrop ${open ? "open" : "closing"}`}
//             onMouseDown={closeWithAnimation}
//             style={{
//               top: `${coords.top}px`, // starts below navbar
//             }}
//           />

//           {/* dropdown list */}
//           <ul
//             ref={portalListRef}
//             className={`simple-dropdown ${open ? "open" : ""}`}
//             role="menu"
//             onClick={handleItemClick}
//             style={{
//               left: `${coords.left}px`,
//               top: `${coords.top}px`,
//               width: `${coords.width}px`,
//             }}
//           >
//             {React.Children.map(children, (child, i) => (
//               <li className="simple-dropdown-item" key={i}>
//                 {child}
//               </li>
//             ))}
//           </ul>
//         </>,
//         portalRootRef.current
//       )
//     : null;

//   // Inline dropdown (mobile)
//   const inlineDropdown = (
//     <ul
//       className={`simple-dropdown ${open ? "open" : ""}`}
//       role="menu"
//       onClick={handleItemClick}
//     >
//       {React.Children.map(children, (child, i) => (
//         <li className="simple-dropdown-item" key={i}>
//           {child}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <div
//       ref={wrapRef}
//       className={`simple-dropdown-wrap ${open ? "open" : ""}`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <button
//         ref={triggerRef}
//         type="button"
//         className={`dropdown-trigger ${className}`}
//         aria-expanded={open}
//         onClick={(e) => {
//           // if desktop, ensure coords updated, then toggle
//           if (isDesktop) updateCoords();
//           toggle();
//         }}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             if (isDesktop) updateCoords();
//             toggle();
//           }
//         }}
//       >
//         {label}
//       </button>

//       {/* Render inline dropdown when mobile; portal when desktop */}
//       {!isDesktop && inlineDropdown}
//       {isDesktop && portal}
//     </div>
//   );
// }
// src/context/Dropdown.jsx
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export default function Dropdown({ label, children, className = "" }) {
  const [open, setOpen] = useState(false);        // controls "open" class (for CSS transitions)
  const [mounted, setMounted] = useState(false);  // controls whether portal/backdrop are mounted
  const [isDesktop, setIsDesktop] = useState(false); // >=1200px
  const triggerRef = useRef(null);
  const wrapRef = useRef(null);
  const portalRootRef = useRef(null);
  const portalListRef = useRef(null);

  // timers for animation + hover tolerance
  const closeTimerRef = useRef(null);   // for unmount after CSS hide
  const openTimerRef = useRef(null);    // for open delay
  const hoverCloseTimerRef = useRef(null); // for close-on-hover delay

  // timings (you asked to try these)
  const transitionMs = 350;   // matches CSS transition durations (ms)
  const openDelay = 120;     // ms delay before opening on hover
  const closeDelay = 250;    // ms delay before closing after leaving

  const [coords, setCoords] = useState({ top: 0, left: 0, width: 220 });

  // create portal root on mount
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.createElement("div");
    el.className = "dropdown-portal-root";
    document.body.appendChild(el);
    portalRootRef.current = el;
    return () => {
      if (portalRootRef.current) document.body.removeChild(portalRootRef.current);
      portalRootRef.current = null;
    };
  }, []);

  // media query for desktop
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1200px)");
    const sync = () => setIsDesktop(Boolean(mq.matches));
    sync();
    const listener = () => sync();
    if (mq.addEventListener) mq.addEventListener("change", listener);
    else mq.addListener(listener);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", listener);
      else mq.removeListener(listener);
    };
  }, []);

  // compute coords
  const updateCoords = () => {
    const nav = document.querySelector(".app-navbar");
    const trigger = triggerRef.current;
    if (!trigger || !nav) {
      setCoords((c) => ({ ...c, top: 96 }));
      return;
    }
    const trigRect = trigger.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    let desiredWidth = Math.max(180, Math.round(trigRect.width));
    let left = Math.round(trigRect.left);
    const maxRight = window.innerWidth - 12;
    if (left + desiredWidth > maxRight) left = Math.max(12, maxRight - desiredWidth);
    const top = Math.round(navRect.bottom + 8);
    setCoords({ top, left, width: desiredWidth });
  };

  // update coords on resize/scroll when desktop
  useEffect(() => {
    if (!isDesktop) return;
    updateCoords();
    const onResize = () => updateCoords();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [isDesktop]);

  // open with animation (mount then set open)
  const openWithAnimation = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (!mounted) setMounted(true);
    // allow DOM to mount then add .open so CSS transitions can run
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true));
    });
    if (isDesktop) updateCoords();
  };

  // close with animation then unmount
  const closeWithAnimation = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    // remove open class -> runs CSS transition out
    setOpen(false);
    // unmount after transition
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, transitionMs + 10);
  };

  // immediate toggle (for click)
  const toggle = () => {
    if (open) closeWithAnimation();
    else openWithAnimation();
  };

  // Hover handlers with delays (for desktop only)
  const handleMouseEnter = () => {
    if (!isDesktop) return;
    // cancel any pending close
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
    // start open timer
    if (!open && !openTimerRef.current) {
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        openWithAnimation();
      }, openDelay);
    }
  };
  const handleMouseLeave = () => {
    if (!isDesktop) return;
    // cancel open timer if present
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    // start close timer
    if (open && !hoverCloseTimerRef.current) {
      hoverCloseTimerRef.current = setTimeout(() => {
        hoverCloseTimerRef.current = null;
        closeWithAnimation();
      }, closeDelay);
    }
  };

  // Close on outside click / escape — use animated close
  useEffect(() => {
    const onDocPointer = (e) => {
      if (!mounted) return; // nothing to do if not mounted
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (portalRootRef.current && portalRootRef.current.contains(e.target)) {
        // inside portal -> allow (links will call handleItemClick)
        return;
      }
      // clicked outside -> animated close
      closeWithAnimation();
    };
    const onKey = (e) => { if (e.key === "Escape") closeWithAnimation(); };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (hoverCloseTimerRef.current) clearTimeout(hoverCloseTimerRef.current);
    };
  }, [mounted]);

  // keep measuring for coord refresh (no navbar mutation)
  useLayoutEffect(() => {
    if (mounted && isDesktop) updateCoords();
  }, [mounted, open, isDesktop, coords.left]);

  // when a dropdown item is clicked, close with animation
  const handleItemClick = () => {
    closeWithAnimation();
  };

  // Portal content: backdrop + dropdown. Mount portal only if mounted && isDesktop
  const portal = portalRootRef.current && isDesktop && mounted
    ? createPortal(
        <>
          {/* backdrop: cancels close when hovering it; click closes */}
          <div
            className={`dropdown-backdrop ${open ? "open" : "closing"}`}
            onMouseDown={() => closeWithAnimation()}
            onMouseEnter={() => {
              if (hoverCloseTimerRef.current) {
                clearTimeout(hoverCloseTimerRef.current);
                hoverCloseTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              if (open && !hoverCloseTimerRef.current) {
                hoverCloseTimerRef.current = setTimeout(() => {
                  hoverCloseTimerRef.current = null;
                  closeWithAnimation();
                }, closeDelay);
              }
            }}
            style={{
              top: `${coords.top}px`,
            }}
          />

          {/* dropdown list */}
          <ul
            ref={portalListRef}
            className={`simple-dropdown ${open ? "open" : ""}`}
            role="menu"
            onClick={handleItemClick}
            onMouseEnter={() => {
              // cancel close while cursor is inside dropdown
              if (hoverCloseTimerRef.current) {
                clearTimeout(hoverCloseTimerRef.current);
                hoverCloseTimerRef.current = null;
              }
            }}
            onMouseLeave={() => {
              // start close timer when leaving dropdown
              if (open && !hoverCloseTimerRef.current) {
                hoverCloseTimerRef.current = setTimeout(() => {
                  hoverCloseTimerRef.current = null;
                  closeWithAnimation();
                }, closeDelay);
              }
            }}
            style={{
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              width: `${coords.width}px`,
            }}
          >
            {React.Children.map(children, (child, i) => (
              <li className="simple-dropdown-item" key={i}>
                {child}
              </li>
            ))}
          </ul>
        </>,
        portalRootRef.current
      )
    : null;

  // Inline dropdown (mobile)
  const inlineDropdown = (
    <ul
      className={`simple-dropdown ${open ? "open" : ""}`}
      role="menu"
      onClick={handleItemClick}
    >
      {React.Children.map(children, (child, i) => (
        <li className="simple-dropdown-item" key={i}>
          {child}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={wrapRef}
      className={`simple-dropdown-wrap ${open ? "open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`dropdown-trigger ${className}`}
        aria-expanded={open}
        onClick={(e) => {
          if (isDesktop) updateCoords();
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (isDesktop) updateCoords();
            toggle();
          }
        }}
      >
        {label}
      </button>

      {/* Render inline dropdown when mobile; portal when desktop */}
      {!isDesktop && inlineDropdown}
      {isDesktop && portal}
    </div>
  );
}
