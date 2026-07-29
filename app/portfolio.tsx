"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  Code2,
  Copy,
  Layers3,
  MessageCircle,
  Play,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";

type Format = "vertical" | "horizontal";
type Tier = "basic" | "intermediate" | "complex";

const tiers = {
  basic: {
    label: "Básica",
    caption: "Edición limpia",
    vertical: 17,
    horizontal: 52,
    items: ["Recortes precisos", "Zooms funcionales", "Subtítulos"],
  },
  intermediate: {
    label: "Intermedia",
    caption: "Ritmo y retención",
    vertical: 25,
    horizontal: 75,
    items: ["Todo lo anterior", "Efectos visuales", "Diseño sonoro"],
  },
  complex: {
    label: "Compleja",
    caption: "Acabado premium",
    vertical: 40,
    horizontal: 125,
    items: ["Motion graphics", "Rotoscopia y color", "Recursos 3D"],
  },
} as const;

const collaborators = [
  { name: "Rabanito", type: "Short-form", avatar: "/media/rabanito-avatar.jpg", note: "Ritmo alto, remates visuales y una edición pensada para detener el scroll." },
  { name: "Sara Guzo", type: "Video largo", avatar: "/media/sara-guzo-avatar.jpg", note: "Narrativa sostenida, recursos gráficos y cortes que mantienen la atención." },
  { name: "Maog", type: "Gaming", avatar: "/media/maog-avatar.jpg", note: "Timing de comedia, energía y énfasis visual al servicio de la historia." },
  { name: "Megazote", type: "Short-form", avatar: "/media/megazote-avatar.jpg", note: "Un formato compacto con impacto rápido, claridad y personalidad." },
  { name: "Poke Elle", type: "Entretenimiento", avatar: "/media/poke-elle-avatar.jpg", note: "Edición dinámica que convierte cada momento fuerte en una razón para seguir." },
];

function ParticleField({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const particles = Array.from({ length: reduced ? 24 : 62 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
      size: index % 11 === 0 ? 2.3 : Math.random() * 1.4 + 0.45,
      blue: index % 4 === 0,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        let px = particle.x * width;
        let py = particle.y * height;
        const dx = px - pointer.current.x;
        const dy = py - pointer.current.y;
        const distance = Math.hypot(dx, dy);
        if (!reduced && distance < 150 && distance > 0) {
          const force = (150 - distance) / 150;
          particle.x += (dx / distance) * force * 0.0014;
          particle.y += (dy / distance) * force * 0.0014;
        }
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -0.03) particle.x = 1.03;
        if (particle.x > 1.03) particle.x = -0.03;
        if (particle.y < -0.03) particle.y = 1.03;
        if (particle.y > 1.03) particle.y = -0.03;
        px = particle.x * width;
        py = particle.y * height;

        ctx.beginPath();
        ctx.fillStyle = particle.blue ? "rgba(36,87,255,.48)" : "rgba(16,16,16,.18)";
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();

        for (let next = index + 1; next < Math.min(index + 6, particles.length); next += 1) {
          const other = particles[next];
          const ox = other.x * width;
          const oy = other.y * height;
          const gap = Math.hypot(px - ox, py - oy);
          if (gap < 105) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(36,87,255,${(1 - gap / 105) * 0.075})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        }
      });
      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, [pointer]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

export default function Portfolio() {
  const shell = useRef<HTMLElement>(null);
  const pointer = useRef({ x: -500, y: -500 });
  const [format, setFormat] = useState<Format>("vertical");
  const [tier, setTier] = useState<Tier>("intermediate");
  const [amount, setAmount] = useState(1);
  const [urgent, setUrgent] = useState(false);
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const price = useMemo(() => {
    const base = format === "vertical"
      ? tiers[tier].vertical * amount
      : Math.ceil((tiers[tier].horizontal / 10) * amount);
    return Math.round(base * (urgent ? 1.3 : 1));
  }, [amount, format, tier, urgent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    const nodes = document.querySelectorAll(".reveal");
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % collaborators.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  const selectFormat = (next: Format) => {
    setFormat(next);
    setAmount(next === "vertical" ? 1 : 10);
  };

  const copyDiscord = async () => {
    await navigator.clipboard.writeText("just_stream");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const updatePointer = (event: React.PointerEvent<HTMLElement>) => {
    const target = shell.current;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (!target) return;
    target.style.setProperty("--mx", `${event.clientX}px`);
    target.style.setProperty("--my", `${event.clientY}px`);
    target.style.setProperty("--tilt-x", `${(event.clientX / window.innerWidth - 0.5) * 9}deg`);
    target.style.setProperty("--tilt-y", `${(event.clientY / window.innerHeight - 0.5) * -8}deg`);
  };

  return (
    <main ref={shell} className="site-shell" onPointerMove={updatePointer}>
      <ParticleField pointer={pointer} />
      <div className="screen-vignette" aria-hidden="true" />
      <nav className="nav" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="Strike, inicio">
          <span className="brand-mark">S</span><span>STRIKE</span>
        </a>
        <div className="nav-links">
          <a href="#trabajos">Trabajo</a>
          <a href="#proceso">Proceso</a>
          <a href="#precios">Precios</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="nav-status"><span>Disponible para proyectos</span></div>
      </nav>

      <header className="hero" id="inicio">
        <div className="hero-copyblock">
          <p className="kicker hero-kicker">Video editor · Motion · Storytelling</p>
          <h1 aria-label="Cada segundo cuenta">
            <span className="title-line"><i>Cada</i></span>
            <span className="title-line"><i>segundo</i></span>
            <span className="title-line accent"><i>cuenta.</i></span>
          </h1>
          <p className="hero-intro">
            Soy Strike. Transformo material bruto en videos claros, ágiles y difíciles de abandonar para creadores de YouTube y redes.
          </p>
          <div className="hero-actions">
            <a className="button magnetic" href="#trabajos">Ver selección <ArrowDown size={16} /></a>
            <a className="button secondary" href="#precios">Calcular proyecto</a>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-media">
            <video src="/media/poke-elle-edit.mp4" autoPlay muted loop playsInline preload="metadata" />
            <span className="media-label"><Play size={11} fill="currentColor" /> Selected work / 2026</span>
            <span className="media-time">Poke Elle</span>
            <i className="scrub-line" aria-hidden="true" />
          </div>
          <div className="identity-card">
            <img src="/media/strike-avatar.png" alt="Avatar de Strike" />
            <div><small>Editor / Motion</small><strong>STRIKE</strong></div>
            <span>PE · REMOTO</span>
          </div>
          <div className="orbit-object" aria-hidden="true">
            <span className="orbit-ring ring-a" /><span className="orbit-ring ring-b" />
            <i /><b />
          </div>
          <span className="stage-index">STK—01</span>
        </div>
      </header>

      <div className="client-strip" aria-label="Clientes y colaboraciones">
        <div className="client-track">
          {[...Array(2)].flatMap((_, group) =>
            ["Rabanito", "Sara Guzo", "Maog", "Megazote", "Poke Elle", "Xomacito"].map((name) => (
              <span key={`${group}-${name}`}>{name}</span>
            )),
          )}
        </div>
      </div>

      <section className="section" id="trabajos">
        <div className="section-head reveal">
          <div><p className="kicker">01 / Trabajo seleccionado</p><h2>Primero,<br />el resultado.</h2></div>
          <p className="section-lead">
            Una selección compacta para evaluar ritmo, narrativa y acabado sin buscar demasiado.
          </p>
        </div>

        <div className="featured-grid reveal">
          <article className="project project-tall">
            <video src="/media/strike-short-rabanito.mp4" autoPlay muted loop playsInline preload="metadata" />
            <div className="project-info">
              <div className="project-person"><img src="/media/rabanito-avatar.jpg" alt="" /><div><h3>Rabanito</h3><p>Short-form · timing · diseño sonoro</p></div></div>
              <a className="arrow-link" href="https://www.instagram.com/reel/DYx3NZXx2_y/" target="_blank" rel="noreferrer" aria-label="Ver trabajo de Rabanito"><ArrowUpRight /></a>
            </div>
          </article>
          <article className="project project-wide">
            <video src="/media/strike-long-edit.mp4" autoPlay muted loop playsInline preload="metadata" />
            <div className="project-info">
              <div className="project-person"><img src="/media/sara-guzo-avatar.jpg" alt="" /><div><h3>Sara Guzo</h3><p>Long-form · narrativa · retención</p></div></div>
              <a className="arrow-link" href="https://www.youtube.com/watch?v=cQZ17KRDWQ0&t=82s" target="_blank" rel="noreferrer" aria-label="Ver trabajo de Sara Guzo"><ArrowUpRight /></a>
            </div>
          </article>
          <article className="project project-poke">
            <video src="/media/poke-elle-edit.mp4" autoPlay muted loop playsInline preload="metadata" />
            <div className="project-info">
              <div className="project-person"><img src="/media/poke-elle-avatar.jpg" alt="" /><div><h3>Poke Elle</h3><p>Vertical · motion · energía visual</p></div></div>
              <a className="arrow-link" href="https://www.youtube.com/watch?v=AtEpxkVEJYA" target="_blank" rel="noreferrer" aria-label="Ver trabajo de Poke Elle"><ArrowUpRight /></a>
            </div>
          </article>
        </div>

        <div className="project-list reveal">
          {[
            ["01", "Maog", "Gaming / Storytelling", "/media/maog-avatar.jpg", "https://youtu.be/aZ5Z5jDBg2U"],
            ["02", "Megazote", "Short-form / YouTube", "/media/megazote-avatar.jpg", "https://www.youtube.com/shorts/ZF2gdtDNE4w"],
          ].map(([index, name, type, avatar, url]) => (
            <a className="project-row" href={url} target="_blank" rel="noreferrer" key={name}>
              <span>{index}</span><img src={avatar} alt="" /><b>{name}</b><small>{type}</small><ArrowUpRight size={18} />
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="proceso">
        <div className="section-head reveal">
          <div><p className="kicker">02 / Cómo trabajo</p><h2>Simple y<br />visible.</h2></div>
          <p className="section-lead">
            Menos fricción, más claridad. Siempre sabes qué estoy haciendo, qué necesito de ti y cuándo recibirás el corte.
          </p>
        </div>
        <div className="process reveal">
          {[
            ["01", "Brief", "Objetivo, audiencia, referencias y tono en una conversación breve."],
            ["02", "Estructura", "Selecciono los momentos fuertes y ordeno la historia."],
            ["03", "Edición", "Cortes, sonido, subtítulos y motion donde sí aportan."],
            ["04", "Entrega", "Una ronda de ajustes y exportación lista para publicar."],
          ].map(([index, title, note]) => (
            <article className="step" key={index}><span>{index}</span><h3>{title}</h3><p>{note}</p><i aria-hidden="true" /></article>
          ))}
        </div>
      </section>

      <section className="section" id="precios">
        <div className="section-head reveal">
          <div><p className="kicker">03 / Estimador</p><h2>Precio claro.<br />Control tuyo.</h2></div>
          <p className="section-lead">
            Selecciona formato, nivel y duración. La referencia cambia al instante y parte de tarifas mínimas profesionales actualizadas.
          </p>
        </div>

        <div className="format-switch reveal" role="group" aria-label="Formato del video">
          <button className={format === "vertical" ? "active" : ""} onClick={() => selectFormat("vertical")}>
            <span>9:16</span><b>Vertical</b><small>Precio por pieza</small>
          </button>
          <button className={format === "horizontal" ? "active" : ""} onClick={() => selectFormat("horizontal")}>
            <span>16:9</span><b>Horizontal</b><small>Precio por duración</small>
          </button>
        </div>

        <div className="tier-grid reveal">
          {(Object.keys(tiers) as Tier[]).map((key) => {
            const item = tiers[key];
            return (
              <button className={`tier-card ${tier === key ? "active" : ""}`} onClick={() => setTier(key)} key={key}>
                <span className="tier-radio">{tier === key && <Check size={13} />}</span>
                <small>{item.caption}</small>
                <strong>{item.label}</strong>
                <b>{format === "vertical" ? `$${item.vertical}` : `$${item.horizontal}`} <i>{format === "vertical" ? "/ pieza" : "/ 10 min"}</i></b>
                <ul>{item.items.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </button>
            );
          })}
        </div>

        <div className="calculator reveal">
          <div className="calc-main">
            <div className="calc-icon">{format === "vertical" ? <Layers3 /> : <Clock3 />}</div>
            <div className="calc-label">
              <span>{format === "vertical" ? "Cantidad de piezas" : "Duración final"}</span>
              <strong>{amount} {format === "vertical" ? (amount === 1 ? "video" : "videos") : "minutos"}</strong>
            </div>
            <input
              aria-label={format === "vertical" ? "Cantidad de videos" : "Duración estimada"}
              type="range"
              min={format === "vertical" ? 1 : 5}
              max={format === "vertical" ? 10 : 30}
              step={1}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
            <div className="range-scale"><span>{format === "vertical" ? "1 pieza" : "5 min"}</span><span>{format === "vertical" ? "10 piezas" : "30 min"}</span></div>
            <label className="priority-check">
              <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
              <Zap size={16} /><span><b>Entrega prioritaria</b><small>Reserva de agenda y respuesta acelerada</small></span><strong>+30%</strong>
            </label>
          </div>
          <div className="price-panel">
            <span className="price-eyebrow">Estimado desde</span>
            <strong className="price-number"><i>$</i>{price}</strong>
            <span className="price-currency">USD</span>
            <div className="included">
              <span><Check size={14} /> Una ronda de ajustes</span>
              <span><Check size={14} /> Exportación final</span>
            </div>
            <a className="button" href="#contacto">Consultar disponibilidad <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <p className="source-note reveal">
          Referencia: encuesta BuscoEditor 2025 · 140 editores · tarifas ajustadas +US$5 sobre el mínimo. El estado del material y requerimientos fuera de alcance pueden modificar la cotización final.
        </p>
      </section>

      <section className="section reveal">
        <div className="split-feature">
          <div>
            <p className="kicker light">04 / También construyo productos</p>
            <h2>Xomacito 3.0</h2>
            <p>
              Mi aplicación para Windows descarga, convierte y prepara contenido multimedia. Integra FFmpeg, procesamiento inteligente y una colección de 144 gatos: utilidad seria con personalidad propia.
            </p>
            <a className="button light-button" href="https://github.com/Strike2911/Xomacito" target="_blank" rel="noreferrer"><Code2 size={17} /> Ver proyecto en GitHub <ArrowUpRight size={15} /></a>
          </div>
          <div className="xoma-visual" aria-hidden="true">
            <div className="wire-cube"><i /><i /><i /><i /><i /><i /></div>
            <strong>XO</strong><span>WINDOWS / OPEN SOURCE / V3.0</span>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="collab-title">
        <div className="section-head reveal">
          <div><p className="kicker">05 / Colaboraciones</p><h2 id="collab-title">Distintos canales.<br />Un criterio.</h2></div>
          <p className="section-lead">
            Un vistazo al enfoque aplicado en cada colaboración: cada canal conserva su voz, mientras la edición sostiene ritmo, claridad e intención.
          </p>
        </div>
        <div className="collab-window reveal">
          <div className="collab-track" style={{ transform: `translateX(-${slide * 34}%)` }}>
            {collaborators.map((item, index) => (
              <article className="collab-card" key={item.name}>
                <div className="collab-top"><span>COLAB / 0{index + 1}</span><Sparkles size={15} /></div>
                <p>“{item.note}”</p>
                <div className="collab-person"><img src={item.avatar} alt="" /><div><b>{item.name}</b><small>{item.type}</small></div></div>
              </article>
            ))}
          </div>
          <div className="carousel-controls">
            <button onClick={() => setSlide((slide - 1 + collaborators.length) % collaborators.length)} aria-label="Anterior">←</button>
            <span>0{slide + 1} / 0{collaborators.length}</span>
            <button onClick={() => setSlide((slide + 1) % collaborators.length)} aria-label="Siguiente">→</button>
          </div>
        </div>
      </section>

      <section className="contact reveal" id="contacto">
        <div className="contact-grid" aria-hidden="true" />
        <p className="kicker light">Contacto directo · Lima / remoto</p>
        <h2>¿Tienes material? <em>Hagámoslo contar.</em></h2>
        <p>Envíame la duración, una referencia y tu fecha ideal. Te respondo con alcance, tiempo y precio.</p>
        <div className="contact-actions">
          <button className="button" onClick={copyDiscord}>
            {copied ? <Check size={18} /> : <MessageCircle size={18} />}
            {copied ? "Usuario copiado" : "Discord · just_stream"}
            {copied ? null : <Copy size={14} />}
          </button>
          <a className="button secondary" href="https://www.youtube.com/@ElStrikew" target="_blank" rel="noreferrer"><Video size={19} /> YouTube <ArrowUpRight size={15} /></a>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Strike — Video editor</span>
        <span>Ritmo, claridad y motion con intención.</span>
      </footer>
    </main>
  );
}
