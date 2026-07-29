"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const collaborations = [
  { name: "Rabanito", type: "Short-form", note: "Ritmo alto, remates visuales y una edición diseñada para detener el scroll." },
  { name: "Sara Guzo", type: "Video largo", note: "Narrativa sostenida, recursos gráficos y cortes que mantienen la atención." },
  { name: "Maog", type: "Gaming", note: "Timing de comedia, energía y énfasis visual al servicio de la historia." },
  { name: "Megazote", type: "Short-form", note: "Un formato compacto con impacto rápido, claridad y personalidad." },
  { name: "Poke Elle", type: "Entretenimiento", note: "Edición dinámica que convierte cada momento fuerte en una razón para seguir." },
];

export default function Portfolio() {
  const shell = useRef<HTMLElement>(null);
  const [service, setService] = useState<"short" | "long">("short");
  const [duration, setDuration] = useState(45);
  const [subtitles, setSubtitles] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const price = useMemo(() => {
    const base = service === "short" ? 25 : Math.max(80, duration * 8);
    const extras = subtitles ? (service === "short" ? 5 : 20) : 0;
    return Math.round((base + extras) * (urgent ? 1.3 : 1));
  }, [service, duration, subtitles, urgent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: .1 },
    );
    const nodes = document.querySelectorAll(".reveal");
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % collaborations.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  const selectService = (next: "short" | "long") => {
    setService(next);
    setDuration(next === "short" ? 45 : 15);
  };

  const copyDiscord = async () => {
    await navigator.clipboard.writeText("just_stream");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const updatePointer = (event: React.PointerEvent<HTMLElement>) => {
    const target = shell.current;
    if (!target) return;
    target.style.setProperty("--mx", `${event.clientX}px`);
    target.style.setProperty("--my", `${event.clientY}px`);
  };

  return (
    <main ref={shell} className="site-shell" onPointerMove={updatePointer}>
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
          <p className="kicker">Video editor · Motion · Storytelling</p>
          <h1>Cada segundo <em>cuenta.</em></h1>
          <p className="hero-intro">
            Soy Strike. Transformo material bruto en videos claros, ágiles y difíciles de abandonar para creadores de YouTube y redes.
          </p>
          <div className="hero-actions">
            <a className="button" href="#trabajos">Ver selección ↓</a>
            <a className="button secondary" href="#precios">Calcular proyecto</a>
          </div>
        </div>
        <div className="hero-media">
          <video src="/media/strike-long-edit.mp4" autoPlay muted loop playsInline preload="metadata" />
          <span className="media-label">Selected work / 2026</span>
          <span className="media-time">Play 00:15</span>
          <i className="scrub-line" aria-hidden="true" />
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
          <div><p className="kicker">01 / Trabajo seleccionado</p><h2>Primero, el resultado.</h2></div>
          <p className="section-lead">
            Una selección corta para que puedas evaluar ritmo, narrativa y acabado sin buscar demasiado.
          </p>
        </div>

        <div className="featured-grid reveal">
          <article className="project">
            <video src="/media/strike-short-rabanito.mp4" autoPlay muted loop playsInline preload="metadata" />
            <div className="project-info">
              <div><h3>Rabanito</h3><p>Short-form · timing · subtítulos · recursos visuales</p></div>
              <a className="arrow-link" href="https://www.instagram.com/reel/DYx3NZXx2_y/" target="_blank" rel="noreferrer" aria-label="Ver trabajo de Rabanito">↗</a>
            </div>
          </article>
          <article className="project">
            <video src="/media/strike-long-edit.mp4" autoPlay muted loop playsInline preload="metadata" />
            <div className="project-info">
              <div><h3>Poke Elle</h3><p>Long-form · narrativa · motion · retención</p></div>
              <a className="arrow-link" href="https://www.youtube.com/watch?v=AtEpxkVEJYA" target="_blank" rel="noreferrer" aria-label="Ver trabajo de Poke Elle">↗</a>
            </div>
          </article>
        </div>

        <div className="project-list reveal">
          {[
            ["01", "Sara Guzo", "Video largo / YouTube", "https://www.youtube.com/watch?v=cQZ17KRDWQ0&t=82s"],
            ["02", "Maog", "Gaming / Storytelling", "https://youtu.be/aZ5Z5jDBg2U"],
            ["03", "Megazote", "Short-form / YouTube", "https://www.youtube.com/shorts/ZF2gdtDNE4w"],
          ].map(([index, name, type, url]) => (
            <a className="project-row" href={url} target="_blank" rel="noreferrer" key={name}>
              <span>{index}</span><b>{name}</b><small>{type}</small><i>↗</i>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="proceso">
        <div className="section-head reveal">
          <div><p className="kicker">02 / Cómo trabajo</p><h2>Simple y visible.</h2></div>
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
            <article className="step" key={index}><span>{index}</span><h3>{title}</h3><p>{note}</p></article>
          ))}
        </div>
      </section>

      <section className="section" id="precios">
        <div className="section-head reveal">
          <div><p className="kicker">03 / Estimador</p><h2>Sin esconder el precio.</h2></div>
          <p className="section-lead">
            Ajusta formato y duración para tener una referencia inmediata. El presupuesto final se confirma después de revisar el material.
          </p>
        </div>
        <div className="pricing reveal">
          <div className="service-tabs">
            <button className={`service-tab ${service === "short" ? "active" : ""}`} onClick={() => selectService("short")}>
              <span><b>Short intermedio</b><small>Rabanito / Megazote</small></span><strong>desde $25</strong>
            </button>
            <button className={`service-tab ${service === "long" ? "active" : ""}`} onClick={() => selectService("long")}>
              <span><b>Video largo</b><small>Sara Guzo / Maog</small></span><strong>$120 / 15 min</strong>
            </button>
          </div>
          <div className="calculator">
            <div className="calc-label"><span>Duración final</span><strong>{service === "short" ? `${duration} segundos` : `${duration} minutos`}</strong></div>
            <input
              aria-label="Duración estimada del video"
              type="range"
              min={service === "short" ? 15 : 5}
              max={service === "short" ? 60 : 30}
              step={service === "short" ? 5 : 1}
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
            <div className="addons">
              <label className="check"><input type="checkbox" checked={subtitles} onChange={(e) => setSubtitles(e.target.checked)} />Subtítulos dinámicos</label>
              <label className="check"><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />Entrega prioritaria (+30%)</label>
            </div>
            <div className="price-output">
              <div><small>Estimado</small><strong>${price} USD</strong></div>
              <a className="button" href="#contacto">Consultar fecha ↗</a>
            </div>
            <p className="price-note">Incluye una ronda de ajustes. La complejidad de motion, el estado del material y el plazo pueden modificar el valor final.</p>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="split-feature">
          <div>
            <p className="kicker" style={{color:"white"}}>04 / También construyo productos</p>
            <h2>Xomacito 3.0</h2>
            <p>
              Mi aplicación para Windows descarga, convierte y prepara contenido multimedia. Integra FFmpeg, procesamiento inteligente y una colección de 144 gatos: utilidad seria con personalidad propia.
            </p>
            <a className="button" href="https://github.com/Strike2911/Xomacito" target="_blank" rel="noreferrer">Ver proyecto en GitHub ↗</a>
          </div>
          <div className="xoma-visual" aria-hidden="true"><strong>XO</strong><span>WINDOWS / OPEN SOURCE / V3.0</span></div>
        </div>
      </section>

      <section className="section" aria-labelledby="collab-title">
        <div className="section-head reveal">
          <div><p className="kicker">05 / Colaboraciones</p><h2 id="collab-title">Distintos canales. Un criterio.</h2></div>
          <p className="section-lead">
            Descripciones del enfoque aplicado en cada colaboración. Cuando tengas testimonios aprobados, este espacio puede mostrarlos con nombre y fecha.
          </p>
        </div>
        <div className="collab-window reveal">
          <div className="collab-track" style={{ transform: `translateX(-${slide * 34}%)` }}>
            {collaborations.map((item, index) => (
              <article className="collab-card" key={item.name}>
                <span>COLAB / 0{index + 1}</span><p>{item.note}</p><div><b>{item.name}</b><small>{item.type}</small></div>
              </article>
            ))}
          </div>
          <div className="carousel-controls">
            <button onClick={() => setSlide((slide - 1 + collaborations.length) % collaborations.length)} aria-label="Anterior">←</button>
            <button onClick={() => setSlide((slide + 1) % collaborations.length)} aria-label="Siguiente">→</button>
          </div>
        </div>
      </section>

      <section className="contact reveal" id="contacto">
        <p className="kicker" style={{color:"#8da7ff"}}>Contacto directo · Lima / remoto</p>
        <h2>¿Tienes material? <em>Hagámoslo contar.</em></h2>
        <p>Envíame la duración, una referencia y tu fecha ideal. Te respondo con alcance, tiempo y precio.</p>
        <div className="contact-actions">
          <button className="button" onClick={copyDiscord}>{copied ? "Copiado ✓" : "Discord · just_stream"}</button>
          <a className="button secondary" href="https://www.behance.net/gallery/214597865/Videos-LargosCortos" target="_blank" rel="noreferrer">Behance ↗</a>
          <a className="button secondary" href="https://www.youtube.com/@ElStrikew" target="_blank" rel="noreferrer">YouTube ↗</a>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Strike — Video editor</span>
        <span>Diseñado para poner el trabajo antes que el decorado.</span>
      </footer>
    </main>
  );
}
