import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const CATEGORIES = ["Food", "Clothing", "Medical Assistance", "Transport", "Shelter", "Other"] as const;
export const URGENCIES = ["Low", "Medium", "High", "Critical"] as const;
export const STATUSES = ["Pending", "Matched", "In Progress", "Fulfilled"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Urgency = (typeof URGENCIES)[number];
export type Status = (typeof STATUSES)[number];

export interface HelpRequest {
  id: string;
  name: string;
  category: Category;
  description: string;
  location: string;
  urgency: Urgency;
  status: Status;
  assignedTo?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: "Volunteer" | "Organization";
  categories: Category[];
  location: string;
  available: boolean;
  handlesUrgent: boolean;
}

export const RESOURCES: Resource[] = [
  { id: "V1", name: "Asha Menon (volunteer)", type: "Volunteer", categories: ["Food", "Clothing"], location: "Northside", available: true, handlesUrgent: false },
  { id: "V2", name: "Ravi Kumar (volunteer driver)", type: "Volunteer", categories: ["Transport", "Medical Assistance"], location: "Central", available: true, handlesUrgent: true },
  { id: "V3", name: "Dr. Leela Iyer (volunteer nurse)", type: "Volunteer", categories: ["Medical Assistance"], location: "Eastside", available: true, handlesUrgent: true },
  { id: "O1", name: "Green Plate Community Kitchen", type: "Organization", categories: ["Food"], location: "Central", available: true, handlesUrgent: true },
  { id: "O2", name: "Warm Threads Clothing Bank", type: "Organization", categories: ["Clothing"], location: "Westside", available: true, handlesUrgent: false },
  { id: "O3", name: "Safe Haven Night Shelter", type: "Organization", categories: ["Shelter"], location: "Northside", available: true, handlesUrgent: true },
  { id: "V4", name: "Sam Thomas (general helper)", type: "Volunteer", categories: ["Other", "Transport", "Food"], location: "Westside", available: false, handlesUrgent: false },
  { id: "O4", name: "Open Doors Community Center", type: "Organization", categories: ["Other", "Shelter", "Clothing"], location: "Eastside", available: true, handlesUrgent: false },
];

const SEED: HelpRequest[] = [
  { id: "REQ-1001", name: "Meera P.", category: "Food", description: "Family of four needs groceries for the week.", location: "Northside", urgency: "High", status: "Pending", createdAt: "2026-10-01" },
  { id: "REQ-1002", name: "John D.", category: "Medical Assistance", description: "Needs help getting prescription refilled.", location: "Eastside", urgency: "Critical", status: "Matched", assignedTo: "Dr. Leela Iyer (volunteer nurse)", createdAt: "2026-10-02" },
  { id: "REQ-1003", name: "Fatima S.", category: "Clothing", description: "Winter clothes for two children.", location: "Westside", urgency: "Medium", status: "In Progress", assignedTo: "Warm Threads Clothing Bank", createdAt: "2026-10-03" },
  { id: "REQ-1004", name: "Arun K.", category: "Transport", description: "Ride to hospital appointment on Monday.", location: "Central", urgency: "High", status: "Fulfilled", assignedTo: "Ravi Kumar (volunteer driver)", createdAt: "2026-10-03" },
  { id: "REQ-1005", name: "Grace L.", category: "Shelter", description: "Temporary shelter for 3 nights.", location: "Northside", urgency: "Critical", status: "Pending", createdAt: "2026-10-04" },
  { id: "REQ-1006", name: "Vikram R.", category: "Other", description: "Help filling out benefits paperwork.", location: "Eastside", urgency: "Low", status: "Pending", createdAt: "2026-10-05" },
  { id: "REQ-1007", name: "Nisha B.", category: "Food", description: "Elderly neighbour needs hot meals delivered.", location: "Central", urgency: "Medium", status: "Fulfilled", assignedTo: "Green Plate Community Kitchen", createdAt: "2026-10-05" },
];

export interface Match { resource: Resource; score: number; reasons: string[] }

/** Simulated matching: simple rules on category, urgency, location, availability. */
export function findMatches(req: HelpRequest, resources: Resource[] = RESOURCES): Match[] {
  const urgent = req.urgency === "High" || req.urgency === "Critical";
  return resources
    .map((r) => {
      let score = 0;
      const reasons: string[] = [];
      if (r.categories.includes(req.category)) { score += 50; reasons.push(`Supports ${req.category} requests`); }
      if (r.location === req.location) { score += 25; reasons.push(`Located in the same area (${r.location})`); }
      if (r.available) { score += 15; reasons.push("Currently available"); } else { score -= 40; reasons.push("Currently unavailable"); }
      if (urgent && r.handlesUrgent) { score += 10; reasons.push("Can respond to urgent needs"); }
      return { resource: r, score, reasons };
    })
    .filter((m) => m.resource.categories.includes(req.category) || m.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

interface Store {
  requests: HelpRequest[];
  addRequest: (r: Omit<HelpRequest, "id" | "status" | "createdAt">) => HelpRequest;
  updateRequest: (id: string, patch: Partial<HelpRequest>) => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);
const KEY = "sahaara-requests-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<HelpRequest[]>(SEED);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setRequests(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(requests));
  }, [requests, loaded]);

  const addRequest: Store["addRequest"] = (r) => {
    const max = requests.reduce((m, x) => Math.max(m, Number(x.id.split("-")[1]) || 0), 1000);
    const created: HelpRequest = { ...r, id: `REQ-${max + 1}`, status: "Pending", createdAt: new Date().toISOString().slice(0, 10) };
    setRequests((prev) => [created, ...prev]);
    return created;
  };
  const updateRequest: Store["updateRequest"] = (id, patch) =>
    setRequests((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const resetDemo = () => setRequests(SEED);

  return <Ctx.Provider value={{ requests, addRequest, updateRequest, resetDemo }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be inside StoreProvider");
  return s;
}
