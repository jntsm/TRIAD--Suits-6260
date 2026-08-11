import { motion } from "motion/react";

type MarkProps = {
	size?: number;
	className?: string;
	animate?: boolean;
};

/**
 * TRIAD — triangle with three emphasized vertices.
 * Each vertex = one module (Radian / Quadra / Prisma).
 * Uses currentColor so it inherits the themed text color.
 */
export function TriadMark({ size = 96, className, animate = true }: MarkProps) {
	const Wrapper = animate ? motion.svg : "svg";
	const animProps = animate
		? {
				animate: { y: [0, -8, 0] },
				transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
			}
		: {};

	return (
		<Wrapper
			width={size}
			height={size}
			viewBox="0 0 120 120"
			fill="none"
			className={className}
			{...animProps}
		>
			{/* triangle body */}
			<path
				d="M60 22 L98 88 L22 88 Z"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinejoin="round"
			/>
			{/* inner beam lines toward each vertex */}
			<g opacity="0.28">
				<line x1="60" y1="66" x2="60" y2="22" stroke="currentColor" strokeWidth="1.5" />
				<line x1="60" y1="66" x2="98" y2="88" stroke="currentColor" strokeWidth="1.5" />
				<line x1="60" y1="66" x2="22" y2="88" stroke="currentColor" strokeWidth="1.5" />
			</g>
			{/* three vertices = three modules */}
			<circle cx="60" cy="22" r="5.5" fill="currentColor" />
			<circle cx="98" cy="88" r="5.5" fill="currentColor" />
			<circle cx="22" cy="88" r="5.5" fill="currentColor" />
			{/* center */}
			<circle cx="60" cy="66" r="2.5" fill="currentColor" opacity="0.5" />
		</Wrapper>
	);
}

/** Small module glyphs for nav / cards — stroke only, currentColor. */
export function GlyphRadian({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
			<line x1="12" y1="12" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function GlyphQuadra({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.8" />
			<line x1="3.5" y1="20.5" x2="20.5" y2="3.5" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
		</svg>
	);
}

export function GlyphPrisma({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path d="M12 3.5 L20.5 20 L3.5 20 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
		</svg>
	);
}

export function GlyphSettings({ size = 22 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
			<path
				d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	);
}
