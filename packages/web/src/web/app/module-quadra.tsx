import { useState } from "react";
import {
	type Block,
	removeBlock,
	toggleSubtask,
	upsertBlock,
	useTriad,
} from "./store";
import { EmptyState, Field, Sheet } from "./ui";

function emptyBlock(): Block {
	return {
		id: crypto.randomUUID(),
		title: "",
		tags: [],
		subtasks: [
			{ id: crypto.randomUUID(), text: "", done: false },
			{ id: crypto.randomUUID(), text: "", done: false },
			{ id: crypto.randomUUID(), text: "", done: false },
		],
		date: "",
		createdAt: Date.now(),
	};
}

export function QuadraModule() {
	const { blocks } = useTriad();
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<Block>(emptyBlock);
	const [tagInput, setTagInput] = useState("");

	function openNew() {
		setDraft(emptyBlock());
		setTagInput("");
		setOpen(true);
	}
	function openEdit(b: Block) {
		const subtasks = [...b.subtasks];
		while (subtasks.length < 3) subtasks.push({ id: crypto.randomUUID(), text: "", done: false });
		setDraft({ ...b, subtasks });
		setTagInput("");
		setOpen(true);
	}

	function save() {
		const title = draft.title.trim();
		if (!title) return;
		upsertBlock({
			...draft,
			title,
			subtasks: draft.subtasks.filter((s) => s.text.trim()),
		});
		setOpen(false);
	}

	function addTag() {
		const t = tagInput.trim().toLowerCase();
		if (!t || draft.tags.includes(t)) return;
		setDraft({ ...draft, tags: [...draft.tags, t] });
		setTagInput("");
	}

	const doneTotal = blocks.reduce((a, b) => a + b.subtasks.filter((s) => s.done).length, 0);
	const allTotal = blocks.reduce((a, b) => a + b.subtasks.length, 0);

	return (
		<div className="mx-auto w-full max-w-2xl">
			<header className="mb-6 flex items-end justify-between gap-4">
				<div>
					<span className="triad-mono">Vértice · Tarefas</span>
					<h1 className="triad-wordmark mt-2 text-base">Q U A D R A</h1>
				</div>
				<button type="button" className="triad-btn triad-btn-primary" onClick={openNew}>
					+ Novo bloco
				</button>
			</header>

			{blocks.length > 0 && (
				<p className="triad-mono mb-5" style={{ letterSpacing: "0.12em" }}>
					{doneTotal}/{allTotal} concluídas · {blocks.length}{" "}
					{blocks.length === 1 ? "bloco" : "blocos"}
				</p>
			)}

			{blocks.length === 0 ? (
				<EmptyState
					title="Nenhum bloco ainda"
					hint="Cada bloco guarda até três subtarefas. Comece pelo essencial."
				/>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{blocks.map((b) => {
						const done = b.subtasks.filter((s) => s.done).length;
						return (
							<article key={b.id} className="triad-card p-4">
								<div className="mb-2 flex items-start justify-between gap-3">
									<h2 className="triad-display text-lg font-bold">{b.title}</h2>
									<span className="triad-mono shrink-0" style={{ letterSpacing: "0.1em" }}>
										{done}/{b.subtasks.length}
									</span>
								</div>

								{b.tags.length > 0 && (
									<div className="mb-3 flex flex-wrap gap-1.5">
										{b.tags.map((t) => (
											<span
												key={t}
												className="triad-mono rounded px-2 py-0.5"
												style={{
													border: "1px solid var(--t-line)",
													fontSize: "0.62rem",
													letterSpacing: "0.14em",
												}}
											>
												{t}
											</span>
										))}
									</div>
								)}

								<ul className="mb-3">
									{b.subtasks.map((s) => (
										<li key={s.id}>
											<button
												type="button"
												onClick={() => toggleSubtask(b.id, s.id)}
												className="flex w-full items-center gap-3 py-2 text-left"
												style={{ minHeight: 44 }}
											>
												<span
													className="grid size-5 shrink-0 place-items-center rounded-full"
													style={{
														border: "1.5px solid var(--t-ink)",
														background: s.done ? "var(--t-ink)" : "transparent",
													}}
												>
													{s.done && (
														<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
															<path
																d="M4 12.5l5 5L20 6.5"
																stroke="var(--t-on-ink)"
																strokeWidth="3"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													)}
												</span>
												<span
													className="text-sm"
													style={{
														opacity: s.done ? 0.45 : 1,
														textDecoration: s.done ? "line-through" : "none",
													}}
												>
													{s.text}
												</span>
											</button>
										</li>
									))}
								</ul>

								{b.date && (
									<p className="triad-mono mb-3" style={{ letterSpacing: "0.1em" }}>
										{new Date(`${b.date}T00:00:00`).toLocaleDateString("pt-BR")}
									</p>
								)}

								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => openEdit(b)}
										className="triad-btn triad-btn-ghost flex-1"
										style={{ minHeight: 40, padding: "8px 12px" }}
									>
										Editar
									</button>
									<button
										type="button"
										onClick={() => removeBlock(b.id)}
										className="triad-btn triad-btn-ghost"
										style={{ minHeight: 40, padding: "8px 12px" }}
										aria-label={`Remover ${b.title}`}
									>
										Remover
									</button>
								</div>
							</article>
						);
					})}
				</div>
			)}

			<Sheet
				open={open}
				onClose={() => setOpen(false)}
				title={draft.title ? "Editar bloco" : "Novo bloco"}
				footer={
					<>
						<button
							type="button"
							className="triad-btn triad-btn-ghost flex-1"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</button>
						<button
							type="button"
							className="triad-btn triad-btn-primary flex-[2]"
							onClick={save}
							disabled={!draft.title.trim()}
							style={{ opacity: draft.title.trim() ? 1 : 0.45 }}
						>
							Salvar
						</button>
					</>
				}
			>
				<Field label="Nome do bloco">
					<input
						className="triad-input"
						value={draft.title}
						onChange={(e) => setDraft({ ...draft, title: e.target.value })}
						placeholder="Ex: Estudos da semana"
					/>
				</Field>

				<Field label="Tags">
					<input
						className="triad-input"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addTag();
							}
						}}
						placeholder="Digite e pressione Enter"
					/>
				</Field>
				{draft.tags.length > 0 && (
					<div className="-mt-2 mb-5 flex flex-wrap gap-1.5">
						{draft.tags.map((t) => (
							<button
								key={t}
								type="button"
								onClick={() => setDraft({ ...draft, tags: draft.tags.filter((x) => x !== t) })}
								className="triad-mono rounded px-2 py-1"
								style={{ border: "1px solid var(--t-line)", fontSize: "0.62rem" }}
							>
								{t} ×
							</button>
						))}
					</div>
				)}

				<span className="triad-mono mb-1.5 block">Subtarefas (até 3)</span>
				{draft.subtasks.map((s, i) => (
					<input
						key={s.id}
						className="triad-input mb-3"
						value={s.text}
						onChange={(e) => {
							const next = [...draft.subtasks];
							next[i] = { ...s, text: e.target.value };
							setDraft({ ...draft, subtasks: next });
						}}
						placeholder={`Subtarefa ${i + 1}`}
						aria-label={`Subtarefa ${i + 1}`}
					/>
				))}

				<div className="mt-3">
					<Field label="Data (opcional)">
						<input
							className="triad-input"
							type="date"
							value={draft.date ?? ""}
							onChange={(e) => setDraft({ ...draft, date: e.target.value })}
						/>
					</Field>
				</div>
			</Sheet>
		</div>
	);
}
