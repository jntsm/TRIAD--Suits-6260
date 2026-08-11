import { useState } from "react";
import {
	type ModuleId,
	MODULE_META,
	setUserName,
	signOut,
	toggleModule,
	useToggleTheme,
	useTriad,
} from "./store";
import { GlyphPrisma, GlyphQuadra, GlyphRadian } from "./triad-mark";
import { Field, Toggle } from "./ui";

const GLYPHS: Record<ModuleId, React.ComponentType<{ size?: number }>> = {
	radian: GlyphRadian,
	quadra: GlyphQuadra,
	prisma: GlyphPrisma,
};

export function SettingsModule() {
	const { user, modules, theme, sessions, blocks, events, entries } = useTriad();
	const toggleTheme = useToggleTheme();
	const [name, setName] = useState(user?.name ?? "");

	const ids: ModuleId[] = ["radian", "quadra", "prisma"];
	const activeCount = ids.filter((i) => modules[i]).length;

	const counts: Record<ModuleId, string> = {
		radian: `${sessions.length} ${sessions.length === 1 ? "sessão" : "sessões"}`,
		quadra: `${blocks.length} ${blocks.length === 1 ? "bloco" : "blocos"}`,
		prisma: `${events.length + entries.length} registros`,
	};

	return (
		<div className="mx-auto w-full max-w-lg">
			<header className="mb-7">
				<span className="triad-mono">Ajustes</span>
				<h1 className="triad-display mt-2 text-2xl font-extrabold">Configurações</h1>
			</header>

			{/* modules */}
			<section className="mb-9">
				<h2 className="triad-mono mb-1">Vértices</h2>
				<p className="mb-4 text-xs" style={{ color: "var(--t-muted)" }}>
					Desative o que não faz sentido pra você. Os dados continuam salvos e voltam ao reativar.
				</p>

				<div className="flex flex-col gap-3">
					{ids.map((id) => {
						const Glyph = GLYPHS[id];
						const meta = MODULE_META[id];
						const on = modules[id];
						const isLast = on && activeCount === 1;
						return (
							<div key={id} className="triad-card flex items-center gap-4 p-4">
								<span style={{ color: "var(--t-ink)", opacity: on ? 1 : 0.4 }}>
									<Glyph size={26} />
								</span>
								<div className="min-w-0 flex-1" style={{ opacity: on ? 1 : 0.55 }}>
									<div className="triad-wordmark text-[0.7rem]">{meta.wordmark}</div>
									<p className="mt-1 text-xs" style={{ color: "var(--t-muted)" }}>
										{on ? meta.desc : `Desativado · ${counts[id]} preservados`}
									</p>
								</div>
								<Toggle
									checked={on}
									onChange={() => toggleModule(id)}
									label={`Ativar ${meta.name}`}
									disabled={isLast}
								/>
							</div>
						);
					})}
				</div>

				{activeCount === 1 && (
					<p className="mt-3 text-xs" style={{ color: "var(--t-muted)" }}>
						Pelo menos um vértice precisa ficar ativo.
					</p>
				)}
			</section>

			{/* appearance */}
			<section className="mb-9">
				<h2 className="triad-mono mb-4">Aparência</h2>
				<div className="triad-card flex items-center justify-between p-4">
					<div>
						<p className="text-sm">Modo escuro</p>
						<p className="mt-0.5 text-xs" style={{ color: "var(--t-muted)" }}>
							{theme === "dark" ? "Ativado" : "Desativado"}
						</p>
					</div>
					<Toggle checked={theme === "dark"} onChange={toggleTheme} label="Modo escuro" />
				</div>
			</section>

			{/* profile */}
			<section className="mb-9">
				<h2 className="triad-mono mb-4">Perfil</h2>
				<Field label="Como quer ser chamado">
					<input
						className="triad-input"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onBlur={() => name.trim() && setUserName(name)}
						placeholder="Seu nome"
					/>
				</Field>
				{user?.email && (
					<p className="triad-mono" style={{ letterSpacing: "0.1em" }}>
						{user.email}
					</p>
				)}
			</section>

			<button type="button" className="triad-btn triad-btn-ghost w-full" onClick={signOut}>
				Sair
			</button>

			<p className="mt-8 text-center text-xs" style={{ color: "var(--t-muted)" }}>
				TRIAD · Três vértices. Um sistema.
				<br />
				Dados salvos apenas neste dispositivo.
			</p>
		</div>
	);
}
