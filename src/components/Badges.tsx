import { cn } from "@/lib/utils";
import type { Status, Urgency } from "@/lib/store";

const statusCls: Record<Status, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/40",
  Matched: "bg-accent text-accent-foreground border-accent",
  "In Progress": "bg-info/15 text-info border-info/30",
  Fulfilled: "bg-primary/10 text-primary border-primary/30",
};
const urgCls: Record<Urgency, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-info/15 text-info",
  High: "bg-warning/20 text-warning-foreground",
  Critical: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusCls[status])}>{status}</span>;
}
export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", urgCls[urgency])}>{urgency}</span>;
}
