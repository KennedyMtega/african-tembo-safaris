import { motion } from "framer-motion";
import temboLogo from "@/assets/tembo-logo.jpg";

const dots = [
  { cx: "12%", cy: "18%", r: 180, opacity: 0.06 },
  { cx: "88%", cy: "82%", r: 220, opacity: 0.07 },
  { cx: "78%", cy: "12%", r: 100, opacity: 0.05 },
  { cx: "22%", cy: "88%", r: 140, opacity: 0.05 },
];

export default function MaintenancePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
      style={{ background: "hsl(24 48% 32%)" }}
    >
      {/* Decorative circles */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="white" fillOpacity={d.opacity} />
        ))}
      </svg>

      {/* Subtle top + bottom border lines */}
      <div className="absolute top-0 inset-x-0 h-1" style={{ background: "hsl(38 70% 55% / 0.6)" }} />
      <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: "hsl(38 70% 55% / 0.6)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
          className="h-24 w-24 md:h-32 md:w-32 overflow-hidden rounded-full border-4 shadow-2xl"
          style={{ borderColor: "hsl(38 70% 55% / 0.7)" }}
        >
          <img
            src={temboLogo}
            alt="African Tembo Safaris logo"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Brand name */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm font-semibold tracking-[0.25em] uppercase"
          style={{ color: "hsl(38 70% 70%)", fontFamily: "'Source Sans 3', sans-serif" }}
        >
          African Tembo Safaris
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="h-px w-24 origin-center"
          style={{ background: "hsl(38 70% 55% / 0.5)" }}
        />

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0, 0, 0.2, 1] }}
          className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
          style={{
            color: "white",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Under Maintenance
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl md:text-2xl font-light"
          style={{ color: "hsl(30 33% 90%)", fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
        >
          Our tour will resume shortly.
        </motion.p>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="max-w-md text-sm leading-relaxed"
          style={{ color: "hsl(30 20% 80%)", fontFamily: "'Source Sans 3', sans-serif" }}
        >
          We are making improvements to bring you an even better safari experience.
          We appreciate your patience and look forward to welcoming you soon.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.85, duration: 0.5, ease: "easeOut" }}
          className="h-px w-16 origin-center"
          style={{ background: "hsl(38 70% 55% / 0.4)" }}
        />

        {/* Contact line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="text-xs tracking-wide"
          style={{ color: "hsl(30 20% 70%)", fontFamily: "'Source Sans 3', sans-serif" }}
        >
          Questions?&nbsp;
          <a
            href="mailto:mohammed@africantembosafaris.com"
            className="underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: "hsl(38 70% 70%)" }}
          >
            mohammed@africantembosafaris.com
          </a>
          &nbsp;&middot;&nbsp;
          <a
            href="tel:+255715812423"
            className="underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: "hsl(38 70% 70%)" }}
          >
            +255 715 812 423
          </a>
        </motion.p>
      </div>

      {/* Animated elephant silhouette */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 200 120"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-8 right-8 w-28 md:w-40 opacity-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
      >
        {/* Simple elephant silhouette path */}
        <path
          fill="white"
          d="M60 90 Q55 105 45 110 L65 110 Q70 95 75 90
             L75 75 Q80 55 90 50 Q100 45 115 48
             Q130 50 138 60 Q148 72 145 85
             Q150 80 155 78 Q165 75 170 82 Q175 90 165 95
             Q158 98 150 92 Q148 105 140 110
             L155 110 Q152 100 155 92
             Q162 100 165 110 L180 110
             Q175 95 168 88 Q178 82 178 74
             Q178 62 168 56 Q175 48 172 38
             Q168 30 160 34 Q155 36 153 42
             Q142 32 128 28 Q110 23 92 28
             Q70 34 60 50 Q50 65 52 80 Z"
        />
        {/* Tusk */}
        <path
          fill="white"
          d="M100 70 Q92 78 88 88 Q86 94 90 96 Q95 98 98 90 Q102 80 107 72 Z"
        />
      </motion.svg>
    </div>
  );
}
