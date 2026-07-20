import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

const items = [
  {
    q: "O que é a Prisma Suite?",
    a: "Um conjunto de três apps de produtividade que compartilham a mesma linguagem — monocromática, minimalista e geométrica. Radian cuida do seu foco, Quadra das suas tarefas e Prisma do seu tempo e do seu dinheiro. Juntos, formam um sistema único.",
  },
  {
    q: "Os apps conversam entre si?",
    a: "Sim. É um ecossistema: uma sessão de foco no Radian pode virar uma tarefa concluída no Quadra, e um compromisso no Prisma pode disparar um timer no Radian. Você transita entre eles sem sair do fluxo.",
  },
  {
    q: "Preciso pagar para usar?",
    a: "Cada app funciona de forma independente e gratuita no essencial. A proposta é começar por onde você mais precisa e adicionar os outros quando fizer sentido.",
  },
  {
    q: "Em quais plataformas rodam?",
    a: "São Progressive Web Apps (PWA). Abrem direto no navegador e podem ser instalados na tela inicial do celular ou no desktop — sem loja de aplicativos, sempre atualizados.",
  },
  {
    q: "Por que formas geométricas?",
    a: "Cada app é uma forma fundamental: o círculo do Radian (tempo contínuo), o quadrado do Quadra (blocos de tarefa) e o prisma do Prisma (um feixe que se decompõe em dias e categorias). A geometria é a identidade — e a metáfora.",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Privacidade em primeiro lugar. Nada de ruído, nada de rastreamento invasivo: os apps são projetados para servir ao seu foco, não para competir por ele.",
  },
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-[820px]">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className="border-b border-[var(--su-line)]">
            <button
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              onClick={() => setOpenIdx(open ? null : i)}
            >
              <span className="font-display text-lg font-semibold text-ink sm:text-xl">
                {item.q}
              </span>
              <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}>
                <Plus size={22} strokeWidth={1.6} className="shrink-0 text-[var(--su-muted)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[680px] pb-7 text-[1.0625rem] leading-relaxed text-[var(--su-muted)]">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
