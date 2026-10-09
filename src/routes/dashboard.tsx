import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bot, MapPin, Search, UserCheck, X } from "lucide-react";
import { CATEGORIES, STATUSES, findMatches, useStore, type HelpRequest, type Status } from "@/lib/store";
import { StatusBadge, UrgencyBadge } from "@/components/Badges";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Coordinator Dashboard — Sahaara AI" },
      { name: "description", content: "Review help requests, find matches and assign volunteers or resources." },
      { property: "og:title", content: "Coordinator Dashboard — Sahaara AI" },
      { property: "og:description", content: "Review help requests and match them with community resources." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { requests, updateRequest, resetDemo } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<HelpRequest | null>(null);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return requests.filter((r) =>
      (cat === "All" || r.category === cat) &&
      [r.id, r.name, r.location, r.description, r.category].some((v) => v.toLowerCase().includes(s)));
  }, [requests, q, cat]);

  const current = active ? requests.find((r) => r.id === active.id) ?? null : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Coordinator Dashboard</h1>
          <p className="text-muted-foreground">{requests.length} requests · fictional demo data</p>
        </div>
        <button onClick={() => { if (confirm("Reset all demo data?")) resetDemo(); }} className="text-sm text-muted-foreground underline hover:text-foreground">Reset demo data</button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, name, location…" className="w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border bg-background px-3 py-2.5 text-sm">
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <article key={r.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-muted-foreground">{r.id}</span>
              <StatusBadge status={r.status} />
            </div>
            <h3 className="mt-3 font-semibold">{r.category}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.location}</span>
              <UrgencyBadge urgency={r.urgency} />
            </div>
            {r.assignedTo && <p className="mt-3 flex items-center gap-1.5 text-xs"><UserCheck className="h-3.5 w-3.5 text-primary" />Assigned: {r.assignedTo}</p>}
            <div className="mt-auto flex gap-2 pt-4">
              <button onClick={() => setActive(r)} className="flex-1 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Find Match</button>
              <select value={r.status} onChange={(e) => updateRequest(r.id, { status: e.target.value as Status })} className="rounded-full border bg-background px-3 py-2 text-xs" aria-label="Update status">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">No requests match your filters.</p>}
      </div>

      {current && <MatchPanel req={current} onClose={() => setActive(null)} onAssign={(name) => { updateRequest(current.id, { assignedTo: name, status: "Matched" }); }} />}
    </main>
  );
}

function MatchPanel({ req, onClose, onAssign }: { req: HelpRequest; onClose: () => void; onAssign: (name: string) => void }) {
  const matches = findMatches(req);
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-foreground/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{req.id}</p>
            <h2 className="font-display text-xl font-bold">Suggested matches</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs text-accent-foreground">
          <Bot className="h-4 w-4" /> Simulated AI matching — simple rules on category, urgency, location and availability.
        </p>
        <div className="mt-4 space-y-3">
          {matches.length === 0 && <p className="text-sm text-muted-foreground">No suitable resources found. This will appear under unmet needs.</p>}
          {matches.map((m) => {
            const assigned = req.assignedTo === m.resource.name;
            return (
              <div key={m.resource.id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{m.resource.name}</p>
                    <p className="text-xs text-muted-foreground">{m.resource.type} · {m.resource.location}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">{m.score} pts</span>
                </div>
                <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                  {m.reasons.map((r) => <li key={r}>• {r}</li>)}
                </ul>
                <button disabled={assigned || !m.resource.available} onClick={() => onAssign(m.resource.name)}
                  className="mt-3 w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {assigned ? "Assigned" : m.resource.available ? "Assign resource" : "Unavailable"}
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Assigning records the match in this demo only — no one is actually contacted.</p>
      </div>
    </div>
  );
}
