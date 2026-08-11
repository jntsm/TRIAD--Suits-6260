import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

/* ------------------------------- slide sheet ------------------------------ */

export function Sheet({
	open,
	onClose,
	title,
	children,
	footer,
}: {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						className="fixed inset-0 z-50"
						style={{ background: "rgba(0,0,0,0.38)" }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						aria-hidden="true"
					/>
					<motion.div
						className="triad-sheet"
						role="dialog"
						aria-modal="true"
						aria-label={title}
						initial={{ x: "100%", y: 0 }}
						animate={{ x: 0, y: 0 }}
						exit={{ x: "100%", y: 0 }}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
					>
						<div
							className="flex items-center justify-between px-5 py-4"
							style={{ borderBottom: "1px solid var(--t-line)" }}
						>
							<span className="triad-mono">{title}</span>
							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar"
								className="grid size-11 place-items-center rounded-md"
								style={{ color: "var(--t-ink)" }}
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path
										d="M6 6l12 12M18 6L6 18"
										stroke="currentColor"
										strokeWidth="1.8"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>
						<div className="triad-sheet-body px-5 py-5">{children}</div>
						{footer && <div className="triad-sheet-footer">{footer}</div>}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

/* --------------------------------- fields --------------------------------- */

export function Field({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<label className="mb-5 block">
			<span className="triad-mono mb-1.5 block">{label}</span>
			{children}
		</label>
	);
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
	return (
		<div className="triad-card p-4">
			<div className="triad-mono mb-2">{label}</div>
			<div className="triad-display text-2xl font-bold sm:text-3xl">{value}</div>
			{hint && (
				<div className="mt-1 text-xs" style={{ color: "var(--t-muted)" }}>
					{hint}
				</div>
			)}
		</div>
	);
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
	return (
		<div
			className="rounded-xl px-6 py-12 text-center"
			style={{ border: "1px dashed var(--t-line)" }}
		>
			<p className="triad-display mb-1.5 text-lg font-semibold">{title}</p>
			<p className="text-sm" style={{ color: "var(--t-muted)" }}>
				{hint}
			</p>
		</div>
	);
}

export function Toggle({
	checked,
	onChange,
	label,
	disabled,
}: {
	checked: boolean;
	onChange: () => void;
	label: string;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			disabled={disabled}
			onClick={onChange}
			className="relative h-7 w-12 shrink-0 rounded-full transition-opacity disabled:opacity-40"
			style={{
				background: checked ? "var(--t-ink)" : "transparent",
				border: "1px solid var(--t-line)",
			}}
		>
			<motion.span
				className="absolute top-1/2 block size-5 rounded-full"
				style={{ background: checked ? "var(--t-on-ink)" : "var(--t-muted)" }}
				animate={{ left: checked ? 25 : 3, y: "-50%" }}
				transition={{ type: "spring", damping: 24, stiffness: 400 }}
			/>
		</button>
	);
}
