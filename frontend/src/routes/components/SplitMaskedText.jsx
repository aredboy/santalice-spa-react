// SplitMaskedText.jsx
import React, {
    useLayoutEffect,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import gsap from "gsap";

const DEFAULTS = {
    duration: 1,
    ease: "expo.out",
    stagger: 0.15,
    opacity: 0,
    yPercent: 35,
};

const SplitMaskedText = forwardRef(function SplitMaskedText(
    { children = "", className = "", config = {} },
    ref
) {
    const rootRef = useRef(null);
    const tlRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const currentTextRef = useRef(
        typeof children === "string" ? children : String(children)
    );

    // expose replay method to parent via ref
    useImperativeHandle(ref, () => ({
        replay: (speed = 1) => {
            const tl = tlRef.current;
            if (tl) {
                tl.timeScale(1 / Math.max(0.0001, speed));
                tl.restart();
            }
        },
        rebuild: () => {
            buildSplit(true);
        },
    }));

    // helper to kill timeline and clear created DOM wrappers
    function clearSplit() {
        if (!rootRef.current) return;
        // kill gsap timeline
        if (tlRef.current) {
            try {
                tlRef.current.kill();
            } catch (e) {}
            tlRef.current = null;
        }
        // Vaciar el contenido para evitar duplicados
        rootRef.current.innerHTML = "";
    }

    // main builder (can be called on mount and on resize)
    function buildSplit(force = false) {
        const root = rootRef.current;
        if (!root) return;

        const text = typeof children === "string" ? children : String(children);

        // if text changed set it
        currentTextRef.current = text;

        // clear previous
        clearSplit();

        // Create spans for words (preserve whitespace)
        const words = text.split(/(\s+)/);

        const frag = document.createDocumentFragment();
        words.forEach((w) => {
            const span = document.createElement("span");
            span.className = "split-word";
            span.textContent = w;
            frag.appendChild(span);
        });
        root.appendChild(frag);

        // force reflow before measuring
        // group by offsetTop to form lines
        const all = Array.from(root.querySelectorAll(".split-word"));
        if (!all.length) return;

        const groups = [];
        all.forEach((el) => {
            const t = el.offsetTop;
            const g = groups.find((g) => Math.abs(g.top - t) < 2);
            if (g) g.items.push(el);
            else groups.push({ top: t, items: [el] });
        });

        // Wrap each line in .split-line and create an inner .split-line-inner
        const lines = [];
        groups.forEach((g) => {
            const lineWrap = document.createElement("div");
            lineWrap.className = "split-line";
            g.items.forEach((node) => lineWrap.appendChild(node));
            // create inner
            const inner = document.createElement("div");
            inner.className = "split-line-inner";
            while (lineWrap.firstChild) inner.appendChild(lineWrap.firstChild);
            lineWrap.appendChild(inner);
            lines.push(lineWrap);
            root.appendChild(lineWrap);
        });

        // Build GSAP timeline
        const defaults = { ...DEFAULTS, ...config };
        // kill previous tl if any
        if (tlRef.current) {
            try {
                tlRef.current.kill();
            } catch (e) {}
            tlRef.current = null;
        }

        const inners = root.querySelectorAll(".split-line-inner");
        const tl = gsap.timeline({ paused: true });
        tl.from(inners, {
            yPercent: defaults.yPercent,
            opacity: defaults.opacity,
            duration: defaults.duration,
            stagger: defaults.stagger,
            ease: defaults.ease,
        });
        tlRef.current = tl;
        tl.play();
    }

    // Build once after font ready and after mount
    useLayoutEffect(() => {
        let mounted = true;

        const start = () => {
            if (!mounted) return;
            buildSplit();
        };

        // wait for document fonts to be ready to measure lines correctly
        if (document.fonts && document.fonts.status !== "loaded") {
            document.fonts.ready.then(start).catch(start);
        } else {
            start();
        }

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children, className]); // rebuild if children change

    // ResizeObserver to rebuild split on resize with debounce
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        let rafId = null;
        let resizeTimer = null;

        const debouncedBuild = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                buildSplit(true);
            });
        };

        // fallback: window resize debounced
        const onWinResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                debouncedBuild();
            }, 120);
        };

        if (window.ResizeObserver) {
            resizeObserverRef.current = new ResizeObserver((entries) => {
                // use RAF to batch
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    buildSplit(true);
                });
            });
            resizeObserverRef.current.observe(root);
            // also observe ancestors that may affect width
            let p = root.parentElement;
            let depth = 0;
            while (p && depth < 6) {
                resizeObserverRef.current.observe(p);
                p = p.parentElement;
                depth++;
            }
            window.addEventListener("resize", onWinResize);
        } else {
            window.addEventListener("resize", onWinResize);
        }

        return () => {
            if (resizeObserverRef.current) {
                try {
                    resizeObserverRef.current.disconnect();
                } catch (e) {}
                resizeObserverRef.current = null;
            }
            window.removeEventListener("resize", onWinResize);
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeTimer) clearTimeout(resizeTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            clearSplit();
            if (tlRef.current) {
                try {
                    tlRef.current.kill();
                } catch (e) {}
                tlRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className={`split-root ${className}`}
            aria-hidden={false}
        >
            {/* initial content (will be replaced on mount) */}
            {typeof children === "string" ? children : String(children)}
        </div>
    );
});

export default SplitMaskedText;
