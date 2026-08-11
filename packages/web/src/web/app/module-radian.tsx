import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { addSession, computeStreak, useTriad } from "./store";
import { StatCard } from "./ui";

const PRESETS = [25, 50, 90];
const R = 86;
const CIRC = 2 * Math.PI * R;

function fmt(sec: number) {
	const m = Math.floor(Math.max(0, sec) / 60);
	const s = Math.max(0, sec) % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RadianModule() {
	const { sessions } = useTriad();
	const [minutes, setMinutes] = useState(25);
	const [label, setLabel] = useState("");
	const [running, setRunning] = useState(false);
	const [remaining, setRemaining] = useState(25 * 60);
	const [justDone, setJustDone] = useState(false);

	// timestamp-based so the timer stays accurate when the tab loses focus
	const endAtRef = useRef<number | null>(null);
	const total = minutes * 60;

	const finish = useCallback(() => {
		setRunning(false);
		endAtRef.current = null;
		addSession(label, minutes);
		setRemaining(minutes * 60);
		setJustDone(true);
		setTimeout(() => setJustDone(false), 2600);
	}, [label, minutes]);

	useEffect(() => {
		if (!running) return;
		const tick = () => {
			if (endAtRef.current == null) return;
			const left = Math.round((endAtRef.current - Date.now()) / 1000);
			if (left <= 0) finish();
			else setRemaining(left);
		};
		tick();
		const id = window.setInterval(tick, 250);
		const onVis = () => !document.hidden && tick();
		document.addEventListener("visibilitychange", onVis);
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [running, finish]);

	function start() {
		endAtRef.current = Date.now() + remaining * 1000;
		setRunning(true);
	}
	function pause() {
		setRunning(false);
		endAtRef.current = null;
	}
	function reset() {
		pause();
		setRemaining(minutes * 60);
	}
	function choose(m: number) {
		pause();
		setMinutes(m);
		setRemaining(m * 60);
	}

	const progress = total > 0 ? 1 - remaining / total : 0;
	const streak = computeStreak(sessions);
	const totalMin = sessions.reduce((a, s) => a + s.minutes, 0);
	const hours = Math.floor(totalMin / 60);

	return (
		<div className="mx-auto w-full max-w-lg">
			<header className="mb-7">
				<span className="triad-mono">Vértice · Foco</span>
				<h1 className="triad-wordmark mt-2 text-base">R A D I A N</h1>
			</header>

			{/* timer dial */}
			<div className="relative mx-auto mb-7 grid place-items-center" style={{ width: 240, height: 240 }}>
				<svg width="240" height="240" viewBox="0 0 200 200" aria-hidden="true">
					<circle cx="100" cy="100" r={R} fill="none" stroke="var(--t-line)" strokeWidth="3" />
					<motion.circle
						cx="100"
						cy="100"
						r={R}
						fill="none"
						stroke="var(--t-ink)"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeDasharray={CIRC}
						animate={{ strokeDashoffset: CIRC * (1 - progress) }}
						transition={{ duration: 0.3, ease: "linear" }}
						transform="rotate(-90 100 100)"
					/>
					{running && (
						<motion.g
							style={{ originX: "100px", originY: "100px" }}
							animate={{ rotate: 360 }}
							transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
						>
							<line
								x1="100"
								y1="100"
								x2="100"
								y2="26"
								stroke="var(--t-ink)"
								strokeWidth="1.6"
								opacity="0.35"
							/>
						</motion.g>
					)}
				</svg>
				<div className="absolute grid place-items-center text-center">
					<span
						className="triad-display font-extrabold tabular-nums"
						style={{ fontSize: "clamp(2.6rem, 12vw, 3.4rem)" }}
					>
						{fmt(remaining)}
					</span>
					<span className="triad-mono mt-1">
						{justDone ? "Sessão concluída" : running ? "Em foco" : "Pronto"}
					</span>
				</div>
			</div>

			{/* presets */}
			<div className="mb-5 flex justify-center gap-2">
				{PRESETS.map((p) => (
					<button
						key={p}
						type="button"
						onClick={() => choose(p)}
						className="triad-btn"
						style={{
							background: minutes === p ? "var(--t-ink)" : "transparent",
							color: minutes === p ? "var(--t-on-ink)" : "var(--t-ink)",
							borderColor: minutes === p ? "transparent" : "var(--t-line)",
							padding: "10px 16px",
							minHeight: 44,
						}}
						aria-pressed={minutes === p}
					>
						{p} min
					</button>
				))}
			</div>

			<div className="mb-5">
				<input
					className="triad-input text-center"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					placeholder="No que você está focando?"
					aria-label="Nome da sessão"
				/>
			</div>

			<div className="mb-9 flex gap-3">
				<button
					type="button"
					className="triad-btn triad-btn-primary flex-[2]"
					onClick={running ? pause : start}
				>
					{running ? "Pausar" : "Iniciar"}
				</button>
				<button type="button" className="triad-btn triad-btn-ghost flex-1" onClick={reset}>
					Zerar
				</button>
			</div>

			<div className="mb-6 grid grid-cols-3 gap-3">
				<StatCard label="Sessões" value={String(sessions.length)} />
				<StatCard label="Horas" value={`${hours}h`} />
				<StatCard label="Streak" value={`${streak}d`} />
			</div>

			{sessions.length > 0 && (
				<section>
					<h2 className="triad-mono mb-3">Histórico</h2>
					<ul>
						{sessions.slice(0, 8).map((s) => (
							<li
								key={s.id}
								className="flex items-center justify-between py-3"
								style={{ borderBottom: "1px solid var(--t-line-soft)" }}
							>
								<span className="truncate pr-3 text-sm">{s.label}</span>
								<span className="triad-mono shrink-0" style={{ letterSpacing: "0.1em" }}>
									{s.minutes}min ·{" "}
									{new Date(s.completedAt).toLocaleDateString("pt-BR", {
										day: "2-digit",
										month: "2-digit",
									})}
								</span>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
}
