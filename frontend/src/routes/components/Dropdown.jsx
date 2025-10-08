// src/context/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const toggle = () => setOpen((s) => !s);

  // keep parent <li> in sync so CSS can target "li.nav-item.open + li"
  useEffect(() => {
    const li = wrapRef.current?.closest("li");
    if (!li) return;
    if (open) li.classList.add("open");
    else li.classList.remove("open");
  }, [open]);

  // close on blur (keyboard/mouse)
  const onBlur = (e) => {
    if (!wrapRef.current.contains(e.relatedTarget)) setOpen(false);
  };

  // close when clicking inside a link
  const handleItemClick = () => setOpen(false);

  return (
    <div
      ref={wrapRef}
      className={`simple-dropdown-wrap ${open ? "open" : ""}`}
      onBlur={onBlur}
    >
      <button
        type="button"
        className={`dropdown-trigger ${className}`}
        aria-expanded={open}
        onClick={toggle}
      >
        {label}
      </button>
      <ul
        className={`simple-dropdown ${open ? "open" : ""}`}
        onClick={handleItemClick}
        role="menu"
      >
        {React.Children.map(children, (child, i) => (
          <li className="simple-dropdown-item" key={i}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}

