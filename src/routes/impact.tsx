import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, Inbox, Link2 } from "lucide-react";
import { CATEGORIES, useStore } from "@/lib/store";
import { UrgencyBadge } from "@/components/Badges";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact Dashboard — Sahaara AI" },
      { name: "description", content: "Live statistics on help requests, matches and unmet needs." },
      { property: "og:title", content: "Impact Dashboard — Sahaara AI" },
      { property: "og:description", content: "See requests by category, fulfilment progress and unmet needs." },
    ],
  }),
  component: Impact,
});

function Impact() {
  const { requests } = useStore();
  const count = (s: string) => requests.filter((r) => r.status === s).length;
  const stats = [
    { label: "Total requests", value: requests.length, icon: Inbox },
    { label: "Pending", value: count("Pending"), icon: Clock },
    { label: "Matched / In progress", value: count("Matched") + count("In Progress"), icon: Link2 },
    { label: "Fulfilled", value: count("Fulfilled"), icon: CheckCircle2 },
  ];
  const data = CATEGORIES.map((c) => ({ category: c.replace(" Assistance", ""), requests: requests.filter((r) => r.category === c).length }));
  const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const unmet = requests.filter((r) => r.status === "Pending").sort((a, b) => order[a.urgency] - order[b.urgency]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Impact Dashboard</h1>
      <p className="text-muted-foreground">Live view of demo data. Updates as coordinators change statuses.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: I }) => (
          <div key={label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <I className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border bg-card p-5 shadow-soft lg:col-span-3">
          <h2 className="font-semibold">Requests by category</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="requests" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-soft lg:col-span-2">
          <h2 className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-destructive" />Unmet needs ({unmet.length})</h2>
          <p className="text-xs text-muted-foreground">Pending requests without a match, most urgent first.</p>
          <ul className="mt-4 space-y-2">
            {unmet.length === 0 && <li className="text-sm text-muted-foreground">All requests have been matched.</li>}
            {unmet.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-sm">
                <span><span className="font-mono text-xs text-muted-foreground">{r.id}</span> · {r.category} · {r.location}</span>
                <UrgencyBadge urgency={r.urgency} />
              </li>
            ))}
          </ul>
          <Link to="/dashboard" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Match them in the dashboard →</Link>
        </section>
      </div>
    </main>
  );
}
