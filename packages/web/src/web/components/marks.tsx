import { motion } from "motion/react";

type MarkProps = {
  /** stroke color */
  color?: string;
  size?: number;
  className?: string;
};

const shadow = "drop-shadow(0 22px 55px rgba(10,10,10,0.22))";

/** RADIAN — circumference + rotating radius (timer / focus) */
export function RadianMark({ color = "#0a0a0a", size = 340, className }: MarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={{ filter: shadow }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <circle cx="100" cy="100" r="78" stroke={color} strokeWidth="2" opacity="0.28" />
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="180 490"
      />
      {/* rotating radius / hand */}
      <motion.g
        style={{ originX: "100px", originY: "100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="30" r="5" fill={color} />
      </motion.g>
      <circle cx="100" cy="100" r="4" fill={color} />
    </motion.svg>
  );
}

/** QUADRA — rounded square + diagonal (to-do / blocks) */
export function QuadraMark({ color = "#fafaf8", size = 340, className }: MarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={{ filter: "drop-shadow(0 22px 55px rgba(0,0,0,0.45))" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="34" y="34" width="132" height="132" rx="18" stroke={color} strokeWidth="2.5" opacity="0.9" />
        {/* three task slots — nods to the 3-task limit */}
        <line x1="34" y1="78" x2="166" y2="78" stroke={color} strokeWidth="1.5" opacity="0.35" />
        <line x1="34" y1="122" x2="166" y2="122" stroke={color} strokeWidth="1.5" opacity="0.35" />
        {/* diagonal accent */}
        <motion.line
          x1="34"
          y1="166"
          x2="166"
          y2="34"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
        />
        <circle cx="56" cy="56" r="4" fill={color} />
      </motion.g>
    </motion.svg>
  );
}

/** PRISMA — triangle prism refracting a single beam into three rays (calendar + budget) */
export function PrismaMark({ color = "#0a0a0a", size = 360, className }: MarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 260 200"
      fill="none"
      className={className}
      style={{ filter: shadow }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* incoming single beam */}
      <motion.line
        x1="8"
        y1="118"
        x2="96"
        y2="100"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {/* prism triangle */}
      <motion.path
        d="M110 30 L168 150 L52 150 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
      />
      {/* refracted rays — three, fanning out (categories / periods) */}
      {[
        { x2: 252, y2: 66 },
        { x2: 252, y2: 100 },
        { x2: 252, y2: 134 },
      ].map((r, i) => (
        <motion.line
          key={i}
          x1="150"
          y1="100"
          x2={r.x2}
          y2={r.y2}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.85 - i * 0.18}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.85 - i * 0.18 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 + i * 0.14, ease: "easeOut" }}
        />
      ))}
    </motion.svg>
  );
}

/** Tiny inline glyphs for nav / compact use */
export function MiniMark({
  shape,
  color = "currentColor",
  size = 18,
}: {
  shape: "circle" | "square" | "triangle";
  color?: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {shape === "circle" && <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />}
      {shape === "square" && (
        <rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
      )}
      {shape === "triangle" && (
        <path d="M12 4 L20 19 L4 19 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      )}
    </svg>
  );
}
