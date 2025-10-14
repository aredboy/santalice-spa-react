import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export default function Dropdown({ label, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // true when >=1200px
  const triggerRef = useRef(null);
  const wrapRef = useRef(null);
  const portalRootRef = useRef(null);
  const portalListRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 220 });

  // create portal root on mount (used only for desktop mode)
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

  // Media query watcher for desktop vs mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1200px)");
    const setMatch = () => setIsDesktop(Boolean(mq.matches));
    setMatch();
    const listener = () => setMatch();
    // modern API
    if (mq.addEventListener) mq.addEventListener("change", listener);
    else mq.addListener(listener);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", listener);
      else mq.removeListener(listener);
    };
  }, []);

  // Compute portal coords for desktop (left/top/width)
  const updateCoords = () => {
    const nav = document.querySelector(".app-navbar");
    const trigger = triggerRef.current;
    if (!trigger || !nav) {
      setCoords((c) => ({ ...c, top: 96 }));
      return;
    }
    const trigRect = trigger.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    // align left to trigger, min width so items don't squish
    let desiredWidth = Math.max(180, Math.round(trigRect.width));
    let left = Math.round(trigRect.left);
    // clamp inside viewport with small margin
    const maxRight = window.innerWidth - 12;
    if (left + desiredWidth > maxRight) left = Math.max(12, maxRight - desiredWidth);
    const top = Math.round(navRect.bottom + 8); // 8px gap
    setCoords({ top, left, width: desiredWidth });
  };

  // update coords on resize/scroll
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

  // Toggle open
  const toggle = () => setOpen((s) => !s);

  // Close on outside click / escape
  useEffect(() => {
    const onDocPointer = (e) => {
      if (!open) return;
      // if click inside trigger: ignore
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      // if portal root contains event: ignore (so clicking inside portal won't close)
      if (portalRootRef.current && portalRootRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // When portal list is rendered & open, measure its height and set var on navbar (push down main).
  // Also add/remove .dropdown-open class on navbar. Works only for desktop portal mode.
  useLayoutEffect(() => {
    const portalEl = portalListRef.current;
    const nav = document.querySelector(".app-navbar");
    if (!nav) return;
    if (isDesktop && open && portalEl) {
      // measure after paint
      requestAnimationFrame(() => {
        const h = Math.ceil(portalEl.getBoundingClientRect().height);
        nav.classList.add("dropdown-open");
        nav.style.setProperty("--dropdown-open-height", `${h}px`);
      });
    } else {
      nav.classList.remove("dropdown-open");
      nav.style.removeProperty("--dropdown-open-height");
    }
  }, [open, isDesktop, coords]);

  // handle link click inside dropdown: close (works for both inline and portal)
  const handleItemClick = () => setOpen(false);

  // Build portal node (desktop) or inline node (mobile)
  const portal = portalRootRef.current && isDesktop
    ? createPortal(
        <ul
          ref={portalListRef}
          className={`simple-dropdown ${open ? "open" : ""}`}
          role="menu"
          style={{
            position: "fixed",
            left: `${coords.left}px`,
            top: `${coords.top}px`,
            width: `${coords.width}px`,
            zIndex: 2000
          }}
          onClick={handleItemClick}
        >
          {React.Children.map(children, (child, i) => (
            <li className="simple-dropdown-item" key={i}>
              {child}
            </li>
          ))}
        </ul>,
        portalRootRef.current
      )
    : null;

  // Inline dropdown markup for mobile (nice accessible fallback)
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
    <div ref={wrapRef} className={`simple-dropdown-wrap ${open ? "open" : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`dropdown-trigger ${className}`}
        aria-expanded={open}
        onClick={() => {
          // update coords right before opening (desktop)
          if (isDesktop) updateCoords();
          toggle();
        }}
        onKeyDown={(e) => {
          // keyboard: open on Enter / Space
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
