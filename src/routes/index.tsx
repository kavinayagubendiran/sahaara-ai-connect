import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { CATEGORIES, URGENCIES, useStore, type HelpRequest } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahaara AI — Request Help" },
      { name: "description", content: "Sahaara AI connects people in need with community volunteers and resources." },
      { property: "og:title", content: "Sahaara AI — Help is closer than you think" },
      { property: "og:description", content: "Submit a help request and get matched with community volunteers and resources." },
    ],
  }),
  component: Home,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters)").max(80),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Please choose a category" }) }),
  description: z.string().trim().min(10, "Please describe your need (at least 10 characters)").max(500),
  location: z.string().trim().min(2, "Please enter an approximate location").max(80),
  urgency: z.enum(URGENCIES, { errorMap: () => ({ message: "Please choose urgency" }) }),
});

const empty = { name: "", category: "", description: "", location: "", urgency: "" };
const field = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

function Home() {
  const { addRequest } = useStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<HelpRequest | null>(null);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setCreated(addRequest(res.data));
    setForm(empty);
  };

  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="grid items-start gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Community-powered support
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Help is closer than you think.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Sahaara AI connects people in need with nearby community volunteers and resources — food, clothing,
            medical help, transport and shelter. Share what you need, and coordinators find the best match.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Users, t: "Local volunteers", d: "Neighbours ready to help" },
              { icon: MapPin, t: "Nearby resources", d: "Matched by area" },
              { icon: ShieldCheck, t: "Coordinated", d: "Reviewed by people" },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl border bg-card p-4">
                <I className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
            Go to Coordinator Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft md:p-8">
          {created ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-bold">Request submitted</h2>
              <p className="mt-2 text-muted-foreground">
                Your request <strong className="text-foreground">{created.id}</strong> has been recorded and is now visible to coordinators.
                This is a demo — no real volunteers are contacted.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => setCreated(null)} className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted">Submit another</button>
                <Link to="/dashboard" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">View in dashboard</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Request help</h2>
              <Field label="Your name" error={errors.name}>
                <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Priya" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category" error={errors.category}>
                  <select className={field} value={form.category} onChange={(e) => set("category", e.target.value)}>
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Urgency" error={errors.urgency}>
                  <select className={field} value={form.urgency} onChange={(e) => set("urgency", e.target.value)}>
                    <option value="">Select…</option>
                    {URGENCIES.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Approximate location" error={errors.location} hint="Demo areas: Northside, Central, Eastside, Westside">
                <input className={field} list="areas" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Northside" />
                <datalist id="areas">{["Northside", "Central", "Eastside", "Westside"].map((a) => <option key={a} value={a} />)}</datalist>
              </Field>
              <Field label="What do you need?" error={errors.description}>
                <textarea className={field} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Briefly describe your situation" />
              </Field>
              <button type="submit" className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Submit Request
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
