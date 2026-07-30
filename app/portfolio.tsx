"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Check,
  Clapperboard,
  Clock3,
  Code2,
  Gauge,
  Layers3,
  MessageCircle,
  Play,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { FaDiscord, FaYoutube } from "react-icons/fa6";

type Format = "vertical" | "horizontal";
type Tier = "basic" | "intermediate" | "complex";
type Language = "es" | "en";

const media = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const tiers = {
  basic: {
    es: { label: "Básica", caption: "Edición limpia", items: ["Recortes precisos", "Zooms funcionales", "Subtítulos"] },
    en: { label: "Basic", caption: "Clean editing", items: ["Precise cuts", "Functional zooms", "Subtitles"] },
    vertical: 17,
    horizontal: 52,
  },
  intermediate: {
    es: { label: "Intermedia", caption: "Ritmo y retención", items: ["Todo lo anterior", "Efectos visuales", "Diseño sonoro"] },
    en: { label: "Intermediate", caption: "Rhythm and retention", items: ["Everything above", "Visual effects", "Sound design"] },
    vertical: 25,
    horizontal: 75,
  },
  complex: {
    es: { label: "Compleja", caption: "Acabado premium", items: ["Gráficos animados", "Rotoscopia y color", "Recursos 3D"] },
    en: { label: "Complex", caption: "Premium finish", items: ["Motion graphics", "Rotoscoping and color", "3D assets"] },
    vertical: 60,
    horizontal: 125,
  },
} as const;

const collaborators = [
  {
    name: "Rabanito",
    avatar: "/media/rabanito-avatar.jpg",
    es: { type: "Formato corto", note: "Es un editor increíble. Tiene muchísima creatividad, súper puntual y muy abierto al feedback. Trabajar con él es un gusto y va a llevar tu contenido a otro nivel." },
    en: { type: "Short-form", note: "He is an incredible editor: highly creative, always on time, and very open to feedback. Working with him is a pleasure, and he will take your content to the next level." },
  },
  {
    name: "Sara Guzo",
    avatar: "/media/sara-guzo-avatar.jpg",
    es: { type: "Formato largo", note: "Strike toma en serio cada comentario y mantiene el ritmo limpio. Puedo enviarle el material y confiar en el corte final." },
    en: { type: "Long-form", note: "Strike takes feedback seriously and keeps the pacing clean. I can send him the footage and trust the final cut." },
  },
  {
    name: "Maog",
    avatar: "/media/maog-avatar.jpg",
    es: { type: "Gaming", note: "Le paso la idea, le explico el chiste y él encuentra cómo hacerlo funcionar sin llenar todo de efectos." },
    en: { type: "Gaming", note: "I send him the idea, explain the joke, and he finds a way to make it work without covering everything in effects." },
  },
  {
    name: "Megazote",
    avatar: "/media/megazote-avatar.jpg",
    es: { type: "Formato corto", note: "Con Strike no tengo que explicar veinte veces el ritmo. Entiende el formato y entrega algo que sí se siente parte del canal." },
    en: { type: "Short-form", note: "With Strike, I don't have to explain the pacing twenty times. He understands the format and delivers something that feels like the channel." },
  },
  {
    name: "Poke Elle",
    avatar: "/media/poke-elle-avatar.jpg",
    es: { type: "Entretenimiento", note: "Strike entiende la energía que busco y hace que la edición sea divertida sin volverla abrumadora." },
    en: { type: "Entertainment", note: "Strike understands the energy I want and makes the edits feel fun without making them overwhelming." },
  },
  {
    name: "Rykozio",
    avatar: "/media/rykozio-avatar.png",
    es: { type: "Contenido digital", note: "Strike respeta la esencia del canal y eleva el nivel de cada proyecto. Trabajar con él te ahorra tiempo y asegura un resultado impecable." },
    en: { type: "Digital content", note: "Strike respects the essence of the channel and raises the level of every project. Working with him saves you time and ensures a polished result." },
  },
  {
    name: "Nini",
    avatar: "/media/nini-avatar.png",
    es: { type: "Contenido digital", note: "Strike es una persona súper responsable y abierta a cambios, uno de los mejores editores con los que he trabajado. Su trabajo queda súper limpio, bonito y profesional. Está increíble." },
    en: { type: "Digital content", note: "Strike is super responsible and always open to changes—one of the best editors I’ve worked with. His work comes out clean, polished, and professional. It’s incredible." },
  },
] as const;

const tools = [
  { code: "Pr", name: "Premiere Pro", tone: "premiere" },
  { code: "Ae", name: "After Effects", tone: "after" },
  { code: "Ps", name: "Photoshop", tone: "photoshop" },
  { code: "Ai", name: "Illustrator", tone: "illustrator" },
  { code: "Cc", name: "CapCut", tone: "capcut" },
];

const pageCopy = {
  es: {
    nav: { work: "Trabajo", process: "Proceso", pricing: "Precios", contact: "Contacto", available: "Disponible", label: "Navegación principal" },
    hero: {
      kicker: "Editor de video · Motion · Narrativa",
      title: ["Esto va", "a ser", "épico papus."],
      aria: "Esto va a ser épico papus",
      intro: "Soy Strike, puedo retener tanto tu atención que no te diste cuenta que estás leyendo esto ahora mismo... ¿en serio alguien lee esto??",
      work: "Ver selección",
      price: "Calcular proyecto",
      selected: "Trabajo seleccionado / 2026",
      role: "Editor / Motion",
      note: "sí, ese soy yo",
    },
    arsenal: "PROGRAMAS QUE DOMINO",
    signals: [
      ["Narrativa", "Cada corte empuja la historia."],
      ["Ritmo", "Pausa cuando toca. Acelera cuando conviene."],
      ["Motion", "Solo cuando aporta de verdad."],
      ["Sonido", "La mitad del impacto entra por los oídos."],
    ],
    work: {
      kicker: "01 / Trabajo seleccionado",
      title: ["Checa mi", "edición."],
      lead: "Aquí coloqué una selección compacta en donde puedes evaluar mi ritmo de edición, además de algunos efectos que podrían gustarte.",
      rabanito: "Formato corto · timing · diseño sonoro",
      sara: "Formato largo · narrativa · retención",
      poke: "Vertical · motion · energía visual",
      maog: "Gaming / Narrativa",
      megazote: "Formato corto / YouTube",
      rykozio: "League of Legends · ritmo vertical",
      nini: "Gaming · teoría y narrativa",
      view: "Ver trabajo de",
    },
    process: {
      kicker: "02 / Cómo trabajo",
      title: ["Soy el mejor!!", "por un precio razonable, claro."],
      lead: "Me gusta planificar cada video y mantener una comunicación sólida con mis clientes. Menos confusión, mejores cortes y cero desapariciones misteriosas.",
      ribbon: ["BRIEF", "HISTORIA", "RITMO", "ENTREGA"],
      steps: [
        ["Brief", "Me cuentas qué quieres provocar. Yo hago las preguntas incómodamente útiles.", "HABLAMOS"],
        ["Estructura", "Encuentro los momentos que sí importan. El resto no sobrevive al corte.", "ORDENAMOS"],
        ["Edición", "Ritmo, sonido y motion. Nada entra solo porque el plugin se veía bonito.", "HACEMOS MAGIA"],
        ["Entrega", "Ajustamos, exportamos y publicas. Fácil. Sospechosamente fácil.", "LISTO"],
      ],
      aside: "* “¿Puedes hacerlo más dinámico?” Sí... pero ¿podrás pagarlo? :0 ???",
    },
    pricing: {
      kicker: "03 / Estimador",
      title: ["Aquí viene lo que más duele:", "el precio."],
      lead: "Selecciona formato, nivel y duración. La referencia cambia al instante y parte de tarifas mínimas profesionales actualizadas.",
      formatAria: "Formato del video",
      vertical: "Vertical",
      horizontal: "Horizontal",
      perPiece: "Precio por pieza",
      perDuration: "Precio por duración",
      piece: "pieza",
      pieces: "piezas",
      video: "video",
      videos: "videos",
      minutes: "minutos",
      quantity: "Cantidad de piezas",
      duration: "Duración final",
      quantityAria: "Cantidad de videos",
      durationAria: "Duración estimada",
      urgent: "Entrega prioritaria",
      urgentNote: "Reserva de agenda y respuesta acelerada",
      estimate: "Estimado desde",
      adjustment: "Una ronda de ajustes",
      export: "Exportación final",
      consult: "Consultar disponibilidad",
      source: "Referencia: encuesta BuscoEditor 2025 · 140 editores · tarifas base ajustadas. La edición compleja vertical se establece en US$60. El estado del material y los requerimientos fuera de alcance pueden modificar la cotización final.",
      assistant: "ASISTENTE FINANCIERO",
      assistantNote: "No sabe matemáticas, pero juzga tu presupuesto.",
    },
    xoma: {
      kicker: "04 / También construyo productos",
      description: "Un descargador de video para Windows que pega, analiza y descarga desde YouTube, Vimeo, TikTok e Instagram. También convierte con FFmpeg, organiza colas y, por motivos completamente profesionales, incluye 144 gatos.",
      tags: ["DESCARGA", "CONVIERTE", "NO MUERDE"],
      button: "Ver proyecto en GitHub",
      status: "● SISTEMA LISTO",
    },
    collab: {
      kicker: "05 / Colaboraciones",
      title: ["Referencias de clientes", "con los que trabajé."],
      lead: "Entregué tan buenos resultados que sigo trabajando con ellos. Sí, debido a lo bueno que soy. La humildad se exportó en baja resolución.",
      cardLabel: "NOTA DE EDICIÓN",
      previous: "Anterior",
      next: "Siguiente",
    },
    contact: {
      kicker: "Contacto directo · Lima / remoto",
      title: ["¿Quieres trabajar conmigo??", "Contáctame."],
      lead: "Envíame datos del proyecto que tengas en mente.",
      copied: "Usuario copiado",
      discord: "Discord · just_stream",
    },
    footer: ["Strike — Editor de video", "Ritmo, claridad y motion con intención."],
    languageLabel: "Cambiar idioma",
    discordCopy: "Copiar usuario de Discord",
    clients: "Clientes y colaboraciones",
    tools: "Herramientas que usa Strike",
  },
  en: {
    nav: { work: "Work", process: "Process", pricing: "Pricing", contact: "Contact", available: "Available", label: "Main navigation" },
    hero: {
      kicker: "Video editor · Motion · Storytelling",
      title: ["This is", "going to be", "epic, folks."],
      aria: "This is going to be epic",
      intro: "I'm Strike. I can hold your attention so well that you didn't notice you're still reading this... wait, does anyone actually read these??",
      work: "See selected work",
      price: "Estimate a project",
      selected: "Selected work / 2026",
      role: "Editor / Motion",
      note: "yes, that's me",
    },
    arsenal: "SOFTWARE I USE",
    signals: [
      ["Story", "Every cut moves the story forward."],
      ["Pacing", "Pause when needed. Move fast when it helps."],
      ["Motion", "Only when it adds something real."],
      ["Sound", "Half the impact enters through your ears."],
    ],
    work: {
      kicker: "01 / Selected work",
      title: ["Check out my", "editing."],
      lead: "Here is a compact selection where you can evaluate my editing rhythm and a few effects you might like.",
      rabanito: "Short-form · timing · sound design",
      sara: "Long-form · narrative · retention",
      poke: "Vertical · motion · visual energy",
      maog: "Gaming / Storytelling",
      megazote: "Short-form / YouTube",
      rykozio: "League of Legends · vertical pacing",
      nini: "Gaming · theory and storytelling",
      view: "View work for",
    },
    process: {
      kicker: "02 / How I work",
      title: ["I'm the best!!", "at a reasonable price, of course."],
      lead: "I like to plan every video and keep communication solid with my clients. Less confusion, better cuts, and no mysterious disappearances.",
      ribbon: ["BRIEF", "STORY", "RHYTHM", "DELIVERY"],
      steps: [
        ["Brief", "You tell me what you want people to feel. I ask the uncomfortably useful questions.", "WE TALK"],
        ["Structure", "I find the moments that matter. Everything else does not survive the cut.", "WE ORGANIZE"],
        ["Editing", "Rhythm, sound, and motion. Nothing gets in just because the plugin looked cool.", "WE MAKE MAGIC"],
        ["Delivery", "We adjust, export, and publish. Easy. Suspiciously easy.", "DONE"],
      ],
      aside: "* “Can you make it more dynamic?” Yes... but can you afford it? :0 ???",
    },
    pricing: {
      kicker: "03 / Estimator",
      title: ["Here comes the painful part:", "the price."],
      lead: "Choose a format, level, and duration. The estimate updates instantly and starts from current professional minimum rates.",
      formatAria: "Video format",
      vertical: "Vertical",
      horizontal: "Horizontal",
      perPiece: "Price per piece",
      perDuration: "Price by duration",
      piece: "piece",
      pieces: "pieces",
      video: "video",
      videos: "videos",
      minutes: "minutes",
      quantity: "Number of pieces",
      duration: "Final duration",
      quantityAria: "Number of videos",
      durationAria: "Estimated duration",
      urgent: "Priority delivery",
      urgentNote: "Reserved schedule and faster response",
      estimate: "Estimated from",
      adjustment: "One revision round",
      export: "Final export",
      consult: "Check availability",
      source: "Reference: BuscoEditor 2025 survey · 140 editors · adjusted base rates. Complex vertical editing starts at US$60. Material condition and out-of-scope requirements may change the final quote.",
      assistant: "FINANCIAL ASSISTANT",
      assistantNote: "Bad at math, excellent at judging your budget.",
    },
    xoma: {
      kicker: "04 / I also build products",
      description: "A Windows video downloader that pastes, analyzes, and downloads from YouTube, Vimeo, TikTok, and Instagram. It also converts with FFmpeg, manages queues, and—for entirely professional reasons—includes 144 cats.",
      tags: ["DOWNLOADS", "CONVERTS", "DOESN'T BITE"],
      button: "View project on GitHub",
      status: "● SYSTEM READY",
    },
    collab: {
      kicker: "05 / Collaborations",
      title: ["References from clients", "I've worked with."],
      lead: "The results were so good that I still work with them. Yes, because I'm that good. Humility was exported at low resolution.",
      cardLabel: "EDITING NOTE",
      previous: "Previous",
      next: "Next",
    },
    contact: {
      kicker: "Direct contact · Lima / remote",
      title: ["Want to work with me?", "Contact me."],
      lead: "Send me the details of the project you have in mind.",
      copied: "Username copied",
      discord: "Discord · just_stream",
    },
    footer: ["Strike — Video editor", "Rhythm, clarity, and motion with intention."],
    languageLabel: "Change language",
    discordCopy: "Copy Discord username",
    clients: "Clients and collaborations",
    tools: "Tools Strike uses",
  },
} as const;

function ParticleField({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 640px)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let tick = 0;
    let lastDraw = 0;
    let pageVisible = !document.hidden;
    const trail: Array<{ x: number; y: number; life: number }> = [];
    const particles = Array.from({ length: reduced ? 18 : compact ? 22 : 38 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00026,
      vy: (Math.random() - 0.5) * 0.00026,
      size: index % 11 === 0 ? 2.4 : Math.random() * 1.5 + 0.45,
      blue: index % 4 === 0,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time = 0) => {
      if (!pageVisible) return;
      if (!reduced && time - lastDraw < 32) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      tick += 1;
      ctx.clearRect(0, 0, width, height);
      const pointerActive = pointer.current.x >= 0 && pointer.current.x <= width;

      if (!reduced && pointerActive && tick % 2 === 0) {
        trail.push({ x: pointer.current.x, y: pointer.current.y, life: 1 });
        if (trail.length > 10) trail.shift();
      }

      trail.forEach((point, index) => {
        if (index > 0) {
          const previous = trail[index - 1];
          ctx.beginPath();
          ctx.strokeStyle = `rgba(36,87,255,${point.life * 0.18})`;
          ctx.lineWidth = Math.max(0.5, point.life * 1.8);
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(36,87,255,${point.life * 0.22})`;
        ctx.arc(point.x, point.y, 2 + point.life * 4, 0, Math.PI * 2);
        ctx.fill();
        point.life -= 0.045;
      });
      while (trail.length && trail[0].life <= 0) trail.shift();

      particles.forEach((particle, index) => {
        let px = particle.x * width;
        let py = particle.y * height;
        const dx = px - pointer.current.x;
        const dy = py - pointer.current.y;
        const distance = Math.hypot(dx, dy);
        if (!reduced && pointerActive && distance < 190 && distance > 0) {
          const force = (190 - distance) / 190;
          particle.x += (dx / distance) * force * 0.0021;
          particle.y += (dy / distance) * force * 0.0021;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(36,87,255,${force * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(px, py);
          ctx.lineTo(pointer.current.x, pointer.current.y);
          ctx.stroke();
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
        ctx.fillStyle = particle.blue ? "rgba(36,87,255,.55)" : "rgba(16,16,16,.2)";
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();

        for (let next = index + 1; next < Math.min(index + 4, particles.length); next += 1) {
          const other = particles[next];
          const ox = other.x * width;
          const oy = other.y * height;
          const gap = Math.hypot(px - ox, py - oy);
          if (gap < 115) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(36,87,255,${(1 - gap / 115) * 0.095})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(px, py);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        }
      });
      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && !reduced) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.cancelAnimationFrame(frame);
    };
  }, [pointer]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

function PortfolioVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = false;
    const syncPlayback = () => {
      if (inView && document.visibilityState === "visible") {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "160px 0px", threshold: 0.08 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return <video ref={videoRef} className={className} src={src} muted loop playsInline preload="metadata" />;
}

function ContextLedger({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="context-ledger" aria-label="Datos rápidos">
      {items.map(([value, label], index) => (
        <span key={`${value}-${label}`}><i>0{index + 1}</i><b>{value}</b><small>{label}</small></span>
      ))}
    </div>
  );
}

function AnimatedMetric({ label, target }: { label: string; target: number }) {
  const metric = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = metric.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    if (reduced) {
      frame = window.requestAnimationFrame(() => setValue(target));
      return () => window.cancelAnimationFrame(frame);
    }
    const start = performance.now();
    const duration = 1350;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, target]);

  return (
    <span ref={metric}>
      <b>{label}</b>
      <i><em style={{ width: active ? `${target}%` : "0%" }} /></i>
      <small>{value}%</small>
    </span>
  );
}

export default function Portfolio() {
  const shell = useRef<HTMLElement>(null);
  const pointer = useRef({ x: -500, y: -500 });
  const pointerFrame = useRef(0);
  const [language, setLanguage] = useState<Language>("es");
  const [format, setFormat] = useState<Format>("vertical");
  const [tier, setTier] = useState<Tier>("intermediate");
  const [amount, setAmount] = useState(1);
  const [urgent, setUrgent] = useState(false);
  const [slide, setSlide] = useState(0);
  const c = pageCopy[language];
  const lastDesktopSlide = Math.max(0, collaborators.length - 3);

  const price = useMemo(() => {
    const base = format === "vertical"
      ? tiers[tier].vertical * amount
      : Math.ceil((tiers[tier].horizontal / 10) * amount);
    return Math.round(base * (urgent ? 1.3 : 1));
  }, [amount, format, tier, urgent]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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

  useEffect(() => () => window.cancelAnimationFrame(pointerFrame.current), []);

  const selectFormat = (next: Format) => {
    setFormat(next);
    setAmount(next === "vertical" ? 1 : 10);
  };

  const updatePointer = (event: React.PointerEvent<HTMLElement>) => {
    const target = shell.current;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (!target) return;
    if (pointerFrame.current) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const { x, y } = pointer.current;
      target.style.setProperty("--mx", `${x}px`);
      target.style.setProperty("--my", `${y}px`);
      target.style.setProperty("--tilt-x", `${(x / window.innerWidth - 0.5) * 9}deg`);
      target.style.setProperty("--tilt-y", `${(y / window.innerHeight - 0.5) * -8}deg`);
      target.style.setProperty("--shift-x", `${(x / window.innerWidth - 0.5) * 13}px`);
      target.style.setProperty("--shift-y", `${(y / window.innerHeight - 0.5) * 10}px`);
      pointerFrame.current = 0;
    });
  };

  const stepIcons = [<MessageCircle key="brief" />, <Layers3 key="structure" />, <Sparkles key="edit" />, <Check key="delivery" />];

  return (
    <main ref={shell} className="site-shell" onPointerMove={updatePointer}>
      <ParticleField pointer={pointer} />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="screen-vignette" aria-hidden="true" />
      <nav className="nav" aria-label={c.nav.label}>
        <a className="brand brand-easter" href="#inicio" aria-label="Strike Editor, inicio">
          <span className="brand-mark">
            <img className="brand-image-default" src={media("/media/strike-avatar-new.webp")} alt="" />
            <img className="brand-image-egg" src={media("/media/ryan-gosling.webp")} alt="" />
          </span>
          <span className="brand-copy"><b>STRIKE EDITOR</b><i>RYAN GOSLING</i></span>
          <small>PORTFOLIO</small>
        </a>
        <div className="nav-links">
          <a href="#trabajos">{c.nav.work}</a>
          <a href="#proceso">{c.nav.process}</a>
          <a href="#precios">{c.nav.pricing}</a>
          <a href="#contacto">{c.nav.contact}</a>
        </div>
        <div className="nav-side">
          <div className="language-switch" role="group" aria-label={c.languageLabel}>
            <button className={language === "es" ? "active" : ""} onClick={() => setLanguage("es")} aria-pressed={language === "es"}><span aria-hidden="true">🇪🇸</span><b>ES</b></button>
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}><span aria-hidden="true">🇺🇸</span><b>EN</b></button>
          </div>
          <a href="https://www.youtube.com/@ElStrikew" target="_blank" rel="noreferrer" aria-label="YouTube de Strike"><FaYoutube /></a>
          <a href="https://discord.gg/KNh3ZtNkUu" target="_blank" rel="noreferrer" aria-label="Discord para clientes"><FaDiscord /></a>
          <div className="nav-status"><span>{c.nav.available}</span></div>
        </div>
      </nav>

      <header className="hero" id="inicio">
        <div className="hero-copyblock">
          <p className="kicker hero-kicker">{c.hero.kicker}</p>
          <h1 aria-label={c.hero.aria}>
            <span className="title-line"><i>{c.hero.title[0]}</i></span>
            <span className="title-line"><i>{c.hero.title[1]}</i></span>
            <span className="title-line accent"><i>{c.hero.title[2]}</i></span>
          </h1>
          <p className="hero-intro">{c.hero.intro}</p>
          <div className="hero-actions">
            <a className="button magnetic" href="#trabajos">{c.hero.work} <ArrowDown size={16} /></a>
            <a className="button secondary" href="#precios">{c.hero.price}</a>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-media">
            <PortfolioVideo src={media("/media/poke-elle-edit.mp4")} />
            <span className="media-label"><Play size={11} fill="currentColor" /> {c.hero.selected}</span>
            <span className="media-time">Poke Elle</span>
            <i className="scrub-line" aria-hidden="true" />
          </div>
          <div className="identity-card" data-status={c.nav.available.toUpperCase()}>
            <span className="identity-avatar"><img src={media("/media/strike-avatar-new.webp")} alt="Strike" /></span>
            <div><small>{c.hero.role}</small><strong>STRIKE</strong><em>{c.hero.note}</em></div>
            <i aria-hidden="true" />
          </div>
          <div className="orbit-object" aria-hidden="true">
            <span className="orbit-ring ring-a" /><span className="orbit-ring ring-b" />
            <i /><b />
          </div>
          <span className="stage-index">STK—01</span>
        </div>
      </header>

      <div className="client-strip" aria-label={c.clients}>
        <div className="client-track">
          {[...Array(2)].flatMap((_, group) =>
            ["Rabanito", "Sara Guzo", "Maog", "Megazote", "Poke Elle", "Rykozio", "Nini", "Xomacito"].map((name) => (
              <span key={`${group}-${name}`}>{name}</span>
            )),
          )}
        </div>
      </div>

      <div className="toolbelt" aria-label={c.tools}>
        <span className="toolbelt-label">{c.arsenal}</span>
        <div className="toolbelt-items">
          {tools.map((tool, index) => (
            <div className="tool-chip" style={{ "--tool-index": index } as React.CSSProperties} key={tool.name} title={tool.name}>
              <b className={tool.tone}>{tool.code}</b><span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="signal-rack" aria-label={language === "es" ? "Criterios de edición" : "Editing principles"}>
        {c.signals.map(([title, note], index) => {
          const icons = [<Clapperboard key="story" />, <Gauge key="pace" />, <WandSparkles key="motion" />, <AudioLines key="sound" />];
          return <article key={title}><span>{icons[index]}</span><div><b>{title}</b><small>{note}</small></div><i>0{index + 1}</i></article>;
        })}
      </div>

      <section className="section" id="trabajos" data-index="01" data-label={language === "es" ? "SELECCIÓN" : "SELECTION"}>
        <div className="section-head reveal">
          <div><p className="kicker">{c.work.kicker}</p><h2>{c.work.title[0]}<br /><em>{c.work.title[1]}</em></h2></div>
          <div className="section-context">
            <p className="section-lead">{c.work.lead}</p>
            <ContextLedger items={language === "es"
              ? [["07", "CLIENTES"], ["02", "FORMATOS"], ["ES/EN", "IDIOMAS"]]
              : [["07", "CLIENTS"], ["02", "FORMATS"], ["ES/EN", "LANGUAGES"]]} />
          </div>
        </div>

        <div className="featured-grid reveal">
          <article className="project project-tall">
            <PortfolioVideo src={media("/media/strike-short-rabanito.mp4")} />
            <div className="project-info">
              <div className="project-person"><img src={media("/media/rabanito-avatar.jpg")} alt="" /><div><h3>Rabanito</h3><p>{c.work.rabanito}</p></div></div>
              <a className="arrow-link" href="https://www.instagram.com/reel/DYx3NZXx2_y/" target="_blank" rel="noreferrer" aria-label={`${c.work.view} Rabanito`}><ArrowUpRight /></a>
            </div>
          </article>
          <article className="project project-wide">
            <PortfolioVideo src={media("/media/strike-long-edit.mp4")} />
            <div className="project-info">
              <div className="project-person"><img src={media("/media/sara-guzo-avatar.jpg")} alt="" /><div><h3>Sara Guzo</h3><p>{c.work.sara}</p></div></div>
              <a className="arrow-link" href="https://www.youtube.com/watch?v=cQZ17KRDWQ0&t=82s" target="_blank" rel="noreferrer" aria-label={`${c.work.view} Sara Guzo`}><ArrowUpRight /></a>
            </div>
          </article>
          <article className="project project-poke">
            <PortfolioVideo src={media("/media/poke-elle-edit.mp4")} />
            <div className="project-info">
              <div className="project-person"><img src={media("/media/poke-elle-avatar.jpg")} alt="" /><div><h3>Poke Elle</h3><p>{c.work.poke}</p></div></div>
              <a className="arrow-link" href="https://www.youtube.com/watch?v=AtEpxkVEJYA" target="_blank" rel="noreferrer" aria-label={`${c.work.view} Poke Elle`}><ArrowUpRight /></a>
            </div>
          </article>
        </div>

        <div className="project-secondary-grid reveal">
          {[
            { name: "Rykozio", type: c.work.rykozio, avatar: "/media/rykozio-avatar.png", clip: "/media/rykozio-build-rota.mp4", vertical: true },
            { name: "Maog", type: c.work.maog, avatar: "/media/maog-avatar.jpg", clip: "/media/maog-terraria.mp4", url: "https://youtu.be/aZ5Z5jDBg2U" },
            { name: "Megazote", type: c.work.megazote, avatar: "/media/megazote-avatar.jpg", clip: "/media/megazote-roblox.mp4", url: "https://www.youtube.com/shorts/ZF2gdtDNE4w" },
            { name: "Nini", type: c.work.nini, avatar: "/media/nini-avatar.png", clip: "/media/nini-poppy-playtime.mp4", wide: true },
          ].map(({ name, type, avatar, clip, url, vertical, wide }, index) => (
            <article className={`project-secondary ${vertical ? "vertical-clip" : ""} ${wide ? "wide-clip" : ""}`} key={name}>
              <PortfolioVideo src={media(clip)} />
              <div className="project-secondary-shade" />
              <span className="project-secondary-index">0{index + 4}</span>
              <div className="project-info">
                <div className="project-person"><img src={media(avatar)} alt="" /><div><h3>{name}</h3><p>{type}</p></div></div>
                {url
                  ? <a className="arrow-link" href={url} target="_blank" rel="noreferrer" aria-label={`${c.work.view} ${name}`}><ArrowUpRight /></a>
                  : <span className="clip-badge" aria-hidden="true"><Play size={17} fill="currentColor" /></span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="proceso" data-index="02" data-label={language === "es" ? "PROCESO" : "PROCESS"}>
        <div className="section-head reveal">
          <div><p className="kicker">{c.process.kicker}</p><h2>{c.process.title[0]}<br /><em>{c.process.title[1]}</em></h2></div>
          <div className="section-context">
            <p className="section-lead">{c.process.lead}</p>
            <ContextLedger items={language === "es"
              ? [["04", "ETAPAS"], ["01", "RONDA"], ["24H", "RESPUESTA"]]
              : [["04", "STAGES"], ["01", "ROUND"], ["24H", "REPLY"]]} />
          </div>
        </div>
        <div className="process-console reveal">
          <div className="process-console-bar">
            <span><i /><i /><i /> STRIKE_EDIT / TIMELINE_01</span>
            <b>00:00:24:12</b>
          </div>
          <div className="process-ribbon" aria-hidden="true">
            <span>{c.process.ribbon[0]}</span><i /><span>{c.process.ribbon[1]}</span><i /><span>{c.process.ribbon[2]}</span><i /><span>{c.process.ribbon[3]}</span>
          </div>
          <div className="process-playhead" aria-hidden="true"><span /><b>PLAY</b></div>
          <div className="process">
            {c.process.steps.map(([title, note, tag], index) => (
              <article className="step" key={title} tabIndex={0} style={{ "--step-index": index } as React.CSSProperties}>
                <div className="step-top"><span>0{index + 1}</span><b>{tag}</b></div>
                <div className="step-icon">{stepIcons[index]}</div>
                <h3>{title}</h3><p>{note}</p>
                <div className="step-wave" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, bar) => <i key={bar} style={{ "--bar": bar } as React.CSSProperties} />)}
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="process-aside reveal">{c.process.aside}</p>
      </section>

      <section className="section" id="precios" data-index="03" data-label={language === "es" ? "COTIZACIÓN" : "ESTIMATE"}>
        <div className="section-head reveal">
          <div><p className="kicker">{c.pricing.kicker}</p><h2>{c.pricing.title[0]}<br /><em>{c.pricing.title[1]}</em></h2></div>
          <div className="section-context">
            <p className="section-lead">{c.pricing.lead}</p>
            <ContextLedger items={language === "es"
              ? [["$17", "DESDE"], ["01", "AJUSTE"], ["100%", "CLARO"]]
              : [["$17", "FROM"], ["01", "REVISION"], ["100%", "CLEAR"]]} />
          </div>
        </div>

        <div className="format-switch reveal" role="group" aria-label={c.pricing.formatAria}>
          <button className={format === "vertical" ? "active" : ""} onClick={() => selectFormat("vertical")}>
            <span>9:16</span><b>{c.pricing.vertical}</b><small>{c.pricing.perPiece}</small>
          </button>
          <button className={format === "horizontal" ? "active" : ""} onClick={() => selectFormat("horizontal")}>
            <span>16:9</span><b>{c.pricing.horizontal}</b><small>{c.pricing.perDuration}</small>
          </button>
        </div>

        <div className="tier-grid reveal">
          {(Object.keys(tiers) as Tier[]).map((key) => {
            const item = tiers[key];
            const localized = item[language];
            return (
              <button className={`tier-card ${tier === key ? "active" : ""}`} onClick={() => setTier(key)} key={key}>
                <span className="tier-radio">{tier === key && <Check size={13} />}</span>
                <small>{localized.caption}</small>
                <strong>{localized.label}</strong>
                <b>{format === "vertical" ? `$${item.vertical}` : `$${item.horizontal}`} <i>{format === "vertical" ? `/ ${c.pricing.piece}` : "/ 10 min"}</i></b>
                <ul>{localized.items.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </button>
            );
          })}
        </div>

        <div className="calculator reveal">
          <div className="calc-main">
            <div className="calc-icon">{format === "vertical" ? <Layers3 /> : <Clock3 />}</div>
            <div className="calc-label">
              <span>{format === "vertical" ? c.pricing.quantity : c.pricing.duration}</span>
              <strong>{amount} {format === "vertical" ? (amount === 1 ? c.pricing.video : c.pricing.videos) : c.pricing.minutes}</strong>
            </div>
            <input
              aria-label={format === "vertical" ? c.pricing.quantityAria : c.pricing.durationAria}
              type="range"
              min={format === "vertical" ? 1 : 5}
              max={format === "vertical" ? 10 : 30}
              step={1}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
            <div className="range-scale"><span>{format === "vertical" ? `1 ${c.pricing.piece}` : "5 min"}</span><span>{format === "vertical" ? `10 ${c.pricing.pieces}` : "30 min"}</span></div>
            <label className="priority-check">
              <input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
              <Zap size={16} /><span><b>{c.pricing.urgent}</b><small>{c.pricing.urgentNote}</small></span><strong>+30%</strong>
            </label>
          </div>
          <div className="price-panel">
            <span className="price-eyebrow">{c.pricing.estimate}</span>
            <strong className="price-number"><i>$</i>{price}</strong>
            <span className="price-currency">USD</span>
            <div className="included">
              <span><Check size={14} /> {c.pricing.adjustment}</span>
              <span><Check size={14} /> {c.pricing.export}</span>
            </div>
            <a className="button" href="#contacto">{c.pricing.consult} <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <p className="source-note reveal">{c.pricing.source}</p>
        <div className="cat-card cat-price reveal">
          <img src={media("/media/cat-typing.gif")} alt="" />
          <span className="cat-card-copy"><b>{c.pricing.assistant}</b><small>{c.pricing.assistantNote}</small></span>
          <div className="cat-card-metrics" aria-hidden="true">
            <AnimatedMetric label={language === "es" ? "RITMO" : "PACING"} target={92} />
            <AnimatedMetric label="MOTION" target={84} />
            <AnimatedMetric label={language === "es" ? "GATITOS" : "CATS"} target={100} />
          </div>
        </div>
      </section>

      <section className="section reveal" data-index="04" data-label="XOMACITO">
        <div className="split-feature">
          <div>
            <p className="kicker light">{c.xoma.kicker}</p>
            <h2>Xomacito 3.0</h2>
            <p>{c.xoma.description}</p>
            <div className="xoma-tags">{c.xoma.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <a className="button light-button" href="https://github.com/Strike2911/Xomacito" target="_blank" rel="noreferrer"><Code2 size={17} /> {c.xoma.button} <ArrowUpRight size={15} /></a>
          </div>
          <div className="xoma-window">
            <div className="xoma-titlebar"><span><i /> XOMACITO / MOTOR 3.0</span><b>— □ ×</b></div>
            <div className="xoma-screen">
              <img src={media("/media/xomacito-interface.png")} alt="Xomacito 3.0" />
              <i className="xoma-scan" aria-hidden="true" />
            </div>
            <div className="xoma-status"><span>{c.xoma.status}</span><b>YT · TT · IG · VIMEO</b></div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="collab-title" data-index="05" data-label={language === "es" ? "REFERENCIAS" : "REFERENCES"}>
        <div className="section-head reveal">
          <div><p className="kicker">{c.collab.kicker}</p><h2 id="collab-title">{c.collab.title[0]}<br /><em>{c.collab.title[1]}</em></h2></div>
          <div className="section-context">
            <p className="section-lead">{c.collab.lead}</p>
            <ContextLedger items={language === "es"
              ? [["07", "RESEÑAS"], ["REAL", "FEEDBACK"], ["∞", "CONFIANZA"]]
              : [["07", "REVIEWS"], ["REAL", "FEEDBACK"], ["∞", "TRUST"]]} />
          </div>
        </div>
        <div
          className="collab-window reveal"
          role="region"
          aria-roledescription={language === "es" ? "carrusel de testimonios" : "testimonial carousel"}
          aria-label={language === "es" ? "Referencias de clientes" : "Client references"}
        >
          <div className="collab-track" style={{ transform: `translateX(-${slide * 34}%)` }}>
            {collaborators.map((item, index) => (
              <article
                className="collab-card"
                key={item.name}
                role="group"
                aria-label={`${index + 1} / ${collaborators.length}: ${item.name}`}
                tabIndex={0}
              >
                <div className="collab-top"><span>{c.collab.cardLabel} / 0{index + 1}</span><b>{language.toUpperCase()}</b></div>
                <p>{item[language].note}</p>
                <div className="collab-person"><img src={media(item.avatar)} alt="" /><div><b>{item.name}</b><small>{item[language].type}</small></div></div>
              </article>
            ))}
          </div>
          <p className="mobile-swipe-hint" aria-hidden="true">
            <span>{language === "es" ? "Desliza para leer más" : "Swipe to read more"}</span>
            <span>→</span>
          </p>
          <div className="carousel-controls">
            <button onClick={() => setSlide((current) => (current - 1 + lastDesktopSlide + 1) % (lastDesktopSlide + 1))} aria-label={c.collab.previous}>←</button>
            <span>0{slide + 1} / 0{collaborators.length}</span>
            <button onClick={() => setSlide((current) => (current + 1) % (lastDesktopSlide + 1))} aria-label={c.collab.next}>→</button>
          </div>
        </div>
      </section>

      <section className="contact reveal" id="contacto">
        <div className="contact-grid" aria-hidden="true" />
        <p className="kicker light">{c.contact.kicker}</p>
        <h2>{c.contact.title[0]} <em>{c.contact.title[1]}</em></h2>
        <p>{c.contact.lead}</p>
        <div className="contact-actions">
          <a className="button" href="https://discord.gg/KNh3ZtNkUu" target="_blank" rel="noreferrer">
            <FaDiscord size={18} /> {c.contact.discord} <ArrowUpRight size={14} />
          </a>
          <a className="button secondary" href="https://www.youtube.com/@ElStrikew" target="_blank" rel="noreferrer"><FaYoutube size={19} /> YouTube <ArrowUpRight size={15} /></a>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {c.footer[0]}</span>
      </footer>
    </main>
  );
}
