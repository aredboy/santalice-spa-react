import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export default function Dropdown({ label, children, className = "" }) {
  const DEBUG = false; // set true while testing

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // >=1200px


  const triggerRef = useRef(null);
  const wrapRef = useRef(null);
  const portalRootRef = useRef(null);
  const portalListRef = useRef(null);
  const backdropRootRef = useRef(null);

  // timers
  const closeTimerRef = useRef(null);
  const openTimerRef = useRef(null);
  const hoverCloseTimerRef = useRef(null);

  // handler refs for add/remove
  const scrollHandlerRef = useRef(null);
  const resizeHandlerRef = useRef(null);

  // observer ref
  const topObserverRef = useRef(null);

  // timings
  const transitionMs = 350;
  const openDelay = 120;
  const closeDelay = 250;

  const [coords, setCoords] = useState({ top: 0, left: 0, width: 220 });

// portal root
useEffect(() => {
  if (typeof document === "undefined") return;
  const nav = document.querySelector('.app-navbar');
  const dropdownParent = nav || document.body;
  const dropdownEl = document.createElement("div");
  dropdownEl.className = "dropdown-portal-root";
  dropdownParent.appendChild(dropdownEl);
  portalRootRef.current = dropdownEl;

  const backdropEl = document.createElement("div");
  backdropEl.className = "dropdown-backdrop-root";
  document.body.appendChild(backdropEl);
  backdropRootRef.current = backdropEl;

  return () => {
    if (portalRootRef.current) portalRootRef.current.remove();
    portalRootRef.current = null;
    if (backdropRootRef.current) backdropRootRef.current.remove();
    backdropRootRef.current = null;
  };
}, []);


  // media query watcher
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

  // idempotent coordinates setter: only update state when values actually changed
const updateCoords = () => {
  if (DEBUG) console.log("[dropdown] updateCoords called — open?", open);
  const nav = document.querySelector(".app-navbar");
  const trigger = triggerRef.current;
  if (!trigger || !nav) {
    // fallback (rare): keep previous behavior
    setCoords((c) => {
      if (c.top === 96 && c.left === 0) return c;
      return { ...c, top: 96, left: 0, width: c.width || 220 };
    });
    return;
  }

  const trigRect = trigger.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();

  const desiredWidth = Math.max(180, Math.round(trigRect.width));
  // small gap between navbar bottom and dropdown; tweak this value
  const gap = 30; // ← increase/decrease this to move dropdown further from the nav
  // left relative to navbar
  let left = Math.round(trigRect.left - navRect.left);
  const maxRight = Math.max(16, Math.round(navRect.width - 16));
  if (left + desiredWidth > maxRight) left = Math.max(16, maxRight - desiredWidth);
  // top relative to navbar (so absolute inside .app-navbar)
  const top = Math.round(trigRect.bottom - navRect.top + gap);

  setCoords((prev) => {
    if (prev.top === top && prev.left === left && prev.width === desiredWidth) {
      return prev;
    }
    return { top, left, width: desiredWidth, topViewport: Math.round(trigRect.bottom) };
  });
};



  /* ------------------- resize/scroll handlers registration ------------------- */
  useEffect(() => {
    if (!isDesktop) return;

    const onResize = () => {
      if (DEBUG) console.log("[dropdown] resize event");
      // do not force move while open
      if (!open) updateCoords();
    };
    resizeHandlerRef.current = onResize;

    const onScroll = () => {
      if (DEBUG) {/*console.log('[dropdown] scroll event')*/ }
      if (!open) updateCoords();
    };
    scrollHandlerRef.current = onScroll;

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      resizeHandlerRef.current = null;
      scrollHandlerRef.current = null;
    };
    // only run when desktop mode toggles
  }, [isDesktop]);

  // add/remove scroll listener when open toggles
  useEffect(() => {
    if (!isDesktop || !scrollHandlerRef.current) return;
    const handler = scrollHandlerRef.current;
    if (open) {
      // remove scroll listener while open (prevent repositioning)
      window.removeEventListener("scroll", handler, true);
      if (DEBUG) console.log("[dropdown] removed scroll listener while open");
    } else {
      // re-add when closed
      window.removeEventListener("scroll", handler, true);
      window.addEventListener("scroll", handler, true);
      if (DEBUG) console.log("[dropdown] added scroll listener (closed)");
      // refresh coords when closing
      updateCoords();
    }
  }, [open, isDesktop]);

  /* ------------------- open/close animation helpers ------------------- */
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true));
    });
    if (isDesktop) updateCoords();
  };

  const closeWithAnimation = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setOpen(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, transitionMs + 10);
  };

  const toggle = () => {
    if (open) closeWithAnimation();
    else openWithAnimation();
  };

  // hover handlers
  const handleMouseEnter = () => {
    if (!isDesktop) return;
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
    if (!open && !openTimerRef.current) {
      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;
        openWithAnimation();
      }, openDelay);
    }
  };
  const handleMouseLeave = () => {
    if (!isDesktop) return;
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (open && !hoverCloseTimerRef.current) {
      hoverCloseTimerRef.current = setTimeout(() => {
        hoverCloseTimerRef.current = null;
        closeWithAnimation();
      }, closeDelay);
    }
  };

  // close on outside/escape
  useEffect(() => {
    const onDocPointer = (e) => {
      if (!mounted) return;
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (portalRootRef.current && portalRootRef.current.contains(e.target)) return;
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

  // measure after layout changes — note: do NOT depend on coords.* to avoid loops
  useLayoutEffect(() => {
    if (mounted && isDesktop) updateCoords();
    // when opened, we also set the style.top explicitly (and lock via observer below)
  }, [mounted, open, isDesktop]); // removed coords dependency to prevent loop

  // mutation-observer lock: prevent any external changes to style.top while open
  useEffect(() => {
    if (!isDesktop) return;
    let observer = null;

    const lockPortalTop = (topPx) => {
      const node = portalListRef.current;
      if (!node) return;
      // apply inline top and dataset marker
      node.style.top = `${topPx}px`;
      node.dataset.locked = "true";

      // set up observer to revert any external style.top change
      if (!observer) {
        observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.type === "attributes" && m.attributeName === "style") {
              const cur = node.style.top;
              if (cur !== `${topPx}px`) {
                if (DEBUG) console.log("[dropdown] MutationObserver reverted top", cur, "->", `${topPx}px`);
                node.style.top = `${topPx}px`;
              }
            }
          }
        });
        observer.observe(node, { attributes: true, attributeFilter: ["style"] });
        topObserverRef.current = observer;
      }
    };

    const unlockPortalTop = () => {
      const node = portalListRef.current;
      if (!node) return;
      node.dataset.locked = "false";
      // optionally remove inline top here if you want:
      // node.style.top = '';
      if (observer) {
        observer.disconnect();
        observer = null;
        topObserverRef.current = null;
      }
    };

    if (open && portalListRef.current) {
      // lock at the currently calculated coords.top
      lockPortalTop(coords.top);
      if (DEBUG) console.log("[dropdown] locked portal top at", coords.top);
    } else {
      unlockPortalTop();
      if (DEBUG) console.log("[dropdown] unlocked portal");
    }

    return () => {
      if (observer) observer.disconnect();
      topObserverRef.current = null;
      observer = null;
    };
  }, [open, isDesktop, coords.top]);

  // closing on item click
  const handleItemClick = () => {
    closeWithAnimation();
  };

  // render portal
const portal = (isDesktop && mounted) ? (
  <>
    { /* backdrop rendered into body-root so it covers viewport below the navbar */ }
    {backdropRootRef.current && createPortal(
      <div
        className={`dropdown-backdrop ${open ? "open" : "closing"}`}
        onMouseDown={() => closeWithAnimation()}
        style={{
          top: `${coords.topViewport || 0}px`, // coords.topViewport is trigRect.bottom in viewport coords
        }}
      />,
      backdropRootRef.current
    )}

    { /* dropdown list rendered inside navbar-root so position:absolute keeps it attached to nav */ }
    {portalRootRef.current && createPortal(
      <>
        <ul
          ref={portalListRef}
          className={`simple-dropdown ${open ? "open" : ""}`}
          role="menu"
          onClick={handleItemClick}
          onMouseEnter={() => {
            if (hoverCloseTimerRef.current) { clearTimeout(hoverCloseTimerRef.current); hoverCloseTimerRef.current = null; }
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
            left: `${coords.left}px`,
            top: `${coords.top}px`,
            width: `${coords.width}px`,
          }}
        >
          {React.Children.map(children, (child, i) => (
            <li className="simple-dropdown-item" key={i}>{child}</li>
          ))}
        </ul>
      </>,
      portalRootRef.current
    )}
  </>
) : null;


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
        onClick={() => {
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

      {!isDesktop && inlineDropdown}
      {isDesktop && portal}
    </div>
  );
}
