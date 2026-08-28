import { useMemo, useState } from "react";
import {
	type CalEvent,
	type Entry,
	formatBRL,
	removeEntry,
	removeEvent,
	todayISO,
	upsertEntry,
	upsertEvent,
	useTriad,
} from "./store";
import { EmptyState, Field, Sheet, StatCard } from "./ui";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const CATEGORIES = ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Renda", "Outros"];

function monthMatrix(year: number, month: number) {
	const first = new Date(year, month, 1);
	const start = new Date(first);
	start.setDate(1 - first.getDay());
	return Array.from({ length: 42 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		return d;
	});
}

function iso(d: Date) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function PrismaModule() {
	const { events, entries } = useTriad();
	const [cursor, setCursor] = useState(() => new Date());
	const [tab, setTab] = useState<"cal" | "money">("cal");
	const [selected, setSelected] = useState<string | null>(null);
	const [evOpen, setEvOpen] = useState(false);
	const [enOpen, setEnOpen] = useState(false);

	const [evDraft, setEvDraft] = useState<CalEvent>({ id: "", title: "", date: todayISO() });
	const [enDraft, setEnDraft] = useState<Entry>({
		id: "",
		label: "",
		amount: 0,
		category: "Outros",
		date: todayISO(),
	});
	const [amountText, setAmountText] = useState("");
	const [isExpense, setIsExpense] = useState(true);

	const y = cursor.getFullYear();
	const m = cursor.getMonth();
	const cells = useMemo(() => monthMatrix(y, m), [y, m]);
	const monthKey = `${y}-${String(m + 1).padStart(2, "0")}`;

	const monthEntries = entries.filter((e) => e.date.startsWith(monthKey));
	const income = monthEntries.filter((e) => e.amount > 0).reduce((a, e) => a + e.amount, 0);
	const expense = monthEntries.filter((e) => e.amount < 0).reduce((a, e) => a + e.amount, 0);
	const balance = income + expense;

	const dayEvents = selected ? events.filter((e) => e.date === selected) : [];
	const dayEntries = selected ? entries.filter((e) => e.date === selected) : [];

	function openNewEvent(date: string) {
		setEvDraft({ id: crypto.randomUUID(), title: "", date, time: "", note: "" });
		setEvOpen(true);
	}
	function openNewEntry(date: string) {
		setEnDraft({ id: crypto.randomUUID(), label: "", amount: 0, category: "Outros", date });
		setAmountText("");
		setIsExpense(true);
		setEnOpen(true);
	}
	function saveEvent() {
		if (!evDraft.title.trim()) return;
		upsertEvent({ ...evDraft, title: evDraft.title.trim() });
		setEvOpen(false);
	}
	function saveEntry() {
		const val = Number.parseFloat(amountText.replace(",", "."));
		if (!enDraft.label.trim() || Number.isNaN(val) || val === 0) return;
		upsertEntry({
			...enDraft,
			label: enDraft.label.trim(),
			amount: isExpense ? -Math.abs(val) : Math.abs(val),
		});
		setEnOpen(false);
	}

	return (
		<div className="mx-auto w-full max-w-2xl">
			<header className="mb-5">
				<span className="triad-mono">Vértice · Tempo & Dinheiro</span>
				<h1 className="triad-wordmark mt-2 text-base">P R I S M A</h1>
			</header>

			<div className="mb-6 flex gap-2">
				{(
					[
						["cal", "Calendário"],
						["money", "Orçamento"],
					] as const
				).map(([k, l]) => (
					<button
						key={k}
						type="button"
						onClick={() => setTab(k)}
						className="triad-btn flex-1"
						style={{
							background: tab === k ? "var(--t-ink)" : "transparent",
							color: tab === k ? "var(--t-on-ink)" : "var(--t-ink)",
							borderColor: tab === k ? "transparent" : "var(--t-line)",
						}}
						aria-pressed={tab === k}
					>
						{l}
					</button>
				))}
			</div>

			{tab === "cal" ? (
				<>
					<div className="mb-4 flex items-center justify-between">
						<button
							type="button"
							onClick={() => setCursor(new Date(y, m - 1, 1))}
							className="grid size-11 place-items-center rounded-md"
							aria-label="Mês anterior"
							style={{ color: "var(--t-ink)" }}
						>
							‹
						</button>
						<span className="triad-display text-lg font-bold first-letter:uppercase">
							{cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
						</span>
						<button
							type="button"
							onClick={() => setCursor(new Date(y, m + 1, 1))}
							className="grid size-11 place-items-center rounded-md"
							aria-label="Próximo mês"
							style={{ color: "var(--t-ink)" }}
						>
							›
						</button>
					</div>

					<div className="grid grid-cols-7 gap-px">
						{WEEKDAYS.map((d, i) => (
							<div key={`${d}-${i}`} className="triad-mono pb-2 text-center">
								{d}
							</div>
						))}
						{cells.map((d) => {
							const key = iso(d);
							const inMonth = d.getMonth() === m;
							const isToday = key === todayISO();
							const hasEv = events.some((e) => e.date === key);
							const hasEn = entries.some((e) => e.date === key);
							return (
								<button
									key={key}
									type="button"
									onClick={() => setSelected(key)}
									className="relative grid aspect-square place-items-center text-sm"
									style={{
										minHeight: 44,
										opacity: inMonth ? 1 : 0.28,
										border: "1px solid var(--t-line-soft)",
										background: isToday ? "var(--t-ink)" : "transparent",
										color: isToday ? "var(--t-on-ink)" : "var(--t-ink)",
									}}
									aria-label={`Dia ${d.getDate()}`}
								>
									{d.getDate()}
									<span className="absolute bottom-1 flex gap-0.5">
										{hasEv && (
											<span
												className="block size-1 rounded-full"
												style={{ background: isToday ? "var(--t-on-ink)" : "var(--t-ink)" }}
											/>
										)}
										{hasEn && (
											<span
												className="block h-1 w-2"
												style={{ background: isToday ? "var(--t-on-ink)" : "var(--t-muted)" }}
											/>
										)}
									</span>
								</button>
							);
						})}
					</div>
					<p className="triad-mono mt-4" style={{ letterSpacing: "0.1em" }}>
						● evento &nbsp; ▬ lançamento
					</p>
				</>
			) : (
				<>
					<div className="mb-5 grid grid-cols-3 gap-3">
						<StatCard label="Entradas" value={formatBRL(income)} />
						<StatCard label="Saídas" value={formatBRL(Math.abs(expense))} />
						<StatCard label="Saldo" value={formatBRL(balance)} />
					</div>

					<div className="mb-4 flex justify-end">
						<button
							type="button"
							className="triad-btn triad-btn-primary"
							onClick={() => openNewEntry(todayISO())}
						>
							+ Lançamento
						</button>
					</div>

					{monthEntries.length === 0 ? (
						<EmptyState
							title="Nenhum lançamento no mês"
							hint="Registre entradas e saídas para ver o saldo se formar."
						/>
					) : (
						<ul>
							{monthEntries.map((e) => (
								<li
									key={e.id}
									className="flex items-center justify-between gap-3 py-3"
									style={{ borderBottom: "1px solid var(--t-line-soft)" }}
								>
									<div className="min-w-0">
										<p className="truncate text-sm">{e.label}</p>
										<span className="triad-mono" style={{ letterSpacing: "0.1em" }}>
											{e.category} ·{" "}
											{new Date(`${e.date}T00:00:00`).toLocaleDateString("pt-BR", {
												day: "2-digit",
												month: "2-digit",
											})}
										</span>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<span
											className="triad-display font-bold tabular-nums"
											style={{ textDecoration: e.amount < 0 ? "none" : "underline" }}
										>
											{formatBRL(e.amount)}
										</span>
										<button
											type="button"
											onClick={() => removeEntry(e.id)}
											className="grid size-11 place-items-center"
											aria-label={`Remover ${e.label}`}
											style={{ color: "var(--t-muted)" }}
										>
											×
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</>
			)}

			{/* day detail sheet */}
			<Sheet
				open={selected !== null}
				onClose={() => setSelected(null)}
				title={
					selected
						? new Date(`${selected}T00:00:00`).toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "long",
							})
						: ""
				}
				footer={
					<>
						<button
							type="button"
							className="triad-btn triad-btn-ghost flex-1"
							onClick={() => selected && openNewEntry(selected)}
						>
							+ Lançamento
						</button>
						<button
							type="button"
							className="triad-btn triad-btn-primary flex-1"
							onClick={() => selected && openNewEvent(selected)}
						>
							+ Evento
						</button>
					</>
				}
			>
				{dayEvents.length === 0 && dayEntries.length === 0 && (
					<p className="text-sm" style={{ color: "var(--t-muted)" }}>
						Nada registrado neste dia.
					</p>
				)}
				{dayEvents.map((e) => (
					<div
						key={e.id}
						className="flex items-start justify-between gap-3 py-3"
						style={{ borderBottom: "1px solid var(--t-line-soft)" }}
					>
						<div>
							<p className="text-sm">{e.title}</p>
							{e.time && (
								<span className="triad-mono" style={{ letterSpacing: "0.1em" }}>
									{e.time}
								</span>
							)}
							{e.note && (
								<p className="mt-1 text-xs" style={{ color: "var(--t-muted)" }}>
									{e.note}
								</p>
							)}
						</div>
						<button
							type="button"
							onClick={() => removeEvent(e.id)}
							className="grid size-11 shrink-0 place-items-center"
							aria-label={`Remover ${e.title}`}
							style={{ color: "var(--t-muted)" }}
						>
							×
						</button>
					</div>
				))}
				{dayEntries.map((e) => (
					<div
						key={e.id}
						className="flex items-center justify-between gap-3 py-3"
						style={{ borderBottom: "1px solid var(--t-line-soft)" }}
					>
						<div>
							<p className="text-sm">{e.label}</p>
							<span className="triad-mono" style={{ letterSpacing: "0.1em" }}>
								{e.category}
							</span>
						</div>
						<span className="triad-display shrink-0 font-bold tabular-nums">
							{formatBRL(e.amount)}
						</span>
					</div>
				))}
			</Sheet>

			{/* new event */}
			<Sheet
				open={evOpen}
				onClose={() => setEvOpen(false)}
				title="Novo evento"
				footer={
					<>
						<button
							type="button"
							className="triad-btn triad-btn-ghost flex-1"
							onClick={() => setEvOpen(false)}
						>
							Cancelar
						</button>
						<button type="button" className="triad-btn triad-btn-primary flex-[2]" onClick={saveEvent}>
							Salvar
						</button>
					</>
				}
			>
				<Field label="Título">
					<input
						className="triad-input"
						value={evDraft.title}
						onChange={(e) => setEvDraft({ ...evDraft, title: e.target.value })}
						placeholder="Ex: Consulta"
					/>
				</Field>
				<Field label="Data">
					<input
						className="triad-input"
						type="date"
						value={evDraft.date}
						onChange={(e) => setEvDraft({ ...evDraft, date: e.target.value })}
					/>
				</Field>
				<Field label="Hora (opcional)">
					<input
						className="triad-input"
						type="time"
						value={evDraft.time ?? ""}
						onChange={(e) => setEvDraft({ ...evDraft, time: e.target.value })}
					/>
				</Field>
				<Field label="Nota (opcional)">
					<input
						className="triad-input"
						value={evDraft.note ?? ""}
						onChange={(e) => setEvDraft({ ...evDraft, note: e.target.value })}
						placeholder="Detalhes"
					/>
				</Field>
			</Sheet>

			{/* new entry */}
			<Sheet
				open={enOpen}
				onClose={() => setEnOpen(false)}
				title="Novo lançamento"
				footer={
					<>
						<button
							type="button"
							className="triad-btn triad-btn-ghost flex-1"
							onClick={() => setEnOpen(false)}
						>
							Cancelar
						</button>
						<button type="button" className="triad-btn triad-btn-primary flex-[2]" onClick={saveEntry}>
							Salvar
						</button>
					</>
				}
			>
				<div className="mb-5 flex gap-2">
					{(
						[
							[true, "Saída"],
							[false, "Entrada"],
						] as const
					).map(([exp, l]) => (
						<button
							key={l}
							type="button"
							onClick={() => setIsExpense(exp)}
							className="triad-btn flex-1"
							style={{
								background: isExpense === exp ? "var(--t-ink)" : "transparent",
								color: isExpense === exp ? "var(--t-on-ink)" : "var(--t-ink)",
								borderColor: isExpense === exp ? "transparent" : "var(--t-line)",
							}}
							aria-pressed={isExpense === exp}
						>
							{l}
						</button>
					))}
				</div>
				<Field label="Descrição">
					<input
						className="triad-input"
						value={enDraft.label}
						onChange={(e) => setEnDraft({ ...enDraft, label: e.target.value })}
						placeholder="Ex: Mercado"
					/>
				</Field>
				<Field label="Valor (R$)">
					<input
						className="triad-input"
						inputMode="decimal"
						value={amountText}
						onChange={(e) => setAmountText(e.target.value)}
						placeholder="0,00"
					/>
				</Field>
				<Field label="Categoria">
					<select
						className="triad-input"
						value={enDraft.category}
						onChange={(e) => setEnDraft({ ...enDraft, category: e.target.value })}
						style={{ background: "var(--t-paper)" }}
					>
						{CATEGORIES.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</Field>
				<Field label="Data">
					<input
						className="triad-input"
						type="date"
						value={enDraft.date}
						onChange={(e) => setEnDraft({ ...enDraft, date: e.target.value })}
					/>
				</Field>
			</Sheet>
		</div>
	);
}
