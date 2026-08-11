import { motion } from "motion/react";
import { useState } from "react";
import {
	type ModuleId,
	MODULE_META,
	type Modules,
	completeOnboarding,
	signIn,
} from "./store";
import { GlyphPrisma, GlyphQuadra, GlyphRadian, TriadMark } from "./triad-mark";
import { Field, Toggle } from "./ui";

/* ---------------------------------- login --------------------------------- */

export function LoginScreen() {
	const [mode, setMode] = useState<"login" | "register">("register");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
			setError("Preencha todos os campos.");
			return;
		}
		setError("");
		signIn(mode === "register" ? name : email.split("@")[0], email);
	}

	return (
		<div className="triad-root grid min-h-dvh place-items-center px-6 py-12">
			<motion.div
				className="w-full max-w-sm"
				initial={{ opacity: 0, y: 18 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				<div className="mb-8 flex flex-col items-center text-center">
					<div style={{ color: "var(--t-ink)" }}>
						<TriadMark size={88} />
					</div>
					<h1 className="triad-wordmark mt-5 text-lg">T R I A D</h1>
					<p className="mt-2 text-sm" style={{ color: "var(--t-muted)" }}>
						Três vértices. Um sistema.
					</p>
				</div>

				<form onSubmit={submit} noValidate>
					{mode === "register" && (
						<Field label="Como quer ser chamado">
							<input
								className="triad-input"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Seu nome"
								autoComplete="given-name"
							/>
						</Field>
					)}
					<Field label="E-mail">
						<input
							className="triad-input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="voce@email.com"
							autoComplete="email"
						/>
					</Field>
					<Field label="Senha">
						<input
							className="triad-input"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							autoComplete={mode === "register" ? "new-password" : "current-password"}
						/>
					</Field>

					{error && (
						<p className="mb-4 text-sm" style={{ color: "var(--t-ink)" }} role="alert">
							{error}
						</p>
					)}

					<button type="submit" className="triad-btn triad-btn-primary w-full">
						{mode === "register" ? "Criar conta" : "Entrar"}
					</button>
				</form>

				<button
					type="button"
					onClick={() => {
						setMode(mode === "login" ? "register" : "login");
						setError("");
					}}
					className="triad-mono mt-6 w-full py-2 text-center"
					style={{ minHeight: 44 }}
				>
					{mode === "login" ? "Criar uma conta" : "Já tenho conta"}
				</button>

				<p className="mt-6 text-center text-xs" style={{ color: "var(--t-muted)" }}>
					Seus dados ficam salvos apenas neste dispositivo.
				</p>
			</motion.div>
		</div>
	);
}

/* ------------------------------- onboarding ------------------------------- */

const GLYPHS: Record<ModuleId, React.ComponentType<{ size?: number }>> = {
	radian: GlyphRadian,
	quadra: GlyphQuadra,
	prisma: GlyphPrisma,
};

export function OnboardingScreen({ userName }: { userName: string }) {
	const [step, setStep] = useState(0);
	const [name, setName] = useState(userName);
	const [modules, setLocalModules] = useState<Modules>({
		radian: true,
		quadra: true,
		prisma: true,
	});

	const ids: ModuleId[] = ["radian", "quadra", "prisma"];
	const activeCount = ids.filter((i) => modules[i]).length;

	function toggle(id: ModuleId) {
		const next = { ...modules, [id]: !modules[id] };
		if (!Object.values(next).some(Boolean)) return;
		setLocalModules(next);
	}

	return (
		<div className="triad-root min-h-dvh px-6 py-12">
			<div className="mx-auto w-full max-w-md">
				{step === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="pt-8"
					>
						<div className="mb-8 flex justify-center" style={{ color: "var(--t-ink)" }}>
							<TriadMark size={96} />
						</div>
						<span className="triad-mono">Bem-vindo</span>
						<h1 className="triad-display mt-3 text-3xl font-extrabold sm:text-4xl">
							Como quer ser chamado?
						</h1>
						<p className="mt-3 mb-8 text-sm" style={{ color: "var(--t-muted)" }}>
							É assim que o TRIAD vai te chamar.
						</p>
						<Field label="Seu nome">
							<input
								className="triad-input"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Seu nome"
							/>
						</Field>
						<button
							type="button"
							className="triad-btn triad-btn-primary mt-4 w-full"
							onClick={() => setStep(1)}
							disabled={!name.trim()}
							style={{ opacity: name.trim() ? 1 : 0.45 }}
						>
							Continuar
						</button>
					</motion.div>
				)}

				{step === 1 && (
					<motion.div
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="pt-8"
					>
						<span className="triad-mono">Passo 2 de 2</span>
						<h1 className="triad-display mt-3 text-3xl font-extrabold sm:text-4xl">
							Escolha seus vértices
						</h1>
						<p className="mt-3 mb-7 text-sm" style={{ color: "var(--t-muted)" }}>
							Ative só o que faz sentido pra você. Dá pra mudar depois nas configurações — e nada
							é perdido ao desativar.
						</p>

						<div className="flex flex-col gap-3">
							{ids.map((id) => {
								const Glyph = GLYPHS[id];
								const meta = MODULE_META[id];
								const on = modules[id];
								const isLast = on && activeCount === 1;
								return (
									<div
										key={id}
										className="triad-card flex items-center gap-4 p-4"
										style={{ opacity: on ? 1 : 0.55 }}
									>
										<span style={{ color: "var(--t-ink)" }}>
											<Glyph size={26} />
										</span>
										<div className="min-w-0 flex-1">
											<div className="triad-wordmark text-[0.72rem]">{meta.wordmark}</div>
											<p className="mt-1 text-xs" style={{ color: "var(--t-muted)" }}>
												{meta.desc}
											</p>
										</div>
										<Toggle
											checked={on}
											onChange={() => toggle(id)}
											label={`Ativar ${meta.name}`}
											disabled={isLast}
										/>
									</div>
								);
							})}
						</div>

						<p className="triad-mono mt-4" style={{ letterSpacing: "0.12em" }}>
							{activeCount} {activeCount === 1 ? "vértice ativo" : "vértices ativos"}
						</p>

						<div className="mt-7 flex gap-3">
							<button
								type="button"
								className="triad-btn triad-btn-ghost flex-1"
								onClick={() => setStep(0)}
							>
								Voltar
							</button>
							<button
								type="button"
								className="triad-btn triad-btn-primary flex-[2]"
								onClick={() => completeOnboarding(modules, name)}
							>
								Começar
							</button>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
