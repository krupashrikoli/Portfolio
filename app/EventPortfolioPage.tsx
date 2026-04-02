"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  CalendarDays,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Palette,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type Accent = {
  name: string;
  solid: string;
  glow: string;
  gradient: string;
};

const ACCENTS: Accent[] = [
  {
    name: "Coral",
    solid: "#FF6F61",
    glow: "rgba(255,111,97,0.30)",
    gradient: "linear-gradient(90deg,#FF6F61,#FFD166)",
  },
  {
    name: "Sunshine",
    solid: "#FFD166",
    glow: "rgba(255,209,102,0.28)",
    gradient: "linear-gradient(90deg,#FFD166,#6EE7B7)",
  },
  {
    name: "Sky",
    solid: "#6ECBFF",
    glow: "rgba(110,203,255,0.30)",
    gradient: "linear-gradient(90deg,#6ECBFF,#B8A1FF)",
  },
  {
    name: "Lavender",
    solid: "#B8A1FF",
    glow: "rgba(184,161,255,0.30)",
    gradient: "linear-gradient(90deg,#B8A1FF,#FF6F61)",
  },
  {
    name: "Mint",
    solid: "#6EE7B7",
    glow: "rgba(110,231,183,0.30)",
    gradient: "linear-gradient(90deg,#6EE7B7,#6ECBFF)",
  },
];

const CONTACT_EMAIL = "krupashri.koli11@gmail.com";

const MAIL_SUBJECT = "Hello from your portfolio — event inquiry";

const MAIL_BODY = `Hi Krupashri,

I'm reaching out from your portfolio about an event.

Event type:
Preferred date / timeframe:
Location:
Approx. guest count:
What I want guests to feel:

Thank you,
`;

const MAILTO_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

const GMAIL_COMPOSE_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

/** E.164 without + — same number as tel:+919112322246 */
const WHATSAPP_PHONE_E164 = "919112322246";

const WHATSAPP_PREFILL =
  "Hi Krupashri — I found you through your portfolio and wanted to chat about an event.";

const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_PHONE_E164}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;

const BRING_ANIMATED_IDS = new Set(["experience", "stage", "creative", "people"]);

function isBringAnimatedOpen(id: string | null): boolean {
  return id !== null && BRING_ANIMATED_IDS.has(id);
}

function getBringStarTheme(id: string) {
  switch (id) {
    case "stage":
      return {
        ambient:
          "radial-gradient(circle at 20% 25%, rgba(59,130,246,0.20), transparent 60%), radial-gradient(circle at 80% 30%, rgba(96,165,250,0.16), transparent 62%), radial-gradient(circle at 55% 80%, rgba(147,197,253,0.12), transparent 65%)",
        starFill:
          "linear-gradient(110deg,#E0F2FE 0%, #60A5FA 22%, #2563EB 52%, #93C5FD 74%, #3B82F6 100%)",
        starBloom: "radial-gradient(circle at 40% 40%, rgba(96,165,250,0.5), transparent 62%)",
      };
    case "creative":
      return {
        ambient:
          "radial-gradient(circle at 22% 18%, rgba(167,139,250,0.20), transparent 60%), radial-gradient(circle at 78% 28%, rgba(192,132,252,0.16), transparent 62%), radial-gradient(circle at 55% 80%, rgba(147,51,234,0.10), transparent 65%)",
        starFill:
          "linear-gradient(110deg,#F3E8FF 0%, #C4B5FD 22%, #7C3AED 52%, #DDD6FE 74%, #A78BFA 100%)",
        starBloom: "radial-gradient(circle at 40% 40%, rgba(167,139,250,0.5), transparent 62%)",
      };
    case "people":
      return {
        ambient:
          "radial-gradient(circle at 18% 22%, rgba(52,211,153,0.20), transparent 60%), radial-gradient(circle at 82% 32%, rgba(16,185,129,0.14), transparent 62%), radial-gradient(circle at 55% 80%, rgba(110,231,183,0.12), transparent 65%)",
        starFill:
          "linear-gradient(110deg,#D1FAE5 0%, #34D399 22%, #059669 52%, #6EE7B7 74%, #10B981 100%)",
        starBloom: "radial-gradient(circle at 40% 40%, rgba(52,211,153,0.5), transparent 62%)",
      };
    case "experience":
    default:
      return {
        ambient:
          "radial-gradient(circle at 20% 25%, rgba(255,209,102,0.20), transparent 60%), radial-gradient(circle at 80% 30%, rgba(255,179,71,0.16), transparent 62%), radial-gradient(circle at 55% 80%, rgba(255,215,0,0.10), transparent 65%)",
        starFill:
          "linear-gradient(110deg,#FFF7D1 0%, #FFD700 22%, #FFB347 52%, #FFE7A8 74%, #FFD700 100%)",
        starBloom: "radial-gradient(circle at 40% 40%, rgba(255,215,0,0.45), transparent 62%)",
      };
  }
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function EventPortfolioPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const bringRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const loveRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const [openBringCard, setOpenBringCard] = useState<null | string>(null);
  /** Desktop (fine pointer + hover): open Gmail in browser; else default mailto → usually Gmail app on phone */
  const [useGmailWebOnClick, setUseGmailWebOnClick] = useState(false);
  const [bringOpenPhase, setBringOpenPhase] = useState<
    "idle" | "stars" | "card" | "content"
  >("idle");
  const [starsSeed, setStarsSeed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });
  const progressX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const glowScale = useTransform(scrollYProgress, [0, 1], [1.06, 0.95]);

  const eyeParallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [80, -80], { clamp: false }),
    { stiffness: 55, damping: 18, mass: 0.35 },
  );
  const eyeParallaxScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [0.96, 0.90], { clamp: false }),
    { stiffness: 55, damping: 18, mass: 0.35 },
  );

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const glowX = useSpring(cursorX, { stiffness: 180, damping: 22, mass: 0.18 });
  const glowY = useSpring(cursorY, { stiffness: 180, damping: 22, mass: 0.18 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setUseGmailWebOnClick(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!openBringCard || !BRING_ANIMATED_IDS.has(openBringCard)) {
      setBringOpenPhase("idle");
      return;
    }

    setBringOpenPhase("stars");
    setStarsSeed((s) => s + 1);
    const tCard = window.setTimeout(() => setBringOpenPhase("card"), 1000);
    const tContent = window.setTimeout(() => setBringOpenPhase("content"), 1700);
    return () => {
      window.clearTimeout(tCard);
      window.clearTimeout(tContent);
    };
  }, [openBringCard]);

  const bringCards = useMemo(
    () => [
      {
        id: "experience",
        title: "An Eye for Experience",
        icon: Sparkles,
        accent: ACCENTS[0],
        blurb:
          "I think in moments—entrance, flow, energy, and the little details people remember days later.",
        chips: ["Flow & rhythm", "Mood mapping", "Tiny details"],
      },
      {
        id: "stage",
        title: "Love for the Stage",
        icon: Mic,
        accent: ACCENTS[2],
        blurb:
          "I understand stage energy because I’ve lived it—so I plan with timing, presence, and confidence.",
        chips: ["Stage cues", "Run of show", "Energy control"],
      },
      {
        id: "creative",
        title: "Creative Instinct",
        icon: Palette,
        accent: ACCENTS[3],
        blurb:
          "Themes, aesthetics, and storytelling—bringing everything together so it feels intentional, not random.",
        chips: ["Themes", "Visual story", "Signature touches"],
      },
      {
        id: "people",
        title: "People‑First Approach",
        icon: Users,
        accent: ACCENTS[4],
        blurb:
          "I care about how people feel. Comfort, joy, belonging—those are the real deliverables.",
        chips: ["Guest comfort", "Warm hosting", "Little surprises"],
      },
    ],
    [],
  );

  const experienceItems = useMemo(
    () => [
      {
        title: "GirlScript Community",
        emoji: "🎟️",
        accent: ACCENTS[1],
        description:
          "Contributed to organizing and managing technical events, coordinating activities, and ensuring smooth execution.",
      },
      {
        title: "College Fests & Events",
        emoji: "🎤",
        accent: ACCENTS[0],
        description:
          "Actively involved in planning, coordination, and on-ground management—handling everything from logistics to stage presence.",
      },
      {
        title: "Personal Event Planning",
        emoji: "🎂",
        accent: ACCENTS[4],
        description:
          "Helped plan and organize birthdays and small celebrations, focusing on themes, decor ideas, and overall experience.",
      },
    ],
    [],
  );

  const loveTiles = useMemo(
    () => [
      {
        title: "Themed celebrations",
        note: "Playful palettes, cohesive details.",
        accent: ACCENTS[0],
        imageSrc: "/moodboard/themed-celebrations.png",
      },
      {
        title: "Stage experiences",
        note: "Energy, timing, presence.",
        accent: ACCENTS[2],
        imageSrc: "/moodboard/stage-experiences.jpg",
        imageObjectPosition: "object-[center_10%]",
      },
      {
        title: "Surprise moments",
        note: "Little things that feel big.",
        accent: ACCENTS[1],
        imageSrc: "/moodboard/surprise-moments.jpg",
      },
      {
        title: "Celebration moodboards",
        note: "Textures, florals, colors.",
        accent: ACCENTS[2],
        imageSrc: "/moodboard/celebration-moodboards.jpg",
        imageObjectPosition: "object-[center_62%]",
      },
    ],
    [],
  );

  const quotes = useMemo(
    () => [
      "An event is remembered not by how it looked, but by how it felt.",
      "Behind every beautiful event is a thousand small details done with care.",
      "I just love seeing people forget everything else and live fully in a moment.",
    ],
    [],
  );

  const scrollTo = (el: HTMLElement | null) => {
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stars = useMemo(() => {
    const count = 70;
    // deterministic-ish positions per open
    const rand = (n: number) => {
      const x = Math.sin(n * 999 + starsSeed * 1234) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => {
      const r1 = rand(i + 1);
      const r2 = rand(i + 101);
      const r3 = rand(i + 201);
      // mixed big + small like your reference
      const size =
        r3 < 0.22 ? 22 + Math.round(r1 * 14) : 8 + Math.round(r3 * 12);
      return {
        key: `${starsSeed}-${i}`,
        leftPct: 8 + r1 * 84,
        topPct: 10 + r2 * 75,
        size,
        delay: r3 * 0.35,
        rotate: -18 + r1 * 36,
        drift: -22 + r2 * 44,
      };
    });
  }, [starsSeed]);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-white text-slate-900 selection:bg-[#FF6F61]/25 selection:text-slate-950"
    >
      {/* Scroll progress indicator */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-1 bg-transparent">
        <motion.div
          style={{ scaleX: progressX }}
          className="h-full origin-left bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF,#B8A1FF,#6EE7B7)]"
        />
      </div>

      {/* Subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.14] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Cursor glow */}
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          style={{ x: glowX, y: glowY, scale: glowScale }}
          className="absolute -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full blur-3xl opacity-70"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(255,111,97,0.28),rgba(255,209,102,0.20),rgba(110,203,255,0.18),rgba(184,161,255,0.14),rgba(110,231,183,0.12),transparent_70%)]" />
        </motion.div>
      </motion.div>

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* Floating shapes */}
        <motion.div
          aria-hidden
          className="absolute -left-28 -top-28 z-0 h-[430px] w-[430px] rounded-full blur-3xl"
          animate={{ x: [0, 26, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,111,97,.55), rgba(255,111,97,.0) 60%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-32 top-10 z-0 h-[540px] w-[540px] rounded-full blur-3xl"
          animate={{ x: [0, -22, 0], y: [0, 14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(110,203,255,.55), rgba(110,203,255,.0) 60%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-[55%] z-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl"
          animate={{ x: [0, 18, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(184,161,255,.50), rgba(184,161,255,.0) 60%)",
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-20 md:px-12">
          <div className="grid w-full min-w-0 grid-cols-1 items-start gap-10 md:grid-cols-[1.15fr_0.85fr]">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
                <Heart className="h-4 w-4 text-[#FF6F61]" />
                <span className="text-sm text-slate-700">
                  Event Planner (in the making) • Experience Curator • Aspiring Event Designer
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-sm tracking-[0.22em] text-slate-600">
                  KRUPASHRI KOLI • GOA, INDIA
                </p>

                <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] md:text-6xl">
                  I create{" "}
                  <span className="bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF,#B8A1FF)] bg-clip-text text-transparent">
                    moments
                  </span>{" "}
                  that people carry with them
                </h1>

                <p className="max-w-xl text-pretty text-lg leading-relaxed text-slate-700 md:text-xl">
                  For me, it was never just an event—it was always about the feeling.
                </p>
                <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-600">
                  From college fests to intimate celebrations, I’ve always found my
                  place around people, energy, and the stage. Today, I’m turning that
                  instinct into something bigger—designing experiences that feel
                  effortless, personal, and unforgettable.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => scrollTo(aboutRef.current)}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(255,111,97,0.35)]"
                >
                  Discover My Story
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => scrollTo(contactRef.current)}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  Let’s Talk
                </motion.button>
              </div>

              {/* Floating info pills: email full-width row so address is never clipped */}
              <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:col-span-2">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium leading-snug text-slate-900 select-text">
                    {CONTACT_EMAIL}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs text-slate-500">Based in</p>
                  <p className="text-sm font-medium text-slate-900">Goa, India</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-900">+91 9112322246</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Positioning:</span>{" "}
                  Event Planner (in the making) • Experience Curator • Aspiring Event Designer
                </p>
              </div>
            </motion.div>

            {/* Right: photo + overlapping cards */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-sm md:-mt-10"
            >
              <div className="absolute -inset-6 rounded-[28px] blur-2xl" style={{ background: ACCENTS[2].gradient, opacity: 0.18 }} />
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 p-2 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="overflow-hidden rounded-[22px]">
                  <Image
                    src="/profile-photo.png"
                    alt="Krupashri Koli"
                    width={720}
                    height={960}
                    className="h-[360px] w-full object-cover object-[center_45%] sm:h-[420px]"
                    priority
                  />
                </div>

                <div className="mt-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      Krupashri Koli
                    </p>
                    <p className="text-pretty text-xs leading-relaxed text-slate-600">
                      I’ve always been creating experiences—now I’m choosing it consciously.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fun overlapping mini cards */}
              <motion.div
                aria-hidden
                className="absolute -left-10 top-[58%] hidden w-40 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-md backdrop-blur md:block lg:-left-20 lg:w-44"
                style={{ rotate: -4 }}
                whileHover={{ y: -6 }}
              >
                <div className="h-2 w-12 rounded-full" style={{ background: ACCENTS[0].gradient }} />
                <p className="mt-3 text-sm font-semibold text-slate-900">Vibe</p>
                <p className="text-xs text-slate-600">Warm • Bright • Alive</p>
              </motion.div>
              <motion.div
                aria-hidden
                className="absolute -right-10 top-[10%] hidden w-40 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-md backdrop-blur md:block lg:-right-20 lg:w-44"
                style={{ rotate: 5 }}
                whileHover={{ y: -6 }}
              >
                <div className="h-2 w-12 rounded-full" style={{ background: ACCENTS[4].gradient }} />
                <p className="mt-3 text-sm font-semibold text-slate-900">Details</p>
                <p className="text-xs text-slate-600">Themes • Flow • Moments</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ABOUT */}
      <section ref={aboutRef} className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -left-8 -top-10 h-56 w-56 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,209,102,.55), rgba(255,209,102,0) 62%)",
                }}
              />
              <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
                ABOUT
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                A little story—
                <span className="block bg-[linear-gradient(90deg,#FF6F61,#B8A1FF,#6ECBFF)] bg-clip-text text-transparent">
                  from stage energy to behind‑the‑scenes.
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-700">
                I didn’t discover events—I’ve always been a part of them.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo(bringRef.current)}
                  className="rounded-2xl bg-[linear-gradient(90deg,#B8A1FF,#6ECBFF)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                >
                  What I bring
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(experienceRef.current)}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Experience
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-56 w-56 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(110,231,183,.50), rgba(110,231,183,0) 62%)",
                }}
              />
              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.45)] backdrop-blur md:p-8">
                <div className="space-y-5 text-justify hyphens-none text-slate-700">
                  <p className="leading-relaxed">
                    While my academic journey took me into the world of technology,
                    my heart always leaned towards people, energy, and experiences.
                    From being on stage with a mic in hand to working behind the
                    scenes of college fests, I’ve lived both the spotlight and the
                    chaos that comes with creating something memorable.
                  </p>
                  <p className="leading-relaxed">
                    Whether it was helping friends plan their birthdays or putting
                    together small celebrations, I’ve always been the one thinking
                    about the details and the experience. Because an event isn’t
                    just managed—it’s felt.
                  </p>
                  <p className="leading-relaxed">
                    Today, I’m choosing to follow that instinct of bringing
                    together my sense of creativity, attention to detail, and love
                    for meaningful moments into the world of event planning.
                  </p>
                  <p className="font-semibold text-slate-900">
                    Because for me, it’s never just about managing an event.
                    <span className="block text-slate-700">
                      It’s about how it feels when everything comes together.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT I BRING */}
      <section ref={bringRef} className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 space-y-3"
          >
            <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
              ✨ What I Bring to Every Event
            </p>
            <h2 className="text-3xl font-semibold text-slate-950 md:text-4xl">
              <span className="bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6EE7B7)] bg-clip-text text-transparent">
                Heart
              </span>
              , creativity, and care in every detail.
            </h2>
            <p className="max-w-2xl text-slate-700">
              Click to open.
            </p> 
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {bringCards.map((c, idx) => (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => setOpenBringCard(c.id)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Open: ${c.title}`}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white/85 p-6 text-left shadow-sm backdrop-blur transition"
              >
                <div
                  aria-hidden
                  className="absolute -inset-24 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${c.accent.glow}, transparent 60%)`,
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: c.accent.gradient }}
                />

                <div className="relative flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    What I bring
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">{c.title}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {openBringCard && (
            <motion.div
              className={classNames(
                "fixed inset-0 z-50 flex items-center justify-center px-6 py-10",
                isBringAnimatedOpen(openBringCard) ? "bg-white" : "bg-slate-900/30 backdrop-blur-sm",
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenBringCard(null)}
            >
              {/* Stars phase (themed per card). Card stays hidden until spin phase. */}
              {isBringAnimatedOpen(openBringCard) && (
                <AnimatePresence>
                  {(bringOpenPhase === "stars" || bringOpenPhase === "card") && (
                    <motion.div
                      key={`stars-${starsSeed}-${openBringCard}`}
                      aria-hidden
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute inset-0"
                    >
                      <div
                        className="absolute inset-0"
                        style={{ background: getBringStarTheme(openBringCard).ambient }}
                      />
                      {stars.map((s) => (
                        <motion.div
                          key={s.key}
                          className="absolute"
                          style={{
                            left: `${s.leftPct}%`,
                            top: `${s.topPct}%`,
                            width: s.size,
                            height: s.size,
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0.55,
                            y: 18,
                            rotate: s.rotate - 120,
                          }}
                          animate={{
                            opacity: [0, 1, 0.7, 0],
                            scale: [0.55, 1.18, 1.02, 0.5],
                            y: [18, -24, -44, -70],
                            x: [0, s.drift, s.drift * 1.6],
                            rotate: [s.rotate - 120, s.rotate + 520],
                            filter: ["brightness(1)", "brightness(1.35)", "brightness(1.05)"],
                          }}
                          transition={{
                            duration: 2.0,
                            delay: s.delay,
                            ease: "easeOut",
                          }}
                        >
                          <div
                            className="relative h-full w-full shadow-[0_22px_50px_-30px_rgba(15,23,42,0.30)]"
                            style={{
                              clipPath:
                                "polygon(50% 0%, 61% 32%, 95% 35%, 68% 55%, 78% 88%, 50% 70%, 22% 88%, 32% 55%, 5% 35%, 39% 32%)",
                            }}
                          >
                            <div
                              className="absolute inset-0 opacity-95"
                              style={{
                                background: getBringStarTheme(openBringCard).starFill,
                              }}
                            />
                            <motion.div
                              className="absolute inset-0 opacity-85"
                              animate={{
                                backgroundPosition: ["-30% 50%", "130% 50%", "-30% 50%"],
                              }}
                              transition={{
                                duration: 1.05,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              style={{
                                background:
                                  "linear-gradient(90deg,transparent 0%, rgba(255,255,255,0.95) 45%, transparent 75%)",
                                backgroundSize: "240% 100%",
                                mixBlendMode: "screen",
                              }}
                            />
                            <div
                              className="absolute -inset-3 rounded-full blur-md"
                              style={{
                                background: getBringStarTheme(openBringCard).starBloom,
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={
                  isBringAnimatedOpen(openBringCard)
                    ? bringOpenPhase === "card" || bringOpenPhase === "content"
                      ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                      : { opacity: 0, y: 18, scale: 0.2, rotate: -360 }
                    : { opacity: 1, y: 0, scale: 1, rotate: 0 }
                }
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={
                  isBringAnimatedOpen(openBringCard)
                    ? bringOpenPhase === "card" || bringOpenPhase === "content"
                      ? { type: "spring", stiffness: 220, damping: 16, mass: 0.65 }
                      : { duration: 0.15 }
                    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                }
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.55)] md:p-8"
                style={{
                  transformOrigin: "50% 60%",
                  pointerEvents:
                    isBringAnimatedOpen(openBringCard) && bringOpenPhase === "stars"
                      ? "none"
                      : "auto",
                }}
              >

                <button
                  type="button"
                  onClick={() => setOpenBringCard(null)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50"
                >
                  <X className="h-5 w-5 text-slate-700" />
                </button>

                {(() => {
                  const card = bringCards.find((x) => x.id === openBringCard);
                  if (!card) return null;
                  const Icon = card.icon;

                  const assembleContainer =
                    isBringAnimatedOpen(openBringCard)
                      ? {
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.06,
                              delayChildren: bringOpenPhase === "content" ? 0 : 999,
                            },
                          },
                        }
                      : undefined;

                  const assembleItem =
                    isBringAnimatedOpen(openBringCard)
                      ? {
                          hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
                          show: { opacity: 1, y: 0, filter: "blur(0px)" },
                        }
                      : undefined;

                  return (
                    <motion.div
                      className="space-y-5 pr-10"
                      variants={assembleContainer}
                      initial={isBringAnimatedOpen(openBringCard) ? "hidden" : undefined}
                      animate={
                        isBringAnimatedOpen(openBringCard)
                          ? bringOpenPhase === "content"
                            ? "show"
                            : "hidden"
                          : undefined
                      }
                    >
                      <motion.div
                        variants={assembleItem}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
                      >
                        <Icon className="h-4 w-4" style={{ color: card.accent.solid }} />
                        <span>What I bring</span>
                      </motion.div>

                      <motion.h3
                        variants={assembleItem}
                        className="text-2xl font-semibold text-slate-900 md:text-3xl"
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        variants={assembleItem}
                        className="text-pretty text-base leading-relaxed text-slate-700"
                      >
                        {card.blurb}
                      </motion.p>

                      <motion.div variants={assembleItem} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          "Soft planning, strong execution.",
                          "Details that feel effortless.",
                          "A vibe people can sense.",
                          "Calm in the chaos.",
                        ].map((t) => (
                          <div
                            key={t}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                          >
                            <span
                              className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                              style={{ background: card.accent.solid }}
                            />
                            {t}
                          </div>
                        ))}
                      </motion.div>

                      {isBringAnimatedOpen(openBringCard) && bringOpenPhase === "stars" && (
                        <div className="text-sm text-slate-500">
                          Just a second… setting the vibe.
                        </div>
                      )}
                    </motion.div>
                  );
                })()}

                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-16 -right-20 h-64 w-64 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle at 40% 40%, ${
                      bringCards.find((x) => x.id === openBringCard)?.accent.glow ?? "rgba(0,0,0,0.1)"
                    }, transparent 60%)`,
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* EXPERIENCE (timeline-ish) */}
      <section ref={experienceRef} className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 space-y-3"
          >
            <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
              🌟 Event Experience
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">
              A timeline of real moments.
            </h2>
            <p className="max-w-2xl text-slate-700">
              Simple, authentic, and very real.
            </p>
          </motion.div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute left-4 top-2 hidden h-[calc(100%-8px)] w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent md:block"
            />

            <div className="grid gap-6 md:pl-10">
              {experienceItems.map((it, idx) => (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ delay: idx * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
                >
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1.5 rounded-l-[24px]"
                    style={{ background: it.accent.gradient }}
                  />

                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{it.emoji}</span>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {it.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {it.description}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                      <CalendarDays className="h-4 w-4" style={{ color: it.accent.solid }} />
                      <span>Hands‑on</span>
                    </div>
                  </div>

                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-5 top-7 hidden h-4 w-4 rounded-full border-4 border-white shadow-sm md:block"
                    style={{ background: it.accent.solid, borderColor: "white" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I LOVE (2×2 grid) */}
      <section ref={loveRef} className="relative z-10 px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 space-y-3"
          >
            <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
              WHAT I LOVE CREATING
            </p>
            <h2 className="text-3xl font-semibold text-slate-950 md:text-4xl">
              A moodboard of{" "}
              <span className="bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF,#B8A1FF,#6EE7B7)] bg-clip-text text-transparent">
                experiences
              </span>
              .
            </h2>
            {/* <p className="max-w-2xl text-slate-700">
              Uneven tiles, playful overlays—hover to reveal.
            </p> */}

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                "Thoughtful themes that reflect personality",
                "Smooth, stress-free event flow",
                "Moments that feel natural, not forced",
                "Celebrations where people feel present and happy",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm"
                >
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF,#B8A1FF,#6EE7B7)]" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {loveTiles.map((t, idx) => (
              <motion.div
                key={`${t.title}-${idx}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: idx * 0.03, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white/90 shadow-sm"
              >
                <div className="relative">
                  <div
                    className={classNames(
                      "relative h-52 w-full overflow-hidden sm:h-60",
                    )}
                    style={
                      "imageSrc" in t && t.imageSrc
                        ? undefined
                        : {
                            background: `linear-gradient(135deg, ${t.accent.solid}33, #FFFFFF 55%)`,
                          }
                    }
                  >
                    {"imageSrc" in t && t.imageSrc ? (
                      <Image
                        src={t.imageSrc}
                        alt={t.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className={classNames(
                          "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                          "imageObjectPosition" in t && t.imageObjectPosition
                            ? t.imageObjectPosition
                            : "",
                        )}
                        priority={idx === 0}
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-60"
                        style={{
                          background:
                            "radial-gradient(rgba(15,23,42,0.14) 1px, transparent 1px)",
                          backgroundSize: "22px 22px",
                        }}
                      />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/10"
                    />
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{t.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="relative z-17 overflow-hidden px-6 py-24 md:px-12 text-white">
        {/* Ambient "eye" art backdrop */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-x-0 -inset-y-24 -z-10"
          style={{ y: useTransform(scrollYProgress, [0, 1], [18, -18], { clamp: false }) }}
        >
          <motion.div
            className="absolute inset-0 opacity-[1]"
            style={{
              y: eyeParallaxY,
              scale: eyeParallaxScale,
            }}
          >
            <Image
              src="/ambient/trippy-eye.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover origin-center saturate-[1.15] contrast-[1.12]"
              priority={false}
            />
          </motion.div>
          <div
            className="absolute inset-0 opacity-[0.65]"
            style={{
              background:
                "radial-gradient(circle at 35% 40%, rgba(110,203,255,0.18), transparent 55%), radial-gradient(circle at 62% 52%, rgba(255,111,97,0.14), transparent 58%), radial-gradient(circle at 50% 62%, rgba(255,209,102,0.16), transparent 60%)",
              WebkitMaskImage:
                "radial-gradient(circle at 55% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 36%, rgba(0,0,0,0) 72%)",
              maskImage:
                "radial-gradient(circle at 55% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 36%, rgba(0,0,0,0) 72%)",
            }}
          />
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 space-y-3 text-center"
          >
            <p className="text-sm font-semibold tracking-[0.22em] text-white/80">
              WORDS I LIVE BY
            </p>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              The feeling is the point.
            </h2>
            <div className="mx-auto h-1 w-40 rounded-full bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF,#B8A1FF,#6EE7B7)]" />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {quotes.map((q, idx) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: idx * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="liquid-glass-card rounded-[24px] p-6"
              >
                <p className="text-pretty text-base font-semibold leading-relaxed text-white/95">
                  “{q}”
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section ref={contactRef} className="relative z-10 mt-10 px-6 pb-24 md:mt-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 space-y-3"
          >
            <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
              CONTACT
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Let's make your event come alive.
              <span className="block text-slate-700 text-lg font-normal mt-2">
                (That’s the goal. Every single time.)
              </span>
            </h2>
            <p className="max-w-2xl text-slate-700">
              Tell me what you’re dreaming of—and I’ll help shape it into a real,
              beautiful experience.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
              <div className="space-y-5">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Krupashri Koli</p>
                  <p className="text-sm text-slate-600">
                    Aspiring Event Planner • Experience Curator
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin className="h-4 w-4 text-[#6ECBFF]" />
                    <span>Goa, India</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail className="h-4 w-4 shrink-0 text-[#FF6F61]" aria-hidden />
                    <span className="break-all select-text">{CONTACT_EMAIL}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Phone className="h-4 w-4 shrink-0 text-[#B8A1FF]" aria-hidden />
                    <span className="select-text">+91 9112322246</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">A gentle promise:</p>
                  <p className="mt-1">
                    I’ll care about your event like it’s someone I love.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 rounded-[24px] border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <motion.a
                  href={MAILTO_HREF}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={(e) => {
                    if (useGmailWebOnClick) {
                      e.preventDefault();
                      window.open(GMAIL_COMPOSE_HREF, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="group inline-flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#FF6F61,#FFD166,#6ECBFF)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(255,111,97,0.35)] min-[480px]:w-auto"
                >
                  <Mail className="h-5 w-5" />
                  Mail me!
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </motion.a>

                <motion.a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group inline-flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(37,211,102,0.45)] min-[480px]:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp me!
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </motion.a>
              </div>

              <p className="text-xs text-slate-500 md:hidden">
                No mail app?{" "}
                <a
                  href={GMAIL_COMPOSE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#6ECBFF] underline decoration-[#6ECBFF]/40 underline-offset-2 hover:text-[#FF6F61]"
                >
                  Open email template in Gmail on the web
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 px-6 py-10 text-center text-xs text-slate-500 md:px-12">
        <p>
          © {new Date().getFullYear()} Krupashri Koli • Bright moments, thoughtfully curated.
        </p>
      </footer>
    </div>
  );
}

