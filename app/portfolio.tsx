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
  Zap,
} from "lucide-react";
import { FaDiscord, FaYoutube } from "react-icons/fa6";
import { SiDavinciresolve } from "react-icons/si";

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
    vertical: 60,
    horizontal: 125,
    items: ["Motion graphics", "Rotoscopia y color", "Recursos 3D"],
  },
} as const;

const collaborators = [
  { name: "Rabanito", type: "Short-form", avatar: "/media/rabanito-avatar.jpg", note: "Caos controlado: si el remate llega tarde, ya no da risa. Acá cada corte cae donde tiene que caer.", language: "ES" },
  { name: "Sara Guzo", type: "Long-form", avatar: "/media/sara-guzo-avatar.jpg", note: "Long-form editing that lets the story breathe—then knows exactly when to speed things up.", language: "EN" },
  { name: "Maog", type: "Gaming", avatar: "/media/maog-avatar.jpg", note: "El timing de comedia manda. Los efectos entran, hacen su trabajo y se van antes de estorbar.", language: "ES" },
  { name: "Megazote", type: "Short-form", avatar: "/media/megazote-avatar.jpg", note: "Directo al punto, pero nunca plano. Cada segundo tiene algo que empuja al siguiente.", language: "ES" },
  { name: "Poke Elle", type: "Entertainment", avatar: "/media/poke-elle-avatar.jpg", note: "Bright, quick, and playful. The edit keeps the energy up without getting in the way of her personality.", language: "EN" },
];

const tools = [
  { code: "Pr", name: "Premiere Pro", tone: "premiere" },
  { code: "Ae", name: "After Effects", tone: "after" },
  { code: "Ps", name: "Photoshop", tone: "photoshop" },
  { code: "Ai", name: "Illustrator", tone: "illustrator" },
  { code: "Cc", name: "CapCut", tone: "capcut" },
];

function Mascot({ src, className, caption }: { src: string; className: string; caption?: string }) {
  return (
    <div className={`mascot ${className}`} aria-hidden="true">
      <span className="mascot-orbit" />
      <img src={src} alt="" />
      {caption && <small>{caption}</small>}
    </div>
  );
}

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
    const nodes = document.querySelectorAll(".reveal, .mascot");
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % collaborators.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const target = shell.current;
      if (!target) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.style.setProperty("--scroll-progress", `${max > 0 ? (window.scrollY / max) * 100 : 0}%`);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
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
    target.style.setProperty("--shift-x", `${(event.clientX / window.innerWidth - 0.5) * 13}px`);
    target.style.setProperty("--shift-y", `${(event.clientY / window.innerHeight - 0.5) * 10}px`);
  };

  return (
    <main ref={shell} className="site-shell" onPointerMove={updatePointer}>
      <ParticleField pointer={pointer} />
      <div className="screen-vignette" aria-hidden="true" />
      <nav className="nav" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="Strike, inicio">
          <span className="brand-mark"><img src="/media/strike-explicando.webp" alt="" /></span><span>YO ESE</span><small>EDITOR</small>
        </a>
        <div className="nav-links">
          <a href="#trabajos">Trabajo</a>
          <a href="#proceso">Proceso</a>
          <a href="#precios">Precios</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="nav-side">
          <a href="https://www.youtube.com/@ElStrikew" target="_blank" rel="noreferrer" aria-label="YouTube de Strike"><FaYoutube /></a>
          <button onClick={copyDiscord} aria-label="Copiar usuario de Discord"><FaDiscord /></button>
          <div className="nav-status"><span>Disponible</span></div>
        </div>
      </nav>

      <header className="hero" id="inicio">
        <div className="hero-copyblock">
          <p className="kicker hero-kicker">Video editor · Motion · Storytelling</p>
          <h1 aria-label="Esto va a ser épico papus">
            <span className="title-line"><i>Esto va</i></span>
            <span className="title-line"><i>a ser</i></span>
            <span className="title-line accent"><i>épico papus.</i></span>
          </h1>
          <p className="hero-intro">
            Soy Strike, puedo retener tanto tu atención que no te diste cuenta que estás leyendo esto ahora mismo... ¿en serio alguien lee esto??
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
            <span className="identity-avatar"><img src="/media/strike-explicando.webp" alt="Personaje de Strike" /></span>
            <div><small>Editor / Motion</small><strong>STRIKE</strong><em>sí, ese soy yo</em></div>
            <i aria-hidden="true" />
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

      <div className="toolbelt" aria-label="Herramientas que usa Strike">
        <span className="toolbelt-label">MI ARSENAL, DIGO... MIS PROGRAMAS</span>
        <div className="toolbelt-items">
          {tools.map((tool, index) => (
            <div className="tool-chip" style={{ "--tool-index": index } as React.CSSProperties} key={tool.name} title={tool.name}>
              <b className={tool.tone}>{tool.code}</b><span>{tool.name}</span>
            </div>
          ))}
          <div className="tool-chip" title="DaVinci Resolve"><b className="resolve"><SiDavinciresolve /></b><span>DaVinci</span></div>
        </div>
      </div>

      <section className="section" id="trabajos">
        <div className="section-head reveal">
          <div><p className="kicker">01 / Trabajo seleccionado</p><h2>Checa mi<br /><em>edición.</em></h2></div>
          <p className="section-lead">
            Aquí coloqué una selección compacta en donde puedes evaluar mi ritmo de edición, además de algunos efectos que podrían gustarte.
          </p>
        </div>
        <Mascot src="/media/strike-senalando-feliz.webp" className="mascot-work mascot-parallax" caption="Mira nomás esa edición ↘" />

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
          <div><p className="kicker">02 / Cómo trabajo</p><h2>Soy el mejor!!<br /><em>por un precio razonable, claro jeje.</em></h2></div>
          <p className="section-lead">
            Me gusta planificar cada video y mantener una comunicación sólida con mis clientes. Menos confusión, mejores cortes y cero desapariciones misteriosas.
          </p>
        </div>
        <Mascot src="/media/strike-pensando.webp" className="mascot-process mascot-parallax" caption="Planificando cosas muy serias..." />
        <div className="process-ribbon reveal" aria-hidden="true">
          <span>BRIEF</span><i /><span>STORY</span><i /><span>RHYTHM</span><i /><span>DELIVERY</span>
        </div>
        <div className="process reveal">
          {[
            ["01", "Brief", "Me cuentas qué quieres provocar. Yo hago las preguntas incómodamente útiles.", "HABLAMOS", <MessageCircle key="brief-icon" />],
            ["02", "Estructura", "Encuentro los momentos que sí importan. El resto no sobrevive al corte.", "ORDENAMOS", <Layers3 key="structure-icon" />],
            ["03", "Edición", "Ritmo, sonido y motion. Nada entra solo porque el plugin se veía bonito.", "HACEMOS MAGIA", <Sparkles key="edit-icon" />],
            ["04", "Entrega", "Ajustamos, exportamos y publicas. Fácil. Sospechosamente fácil.", "LISTO", <Check key="delivery-icon" />],
          ].map(([index, title, note, tag, icon]) => (
            <article className="step" key={String(index)}>
              <div className="step-top"><span>{index}</span><b>{tag}</b></div>
              <div className="step-icon">{icon}</div>
              <h3>{title}</h3><p>{note}</p><i aria-hidden="true" />
            </article>
          ))}
        </div>
        <p className="process-aside reveal">* “¿Puedes hacerlo más dinámico?” Sí... pero ¿podrás pagarlo? :0 ???</p>
      </section>

      <section className="section" id="precios">
        <div className="section-head reveal">
          <div><p className="kicker">03 / Estimador</p><h2>Aquí viene lo que más duele:<br /><em>el precio jeje.</em></h2></div>
          <p className="section-lead">
            Selecciona formato, nivel y duración. La referencia cambia al instante y parte de tarifas mínimas profesionales actualizadas.
          </p>
        </div>
        <Mascot src="/media/strike-asustado.webp" className="mascot-price mascot-parallax" caption="Respira... son dólares." />

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
          Referencia: encuesta BuscoEditor 2025 · 140 editores · tarifas base ajustadas. La edición compleja vertical se establece en US$60. El estado del material y requerimientos fuera de alcance pueden modificar la cotización final (tu presupuesto tampoco debería tener jumpscares).
        </p>
        <div className="cat-card cat-price reveal">
          <img src="/media/cat-computer.webp" alt="Gatito usando una computadora" />
          <span><b>ASISTENTE FINANCIERO</b><small>No sabe matemáticas, pero juzga tu presupuesto.</small></span>
        </div>
      </section>

      <section className="section reveal">
        <div className="split-feature">
          <div>
            <p className="kicker light">04 / También construyo productos</p>
            <h2>Xomacito 3.0</h2>
            <p>
              Un descargador de video para Windows que pega, analiza y descarga desde YouTube, Vimeo, TikTok e Instagram. También convierte con FFmpeg, organiza colas y, por motivos completamente profesionales, incluye 144 gatos.
            </p>
            <div className="xoma-tags"><span>DESCARGA</span><span>CONVIERTE</span><span>NO MUERDE</span></div>
            <a className="button light-button" href="https://github.com/Strike2911/Xomacito" target="_blank" rel="noreferrer"><Code2 size={17} /> Ver proyecto en GitHub <ArrowUpRight size={15} /></a>
          </div>
          <div className="xoma-window">
            <div className="xoma-titlebar"><span><i /> XOMACITO / MOTOR 3.0</span><b>— □ ×</b></div>
            <div className="xoma-screen">
              <img src="/media/xomacito-interface.png" alt="Interfaz de Xomacito 3.0, descargador de video para Windows" />
              <i className="xoma-scan" aria-hidden="true" />
            </div>
            <div className="xoma-status"><span>● SISTEMA LISTO</span><b>YT · TT · IG · VIMEO</b></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="collab-title">
        <div className="section-head reveal">
          <div><p className="kicker">05 / Colaboraciones</p><h2 id="collab-title">Referencias de clientes<br /><em>con los que trabajé.</em></h2></div>
          <p className="section-lead">
            Entregué tan buenos resultados que sigo trabajando con ellos. Sí, debido a lo bueno que soy. La humildad se exportó en baja resolución.
          </p>
        </div>
        <div className="collab-window reveal">
          <div className="collab-track" style={{ transform: `translateX(-${slide * 34}%)` }}>
            {collaborators.map((item, index) => (
              <article className="collab-card" key={item.name}>
                <div className="collab-top"><span>NOTA DE EDICIÓN / 0{index + 1}</span><b>{item.language}</b></div>
                <p>{item.note}</p>
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
        <h2>¿Quieres trabajar conmigo? <em>Contáctame en mis redes.</em></h2>
        <p>Envíame la duración, una referencia y tu fecha ideal. Prometo responder antes de que termines de ver “solo un reel más”.</p>
        <Mascot src="/media/strike-explicando.webp" className="mascot-contact" caption="Es por aquí, papu ↙" />
        <div className="contact-actions">
          <button className="button" onClick={copyDiscord}>
            {copied ? <Check size={18} /> : <FaDiscord size={18} />}
            {copied ? "Usuario copiado" : "Discord · just_stream"}
            {copied ? null : <Copy size={14} />}
          </button>
          <a className="button secondary" href="https://www.youtube.com/@ElStrikew" target="_blank" rel="noreferrer"><FaYoutube size={19} /> YouTube <ArrowUpRight size={15} /></a>
        </div>
        <div className="cat-window" aria-hidden="true"><img src="/media/cat-window.webp" alt="" /><span>strike_assistant.exe</span></div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Strike — Video editor</span>
        <span>Ritmo, claridad y motion con intención.</span>
      </footer>
    </main>
  );
}
