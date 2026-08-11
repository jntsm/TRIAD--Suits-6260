import { useCallback, useEffect, useSyncExternalStore } from "react";

/* ---------------------------------- types --------------------------------- */

export type ModuleId = "radian" | "quadra" | "prisma";

export type TriadUser = { name: string; email: string; createdAt: number };
export type Modules = Record<ModuleId, boolean>;
export type Theme = "light" | "dark";

export type Session = {
	id: string;
	label: string;
	minutes: number;
	completedAt: number;
};

export type Subtask = { id: string; text: string; done: boolean };
export type Block = {
	id: string;
	title: string;
	tags: string[];
	subtasks: Subtask[];
	date?: string;
	createdAt: number;
};

export type CalEvent = {
	id: string;
	title: string;
	date: string; // YYYY-MM-DD
	time?: string;
	note?: string;
};

export type Entry = {
	id: string;
	label: string;
	amount: number; // positive = income, negative = expense
	category: string;
	date: string; // YYYY-MM-DD
};

/* --------------------------------- storage -------------------------------- */

const KEYS = {
	user: "triad:user",
	modules: "triad:modules",
	theme: "triad:theme",
	onboarded: "triad:onboarded",
	radian: "triad:radian",
	quadra: "triad:quadra",
	prisma: "triad:prisma",
} as const;

function read<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function write(key: string, value: unknown) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* quota / private mode — ignore */
	}
}

/* ------------------------------ tiny store -------------------------------- */

const listeners = new Set<() => void>();
function emit() {
	for (const l of listeners) l();
}
function subscribe(cb: () => void) {
	listeners.add(cb);
	return () => listeners.delete(cb);
}

export const DEFAULT_MODULES: Modules = { radian: true, quadra: true, prisma: true };

type State = {
	user: TriadUser | null;
	modules: Modules;
	theme: Theme;
	onboarded: boolean;
	sessions: Session[];
	blocks: Block[];
	events: CalEvent[];
	entries: Entry[];
};

let state: State = {
	user: null,
	modules: DEFAULT_MODULES,
	theme: "light",
	onboarded: false,
	sessions: [],
	blocks: [],
	events: [],
	entries: [],
};

let hydrated = false;

export function hydrate() {
	if (hydrated || typeof window === "undefined") return;
	hydrated = true;
	state = {
		user: read<TriadUser | null>(KEYS.user, null),
		modules: { ...DEFAULT_MODULES, ...read<Partial<Modules>>(KEYS.modules, {}) },
		theme: read<Theme>(KEYS.theme, "light"),
		onboarded: read<boolean>(KEYS.onboarded, false),
		sessions: read<Session[]>(KEYS.radian, []),
		blocks: read<Block[]>(KEYS.quadra, []),
		events: read<{ events: CalEvent[]; entries: Entry[] }>(KEYS.prisma, { events: [], entries: [] }).events,
		entries: read<{ events: CalEvent[]; entries: Entry[] }>(KEYS.prisma, { events: [], entries: [] }).entries,
	};
	applyTheme(state.theme);
	emit();
}

function set(patch: Partial<State>) {
	state = { ...state, ...patch };
	emit();
}

function getSnapshot() {
	return state;
}

export function useTriad() {
	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* --------------------------------- theme ---------------------------------- */

export function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;
	document.documentElement.setAttribute("data-triad-theme", theme);
}

export function setTheme(theme: Theme) {
	write(KEYS.theme, theme);
	applyTheme(theme);
	set({ theme });
}

/* ---------------------------------- auth ---------------------------------- */

export function signIn(name: string, email: string) {
	const user: TriadUser = { name: name.trim(), email: email.trim(), createdAt: Date.now() };
	write(KEYS.user, user);
	set({ user });
	return user;
}

export function signOut() {
	try {
		window.localStorage.removeItem(KEYS.user);
	} catch {
		/* ignore */
	}
	set({ user: null });
}

export function setUserName(name: string) {
	if (!state.user) return;
	const user = { ...state.user, name: name.trim() };
	write(KEYS.user, user);
	set({ user });
}

/* -------------------------------- modules --------------------------------- */

export function setModules(modules: Modules) {
	// never allow zero active modules
	const anyActive = Object.values(modules).some(Boolean);
	const next = anyActive ? modules : DEFAULT_MODULES;
	write(KEYS.modules, next);
	set({ modules: next });
}

export function toggleModule(id: ModuleId) {
	const next = { ...state.modules, [id]: !state.modules[id] };
	if (!Object.values(next).some(Boolean)) return; // keep at least one
	setModules(next);
}

export function completeOnboarding(modules: Modules, name?: string) {
	setModules(modules);
	if (name && state.user) setUserName(name);
	write(KEYS.onboarded, true);
	set({ onboarded: true });
}

/* --------------------------------- radian --------------------------------- */

function persistRadian(sessions: Session[]) {
	write(KEYS.radian, sessions);
	set({ sessions });
}

export function addSession(label: string, minutes: number) {
	persistRadian([
		{ id: crypto.randomUUID(), label: label || "Sessão", minutes, completedAt: Date.now() },
		...state.sessions,
	]);
}

export function clearSessions() {
	persistRadian([]);
}

/* --------------------------------- quadra --------------------------------- */

function persistQuadra(blocks: Block[]) {
	write(KEYS.quadra, blocks);
	set({ blocks });
}

export function upsertBlock(block: Block) {
	const exists = state.blocks.some((b) => b.id === block.id);
	persistQuadra(exists ? state.blocks.map((b) => (b.id === block.id ? block : b)) : [block, ...state.blocks]);
}

export function removeBlock(id: string) {
	persistQuadra(state.blocks.filter((b) => b.id !== id));
}

export function toggleSubtask(blockId: string, subtaskId: string) {
	persistQuadra(
		state.blocks.map((b) =>
			b.id === blockId
				? { ...b, subtasks: b.subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)) }
				: b,
		),
	);
}

/* --------------------------------- prisma --------------------------------- */

function persistPrisma(events: CalEvent[], entries: Entry[]) {
	write(KEYS.prisma, { events, entries });
	set({ events, entries });
}

export function upsertEvent(ev: CalEvent) {
	const exists = state.events.some((e) => e.id === ev.id);
	persistPrisma(exists ? state.events.map((e) => (e.id === ev.id ? ev : e)) : [ev, ...state.events], state.entries);
}

export function removeEvent(id: string) {
	persistPrisma(
		state.events.filter((e) => e.id !== id),
		state.entries,
	);
}

export function upsertEntry(en: Entry) {
	const exists = state.entries.some((e) => e.id === en.id);
	persistPrisma(state.events, exists ? state.entries.map((e) => (e.id === en.id ? en : e)) : [en, ...state.entries]);
}

export function removeEntry(id: string) {
	persistPrisma(
		state.events,
		state.entries.filter((e) => e.id !== id),
	);
}

/* --------------------------------- helpers -------------------------------- */

export const MODULE_META: Record<ModuleId, { name: string; wordmark: string; tagline: string; desc: string }> = {
	radian: {
		name: "Radian",
		wordmark: "R A D I A N",
		tagline: "Foco medido em círculos.",
		desc: "Timer de foco com sessões, streak e estatísticas.",
	},
	quadra: {
		name: "Quadra",
		wordmark: "Q U A D R A",
		tagline: "O essencial, em blocos.",
		desc: "To-do em blocos com até 3 subtarefas e tags.",
	},
	prisma: {
		name: "Prisma",
		wordmark: "P R I S M A",
		tagline: "Um feixe que se decompõe.",
		desc: "Calendário e orçamento na mesma visão.",
	},
};

/** Streak of consecutive days with at least one completed session. */
export function computeStreak(sessions: Session[]): number {
	if (sessions.length === 0) return 0;
	const days = new Set(sessions.map((s) => new Date(s.completedAt).toDateString()));
	let streak = 0;
	const cursor = new Date();
	// allow today to be empty and still count yesterday's streak
	if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
	while (days.has(cursor.toDateString())) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}
	return streak;
}

export function useHydrated() {
	useEffect(() => {
		hydrate();
	}, []);
	return useTriad();
}

export function useToggleTheme() {
	const { theme } = useTriad();
	return useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme]);
}

export function todayISO() {
	return new Date().toISOString().slice(0, 10);
}

export function formatBRL(n: number) {
	return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
