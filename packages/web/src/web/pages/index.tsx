import { motion } from "motion/react";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Nav } from "../components/nav";
import { Reveal } from "../components/reveal";
import { Faq } from "../components/faq";
import { RadianMark, QuadraMark, PrismaMark, MiniMark } from "../components/marks";

/* ---------- Hero ---------- */
function Hero() {
  const words = ["Três", "formas.", "Um", "sistema."];
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-[56px]">
      <div className="pointer-events-none absolute inset-0 su-grid opacity-[0.5]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      <div className="relative mx-auto flex min-h-[86vh] max-w-[1200px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <motion.span
          className="mono-label mb-8 text-[var(--su-muted)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Geometric · Minimal
        </motion.span>

        <h1 className="font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight-display text-ink">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="mr-[0.28em] inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-8 max-w-[560px] text-[1.25rem] font-light leading-relaxed text-[var(--su-muted)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Radian, Quadra e Prisma. Três apps monocromáticos que
          organizam seu foco, suas tarefas e seu tempo — numa só linguagem.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          <a
            href="#radian"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-paper transition-transform active:scale-[0.96]"
          >
            Conhecer os apps
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#sobre"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--su-line)] px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-black/[0.03]"
          >
            A filosofia
          </a>
        </motion.div>

        {/* mini shape trio */}
        <motion.div
          className="mt-16 flex items-center gap-6 text-ink/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <MiniMark shape="circle" size={22} />
          <span className="h-px w-8 bg-[var(--su-line)]" />
          <MiniMark shape="square" size={22} />
          <span className="h-px w-8 bg-[var(--su-line)]" />
          <MiniMark shape="triangle" size={22} />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- App tile ---------- */
type Tone = "light" | "dark" | "parchment";

type AppTileProps = {
  id: string;
  index: string;
  name: string;
  role: string;
  headline: string;
  tagline: string;
  points: string[];
  tone: Tone;
  mark: React.ReactNode;
  reverse?: boolean;
};

function AppTile({ id, index, name, role, headline, tagline, points, tone, mark, reverse }: AppTileProps) {
  const dark = tone === "dark";
  const bg = tone === "dark" ? "bg-ink-soft" : tone === "parchment" ? "bg-paper-2" : "bg-paper";
  const textMain = dark ? "text-paper" : "text-ink";
  const textMuted = dark ? "text-[var(--su-muted-dark)]" : "text-[var(--su-muted)]";
  const border = dark ? "border-[var(--su-line-dark)]" : "border-[var(--su-line)]";
  const btnPrimary = dark
    ? "bg-paper text-ink"
    : "bg-ink text-paper";
  const btnGhost = dark
    ? "border-[var(--su-line-dark)] text-paper hover:bg-white/[0.06]"
    : "border-[var(--su-line)] text-ink hover:bg-black/[0.03]";

  return (
    <section id={id} className={`relative overflow-hidden ${bg}`}>
      <div className={`pointer-events-none absolute inset-0 ${dark ? "su-grid-dark" : "su-grid"} opacity-40`} />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-2 md:gap-8 md:py-32 lg:py-36">
        {/* copy */}
        <div className={reverse ? "md:order-2" : ""}>
          <Reveal>
            <div className={`mono-label mb-5 ${textMuted}`}>
              {index} — {role}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className={`font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[0.98] ${textMain}`}
              style={{ letterSpacing: "0.14em" }}
            >
              {name}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={`mt-5 max-w-[440px] text-[1.35rem] font-light leading-snug ${textMain}`}>
              {headline}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`mt-4 max-w-[420px] text-[1.0625rem] leading-relaxed ${textMuted}`}>
              {tagline}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className={`mt-8 flex flex-col gap-3 border-t ${border} pt-8`}>
              {points.map((p) => (
                <li key={p} className={`flex items-center gap-3 text-[15px] ${textMain}`}>
                  <span className={`font-mono text-xs ${textMuted}`}>—</span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#"
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-transform active:scale-[0.96] ${btnPrimary}`}
              >
                Abrir app
              </a>
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] ${btnGhost}`}>
                PWA · Em breve
              </span>
            </div>
          </Reveal>
        </div>

        {/* mark */}
        <div className={`flex items-center justify-center ${reverse ? "md:order-1" : ""}`}>
          <div className="flex aspect-square w-full max-w-[420px] items-center justify-center">
            {mark}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- About / ecosystem ---------- */
function About() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 su-grid-dark opacity-30" />
      <div className="relative mx-auto max-w-[1000px] px-5 py-32 text-center sm:px-8 lg:py-40">
        <Reveal>
          <span className="mono-label text-[var(--su-muted-dark)]">A filosofia</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-8 max-w-[880px] font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight-display">
            Um app faz uma coisa. Três apps, feitos da mesma matéria, fazem um sistema.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-8 max-w-[620px] text-[1.15rem] font-light leading-relaxed text-[var(--su-muted-dark)]">
            Cada ferramenta nasce de uma forma fundamental e resolve uma única
            necessidade com clareza absoluta. Mas elas foram desenhadas para conversar:
            o foco vira tarefa, a tarefa vira compromisso, o compromisso vira tempo e
            dinheiro no lugar certo. Menos ruído, mais fluxo.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-[var(--su-line-dark)] bg-[var(--su-line-dark)] sm:grid-cols-3">
          {[
            {
              s: "circle" as const,
              k: "Radian",
              tag: "Timer · Foco",
              v: "O círculo do tempo contínuo. Sessões de foco, pausas e streaks que transformam concentração em progresso visível.",
            },
            {
              s: "square" as const,
              k: "Quadra",
              tag: "To-do · Tarefas",
              v: "O quadrado dos blocos. Tarefas com subtarefas e tags, num limite intencional para você terminar o que importa.",
            },
            {
              s: "triangle" as const,
              k: "Prisma",
              tag: "Calendário · Orçamento",
              v: "O prisma que decompõe. Calendário e orçamento juntos, separando seu tempo em dias e seu dinheiro em categorias.",
            },
          ].map((c, i) => (
            <Reveal key={c.k} delay={0.1 * i} className="bg-ink-soft">
              <div className="flex h-full flex-col items-center gap-4 p-10 text-center">
                <MiniMark shape={c.s} size={30} color="#fafaf8" />
                <span className="font-display text-xl font-bold" style={{ letterSpacing: "0.08em" }}>
                  {c.k}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--su-muted-dark)]">
                  {c.tag}
                </span>
                <span className="mt-1 text-[15px] leading-relaxed text-[var(--su-muted-dark)]">{c.v}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature comparison ---------- */
function Compare() {
  const cols = ["Radian", "Quadra", "Prisma"];
  const rows: { label: string; v: (boolean | string)[] }[] = [
    { label: "Foco / timer", v: [true, false, false] },
    { label: "Lista de tarefas", v: [false, true, false] },
    { label: "Tags e organização", v: [false, true, true] },
    { label: "Calendário", v: [false, false, true] },
    { label: "Controle de orçamento", v: [false, false, true] },
    { label: "Gráficos e streaks", v: ["Sessões", "Streak", "Fluxo"] },
    { label: "Modo escuro", v: [true, true, true] },
    { label: "Instalável (PWA)", v: [true, true, true] },
    { label: "Conecta com os outros apps", v: [true, true, true] },
  ];

  return (
    <section id="comparar" className="bg-paper">
      <div className="mx-auto max-w-[1000px] px-5 py-32 sm:px-8 lg:py-40">
        <Reveal>
          <span className="mono-label text-[var(--su-muted)]">Comparar</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-[640px] font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-tight-display text-ink">
            Cada forma tem seu papel.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-ink/80">
                  <th className="py-5 text-left" />
                  {cols.map((c, i) => (
                    <th key={c} className="py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <MiniMark
                          shape={i === 0 ? "circle" : i === 1 ? "square" : "triangle"}
                          size={22}
                          color="#0a0a0a"
                        />
                        <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink">
                          {c}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-[var(--su-line)]">
                    <td className="py-4 pr-4 text-left text-[15px] text-ink">{r.label}</td>
                    {r.v.map((val, i) => (
                      <td key={i} className="py-4 text-center">
                        {typeof val === "string" ? (
                          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--su-muted)]">
                            {val}
                          </span>
                        ) : val ? (
                          <Check size={18} className="mx-auto text-ink" strokeWidth={2.2} />
                        ) : (
                          <Minus size={16} className="mx-auto text-black/20" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FAQ section ---------- */
function FaqSection() {
  return (
    <section id="faq" className="bg-paper-2">
      <div className="mx-auto max-w-[1000px] px-5 py-32 sm:px-8 lg:py-40">
        <Reveal>
          <span className="mono-label text-[var(--su-muted)]">FAQ</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mb-14 mt-6 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold tracking-tight-display text-ink">
            Perguntas frequentes.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <Faq />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const groups = [
    { title: "Apps", links: ["Radian", "Quadra", "Prisma"] },
    { title: "Suite", links: ["A filosofia", "Comparar", "FAQ"] },
    { title: "Contato", links: ["Email", "Instagram", "X / Twitter", "GitHub"] },
  ];
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mono-label" style={{ letterSpacing: "0.28em" }}>
              PRISMA<span className="text-[var(--su-muted-dark)]">SUITE</span>
            </div>
            <p className="mt-5 max-w-[280px] text-[15px] leading-relaxed text-[var(--su-muted-dark)]">
              Três formas. Um sistema. Ferramentas de produtividade monocromáticas,
              minimalistas e feitas para o seu foco.
            </p>
            <div className="mt-6 flex items-center gap-5 text-paper/70">
              <MiniMark shape="circle" size={20} color="#fafaf8" />
              <MiniMark shape="square" size={20} color="#fafaf8" />
              <MiniMark shape="triangle" size={20} color="#fafaf8" />
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--su-muted-dark)]">
                {g.title}
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[15px] text-paper/85 transition-colors hover:text-paper">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-[var(--su-line-dark)] pt-8 text-[12px] text-[var(--su-muted-dark)] sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Prisma Suite. Todos os direitos reservados.</span>
          <span className="font-mono uppercase tracking-[0.2em]">Radian · Quadra · Prisma</span>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-paper font-body">
      <Nav />
      <main>
        <Hero />

        <AppTile
          id="radian"
          index="01"
          role="Timer · Foco"
          name="RADIAN"
          headline="Foco medido em círculos."
          tagline="Radian transforma seu tempo em ciclos de foco. Inicie uma sessão, deixe o círculo se fechar e veja a concentração virar progresso — com histórico, streaks e estatísticas que mostram sua evolução dia após dia. Sem ruído: só você e o próximo ciclo."
          points={["Sessões de foco e pausas", "Histórico e streaks", "Estatísticas de tempo"]}
          tone="light"
          mark={<RadianMark color="#0a0a0a" />}
        />

        <AppTile
          id="quadra"
          index="02"
          role="To-do · Tarefas"
          name="QUADRA"
          headline="O essencial, em blocos."
          tagline="Quadra é uma lista de tarefas que respeita seus limites. Poucas tarefas por vez, cada uma com até três subtarefas e tags pessoais para separar trabalho, estudo e vida. Um quadrado por foco, um foco por vez — para você terminar o que começa."
          points={["Tarefas com subtarefas", "Tags pessoais", "Limite intencional por dia"]}
          tone="dark"
          mark={<QuadraMark color="#fafaf8" />}
          reverse
        />

        <AppTile
          id="prisma"
          index="03"
          role="Calendário · Orçamento"
          name="PRISMA"
          headline="Um feixe que se decompõe."
          tagline="Prisma reúne calendário e orçamento na mesma superfície. Como a luz atravessando um prisma, ele separa seu tempo em dias e seu dinheiro em categorias — eventos, metas e fluxo de caixa em uma visão só. Enxergue para onde vão seu tempo e seu dinheiro."
          points={["Calendário e eventos", "Controle de orçamento", "Categorias e visão de fluxo"]}
          tone="parchment"
          mark={<PrismaMark color="#0a0a0a" />}
        />

        <About />
        <Compare />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export default Index;
