import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { LoginScreen, OnboardingScreen } from "../app/auth-screens";
import { PrismaModule } from "../app/module-prisma";
import { QuadraModule } from "../app/module-quadra";
import { RadianModule } from "../app/module-radian";
import { SettingsModule } from "../app/module-settings";
import { type ModuleId, hydrate, useTriad } from "../app/store";
import {
	GlyphPrisma,
	GlyphQuadra,
	GlyphRadian,
	GlyphSettings,
	TriadMark,
} from "../app/triad-mark";

type Tab = ModuleId | "settings";

const TABS: { id: Tab; label: string; Glyph: React.ComponentType<{ size?: number }> }[] = [
	{ id: "radian", label: "Foco", Glyph: GlyphRadian },
	{ id: "quadra", label: "Tarefas", Glyph: GlyphQuadra },
	{ id: "prisma", label: "Tempo", Glyph: GlyphPrisma },
	{ id: "settings", label: "Ajustes", Glyph: GlyphSettings },
];

export default function AppPage() {
	const [ready, setReady] = useState(false);
	const state = useTriad();

	useEffect(() => {
		hydrate();
		setReady(true);
	}, []);

	const { user, onboarded, modules } = state;

	// pick the first active module as the default tab
	const firstActive = (["radian", "quadra", "prisma"] as ModuleId[]).find((m) => modules[m]);
	const [tab, setTab] = useState<Tab>("radian");

	useEffect(() => {
		// if the current tab got disabled, fall back to an active one
		if (tab !== "settings" && !modules[tab] && firstActive) setTab(firstActive);
	}, [modules, tab, firstActive]);

	useEffect(() => {
		if (firstActive) setTab((t) => (t === "settings" ? t : firstActive));
		// run once after hydration
	}, [firstActive]);

	if (!ready) {
		return (
			<div className="triad-root grid min-h-dvh place-items-center">
				<div style={{ color: "var(--t-ink)", opacity: 0.35 }}>
					<TriadMark size={64} />
				</div>
			</div>
		);
	}

	if (!user) return <LoginScreen />;
	if (!onboarded) return <OnboardingScreen userName={user.name} />;

	const visible = TABS.filter((t) => t.id === "settings" || modules[t.id as ModuleId]);
	const hour = new Date().getHours();
	const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

	return (
		<div className="triad-root">
			{/* header */}
			<header
				className="sticky top-0 z-30 flex items-center justify-between px-5 py-4"
				style={{
					background: "color-mix(in srgb, var(--t-paper) 88%, transparent)",
					backdropFilter: "blur(14px)",
					borderBottom: "1px solid var(--t-line)",
					paddingTop: "max(16px, env(safe-area-inset-top))",
				}}
			>
				<div className="flex items-center gap-3">
					<span style={{ color: "var(--t-ink)" }}>
						<TriadMark size={30} animate={false} />
					</span>
					<div className="leading-tight">
						<span className="triad-wordmark block text-[0.7rem]">T R I A D</span>
						<span className="text-xs" style={{ color: "var(--t-muted)" }}>
							{greeting}, {user.name}
						</span>
					</div>
				</div>
				<Link
					href="/"
					className="triad-mono px-2 py-2"
					style={{ minHeight: 44, display: "grid", placeItems: "center" }}
				>
					Site
				</Link>
			</header>

			{/* content */}
			<main className="triad-scroll px-5 pt-7">
				<AnimatePresence mode="wait">
					<motion.div
						key={tab}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
					>
						{tab === "radian" && <RadianModule />}
						{tab === "quadra" && <QuadraModule />}
						{tab === "prisma" && <PrismaModule />}
						{tab === "settings" && <SettingsModule />}
					</motion.div>
				</AnimatePresence>
			</main>

			{/* bottom nav — only active modules */}
			<nav className="triad-nav" aria-label="Navegação principal">
				<ul className="mx-auto flex max-w-lg">
					{visible.map(({ id, label, Glyph }) => {
						const active = tab === id;
						return (
							<li key={id} className="flex-1">
								<button
									type="button"
									onClick={() => setTab(id)}
									className="flex w-full flex-col items-center gap-1 py-3"
									style={{
										minHeight: 56,
										color: "var(--t-ink)",
										opacity: active ? 1 : 0.42,
									}}
									aria-current={active ? "page" : undefined}
								>
									<Glyph size={22} />
									<span
										className="triad-mono"
										style={{ fontSize: "0.58rem", color: "inherit", letterSpacing: "0.16em" }}
									>
										{label}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
