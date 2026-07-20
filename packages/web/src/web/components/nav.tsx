import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Radian", href: "#radian" },
  { label: "Quadra", href: "#quadra" },
  { label: "Prisma", href: "#prisma" },
  { label: "Sobre", href: "#sobre" },
  { label: "Comparar", href: "#comparar" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "border-b border-[var(--su-line)] bg-[rgba(250,250,248,0.72)] backdrop-blur-xl backdrop-saturate-150" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[56px] max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <a href="#top" className="mono-label text-ink" style={{ letterSpacing: "0.28em" }}>
            PRISMA<span className="text-[var(--su-muted)]">SUITE</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--su-muted)] transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-paper md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-[56px] items-center justify-between px-5">
              <span className="mono-label text-ink" style={{ letterSpacing: "0.28em" }}>
                PRISMA<span className="text-[var(--su-muted)]">SUITE</span>
              </span>
              <button
                className="flex h-9 w-9 items-center justify-center text-ink"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex flex-col gap-2 px-5 pt-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-4xl font-bold tracking-tight-display text-ink"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
