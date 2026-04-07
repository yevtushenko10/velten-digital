"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Locale, content } from "@/data/content";

const locales: { key: Locale; label: string }[] = [
  { key: "ru", label: "RU" },
  { key: "ua", label: "UA" },
  { key: "en", label: "EN" },
  { key: "de", label: "DE" }
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="mb-3 text-xs uppercase tracking-[0.24em] text-accent2/80">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
    </div>
  );
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const t = useMemo(() => content[locale], [locale]);

  // ── Chat state ──
  type ChatMsg = { role: "user" | "assistant"; content: string };
  const GREETING = "Hi! I can help with pricing, services, and automation options.";
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: GREETING }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ── Contact form state ──
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });
      if (res.ok) {
        setFormState("success");
        form.reset();
        setTimeout(() => setFormState("idle"), 5000);
      } else {
        setFormState("error");
        setTimeout(() => setFormState("idle"), 4000);
      }
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 4000);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");

    const updated: ChatMsg[] = [...chatMessages, { role: "user", content: text }];
    setChatMessages(updated);
    setChatLoading(true);

    // Only send messages from first user turn onward (skip initial greeting)
    const apiMessages = updated
      .filter((m) => !(m.role === "assistant" && m.content === GREETING))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });
      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setChatMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: reply }
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };
  const year = new Date().getFullYear();
  const navItems = [
    { id: "services", label: t.nav.services },
    { id: "pricing", label: t.nav.pricing },
    { id: "faq", label: t.nav.faq },
    { id: "contact", label: t.nav.contact }
  ];

  return (
    <main className="min-h-screen bg-radial">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="sticky top-4 z-50">
          <div className="glass rounded-2xl px-4 py-3 md:px-6">
            <div className="flex items-center justify-between gap-3">
              <a href="#hero" className="text-base font-semibold tracking-wide text-ink md:text-lg">
                Velten <span className="text-accent2">Digital</span>
              </a>
              <nav className="hidden items-center gap-7 text-sm text-soft md:flex">
                {navItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="transition hover:text-ink">
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="hidden items-center gap-2 md:flex">
                <div className="relative">
                  <button
                    onClick={() => setLangOpen((prev) => !prev)}
                    className="panel flex min-w-20 items-center justify-between rounded-xl border-transparent px-3 py-2 text-xs font-medium text-soft transition hover:text-ink"
                    aria-label="Select language"
                  >
                    {locales.find((lang) => lang.key === locale)?.label}
                    <span className="ml-2 text-[10px]">▼</span>
                  </button>
                  {langOpen && (
                      <div className="panel absolute right-0 top-11 w-24 rounded-xl border-transparent p-1 text-xs shadow-glow">
                      {locales.map((lang) => (
                        <button
                          key={lang.key}
                          onClick={() => {
                            setLocale(lang.key);
                            setLangOpen(false);
                          }}
                          className={`w-full rounded-lg px-2 py-2 text-left transition ${
                            locale === lang.key ? "bg-accent/20 text-ink" : "text-soft hover:bg-white/5 hover:text-ink"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href="#contact"
                  className="rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-medium text-[#1b1410] shadow-glow transition hover:brightness-105"
                >
                  {t.nav.getStarted}
                </a>
              </div>
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="panel rounded-lg p-2 text-soft md:hidden"
                aria-label="Toggle mobile menu"
              >
                <span className="block h-0.5 w-5 bg-current" />
                <span className="mt-1.5 block h-0.5 w-5 bg-current" />
                <span className="mt-1.5 block h-0.5 w-5 bg-current" />
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="mt-3 space-y-3 border-t border-white/10 pt-4 md:hidden">
                <nav className="flex flex-col gap-3 text-sm text-soft">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="transition hover:text-ink"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setLangOpen((prev) => !prev)}
                      className="panel flex min-w-20 items-center justify-between rounded-xl border-transparent px-3 py-2 text-xs font-medium text-soft transition hover:text-ink"
                    >
                      {locales.find((lang) => lang.key === locale)?.label}
                      <span className="ml-2 text-[10px]">▼</span>
                    </button>
                    {langOpen && (
                      <div className="panel absolute left-0 top-11 z-10 w-24 rounded-xl border-transparent p-1 text-xs">
                        {locales.map((lang) => (
                          <button
                            key={lang.key}
                            onClick={() => {
                              setLocale(lang.key);
                              setLangOpen(false);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full rounded-lg px-2 py-2 text-left transition ${
                              locale === lang.key ? "bg-accent/20 text-ink" : "text-soft hover:bg-white/5 hover:text-ink"
                            }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-medium text-[#1b1410]"
                  >
                    {t.nav.getStarted}
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <section id="hero" className="reveal relative py-14 md:py-18">
          <div className="pointer-events-none absolute -left-28 top-8 h-64 w-64 rounded-full bg-accent/20 blur-[90px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-accent2/10 blur-[80px]" />
          <div className="relative flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <p className="mb-6 inline-flex rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-accent2">
                Premium AI & Automation Agency
              </p>
              <h1 className="text-balance text-[clamp(2rem,6vw,4.1rem)] font-semibold leading-[1.08] tracking-tight text-ink">
                {t.hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-soft md:text-lg">
                {t.hero.subtitle}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent2 px-6 py-3 text-sm font-semibold text-[#1b1410] shadow-glow transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {t.hero.ctaPrimary}
                </a>
                <a
                  href="https://t.me/your_telegram"
                  className="inline-flex items-center justify-center rounded-xl border border-[#9f7c62]/50 bg-[#3a2e24]/45 px-6 py-3 text-sm font-semibold text-ink transition hover:border-[#b98b66] hover:bg-[#3a2e24]/70"
                >
                  {t.hero.ctaTelegram}
                </a>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 lg:w-72 lg:shrink-0">
              <div className="panel rounded-2xl p-4 text-center">
                <div className="flex justify-center text-accent2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                  </svg>
                </div>
                <p className="mt-2 text-2xl font-semibold text-ink">120%</p>
                <p className="mt-1 text-[11px] leading-snug text-soft">ROI Growth</p>
              </div>
              <div className="panel rounded-2xl p-4 text-center">
                <p className="text-xl">⚡</p>
                <p className="mt-2 text-2xl font-semibold text-ink">80%+</p>
                <p className="mt-1 text-[11px] leading-snug text-soft">Requests Automated</p>
              </div>
              <div className="panel rounded-2xl p-4 text-center">
                <p className="text-xl">⏱</p>
                <p className="mt-2 text-2xl font-semibold text-ink">3×</p>
                <p className="mt-1 text-[11px] leading-snug text-soft">Faster Operations</p>
              </div>
              <div className="panel rounded-2xl p-4 text-center">
                <p className="text-xl">🤖</p>
                <p className="mt-2 text-2xl font-semibold text-ink">24/7</p>
                <p className="mt-1 text-[11px] leading-snug text-soft">AI Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Logos marquee ── */}
        <div className="overflow-hidden border-y border-white/[0.06] py-6">
          <p className="mb-5 text-center text-[10px] uppercase tracking-[0.22em] text-soft/50">Trusted by teams at</p>
          <div className="relative overflow-hidden">
            <div className="marquee-track gap-12 px-6">
              {["Notion", "Stripe", "Vercel", "Figma", "Linear", "Webflow", "Framer", "HubSpot", "Airtable", "Monday", "Loom", "Intercom",
                "Notion", "Stripe", "Vercel", "Figma", "Linear", "Webflow", "Framer", "HubSpot", "Airtable", "Monday", "Loom", "Intercom"].map((name, i) => (
                <span key={i} className="whitespace-nowrap text-sm font-semibold tracking-wide text-soft/30 transition hover:text-soft/60">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section id="services" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="01" title={t.sectionLabels.services} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {t.services.map((service) => (
              <article
                key={service.title}
                className="panel rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[#bb8c66]/45 hover:shadow-glow"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-accent to-accent2" />
                  <h3 className="text-lg font-semibold text-ink md:text-xl">{service.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-soft">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="02" title="Projects" />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                category: "n8n Automation",
                status: "Delivered",
                name: "FlowOps",
                desc: "End-to-end workflow automation connecting CRM, email alerts and delivery tracking for a mid-size logistics company.",
                tags: ["n8n", "Airtable", "SMTP"],
                result: "15h / week saved"
              },
              {
                category: "Website · Analytics",
                status: "Delivered",
                name: "GrowthLand",
                desc: "Premium conversion-focused landing page with A/B testing, Google Tag Manager and full funnel analytics for a consulting firm.",
                tags: ["Next.js", "GTM", "Hotjar"],
                result: "3.2× conversion rate"
              }
            ].map((p) => (
              <article key={p.name} className="panel flex flex-col rounded-2xl overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-glow">
                {/* widget header */}
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
                  <span className="text-[11px] font-medium tracking-wide text-accent2/80">{p.category}</span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] ${p.status === "Live" ? "text-emerald-400/80" : "text-soft/50"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${p.status === "Live" ? "bg-emerald-400" : "bg-soft/40"}`} />
                    {p.status}
                  </span>
                </div>
                {/* body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-soft/70">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4 text-sm font-semibold text-accent2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                    </svg>
                    {p.result}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="03" title={t.sectionLabels.pricing} />
          <div className="grid gap-5 lg:grid-cols-3">
            {t.pricing.plans.map((plan) => (
              <article
                key={plan.name}
                className={`panel relative rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow md:p-8 ${
                  plan.badge ? "border-[#d6a277]/50 bg-[#32271e]" : ""
                }`}
              >
                {plan.badge && (
                  <span className="absolute right-5 top-5 rounded-full border border-[#c9966d]/50 bg-[#4e3828] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#ffd6b6]">
                    Recommended
                  </span>
                )}
                <h3 className="text-2xl font-semibold text-ink">{plan.name}</h3>
                <ul className="mt-6 space-y-3 text-sm text-soft">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-lg font-semibold text-[#ffd6b6]">{plan.price}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 space-y-1.5 text-sm leading-relaxed text-soft">
            <p>{t.pricing.noteSupport}</p>
            <p>{t.pricing.noteCustom}</p>
          </div>
        </section>

        <section id="process" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="04" title={t.sectionLabels.process} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.processSteps.map((step, index) => (
              <div key={step} className="panel rounded-2xl p-6">
                <p className="mb-4 text-3xl font-semibold text-[#e3a976] md:text-4xl">0{index + 1}</p>
                <p className="text-sm leading-relaxed text-soft">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="05" title="What clients say" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                quote: "Velten built our Telegram bot in under 2 weeks. It now handles 40% of all orders automatically. The ROI was visible within the first month.",
                name: "Dmitri P.",
                role: "CEO",
                company: "TasteChain",
                initials: "DP"
              },
              {
                quote: "The AI support widget they integrated cut our ticket volume by 70%. Customers get instant answers, and our team can focus on what actually matters.",
                name: "Marta K.",
                role: "Head of Customer Success",
                company: "ShopNova",
                initials: "MK"
              },
              {
                quote: "They connected our CRM, email, and analytics into one automated flow. We saved 15 hours a week from day one — incredible execution.",
                name: "Anna L.",
                role: "Operations Director",
                company: "LogiFlow",
                initials: "AL"
              }
            ].map((r) => (
              <article key={r.name} className="panel flex flex-col rounded-2xl p-6">
                <div className="flex gap-0.5 text-accent2">
                  {"★★★★★".split("").map((s, i) => <span key={i} className="text-sm">{s}</span>)}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-soft">"{r.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent2 text-[11px] font-bold text-[#1b1410]">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-[11px] text-soft/70">{r.role}, {r.company}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="06" title={t.sectionLabels.faq} />
          <div className="space-y-3">
            {t.faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article key={item.q} className="panel overflow-hidden rounded-2xl">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  >
                    <span className="text-sm font-medium text-ink md:text-base">{item.q}</span>
                    <span className="text-lg text-accent2">{isOpen ? "-" : "+"}</span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-soft md:px-6">{item.a}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="ai-support" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="07" title={t.sectionLabels.aiSupport} />
          <div className="panel grid gap-8 rounded-2xl p-6 md:grid-cols-2 md:p-8">
            <div>
              <h3 className="text-balance text-2xl font-semibold text-ink">{t.aiSupport.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-soft">{t.aiSupport.text}</p>
            </div>
            <div className="flex flex-col rounded-2xl border border-[#a88368]/45 bg-[#2a2018]/45 p-4">
              <div className="flex items-center justify-between border-b border-[#7f614b]/40 pb-3">
                <p className="text-sm font-medium text-ink">Velten AI Assistant</p>
                <span className="flex items-center gap-1.5 rounded-full bg-[#3f2d20] px-2 py-0.5 text-[10px] text-[#ffd7b4]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online
                </span>
              </div>
              <div ref={chatScrollRef} className="mt-3 flex max-h-56 flex-col gap-2.5 overflow-y-auto pr-1 text-sm">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed ${
                      msg.role === "user"
                        ? "ml-auto bg-gradient-to-r from-accent to-accent2 text-[#1b1410]"
                        : "bg-[#32271e] text-soft"
                    }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1">
                        <span className="animate-bounce">·</span>
                        <span className="animate-bounce [animation-delay:0.15s]">·</span>
                        <span className="animate-bounce [animation-delay:0.3s]">·</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={chatLoading}
                  className="w-full rounded-lg border border-[#6d5949] bg-[#241d17] px-3 py-2 text-sm text-ink outline-none placeholder:text-soft/70 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="rounded-lg bg-gradient-to-r from-accent to-accent2 px-3 py-2 text-xs font-semibold text-[#1b1410] transition hover:brightness-105 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </section>

        <section id="contact" className="reveal py-10 md:py-14">
          <SectionTitle eyebrow="08" title={t.sectionLabels.contact} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="panel rounded-2xl p-6 md:p-8">
              <h3 className="text-balance text-2xl font-semibold text-ink">{t.contact.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-soft">{t.contact.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://t.me/your_telegram"
                  className="rounded-xl border border-[#ac7e5b]/55 bg-[#3a2a20]/50 px-5 py-2.5 text-sm text-[#ffd7b4] transition hover:bg-[#473322]"
                >
                  {t.contact.telegram}
                </a>
                <a
                  href={`mailto:${t.contact.emailPlaceholder}`}
                  className="rounded-xl border border-white/20 px-5 py-2.5 text-sm text-soft transition hover:border-white/35 hover:text-ink"
                >
                  {t.contact.emailPlaceholder}
                </a>
              </div>
            </div>

            <form onSubmit={submitContact} className="panel rounded-2xl p-6 md:p-8">
              <input type="hidden" name="access_key" value="ed16546b-322d-4ab4-aeba-92c1b34a13ff" />
              <input type="hidden" name="subject" value="New message from Velten Digital website" />
              <input type="checkbox" name="botcheck" className="hidden" />
              <div className="space-y-3.5">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t.contact.name}
                  className="w-full rounded-xl border border-[#6d5949] bg-[#241d17] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-soft/75 focus:border-[#be8d65] focus:ring-2 focus:ring-[#be8d65]/20"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t.contact.email}
                  className="w-full rounded-xl border border-[#6d5949] bg-[#241d17] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-soft/75 focus:border-[#be8d65] focus:ring-2 focus:ring-[#be8d65]/20"
                />
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder={t.contact.message}
                  className="w-full rounded-xl border border-[#6d5949] bg-[#241d17] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-soft/75 focus:border-[#be8d65] focus:ring-2 focus:ring-[#be8d65]/20"
                />
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="w-full rounded-xl bg-gradient-to-r from-accent to-accent2 px-5 py-3 text-sm font-semibold text-[#1b1410] transition hover:brightness-105 disabled:opacity-60"
                >
                  {formState === "sending" ? "Sending…" : t.contact.submit}
                </button>
              </div>
            </form>
          </div>
        </section>

        <footer className="py-6 text-sm text-soft md:py-7">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-center md:text-left">
              {year} Velten Digital. {t.footer.rights}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
              <a href="mailto:business@veltendigital.com" className="transition hover:text-ink">
                business@veltendigital.com
              </a>
              <a href="https://t.me/your_telegram" className="transition hover:text-ink">
                Telegram
              </a>
              <a href="https://instagram.com/your_instagram" className="transition hover:text-ink">
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Toast notification ── */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 ${
          formState === "success" || formState === "error"
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-glow backdrop-blur-md ${
          formState === "success"
            ? "border border-emerald-500/30 bg-[#1a2e1e]/90"
            : "border border-red-500/30 bg-[#2e1a1a]/90"
        }`}>
          <span className="text-xl">
            {formState === "success" ? "✓" : "✕"}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              {formState === "success" ? "Message sent!" : "Something went wrong"}
            </p>
            <p className="text-xs text-soft/80">
              {formState === "success"
                ? "We'll get back to you as soon as possible."
                : "Please try again or contact us via Telegram."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
