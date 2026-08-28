import type { Workspace } from "./types";

export type Readiness = {
  complete: number;
  total: number;
  percent: number;
  gaps: string[];
  outsidePeriod: number;
  uncategorised: number;
};

export function assessReadiness(workspace: Workspace): Readiness {
  const complete = workspace.checklist.filter(item => item.done).length;
  const gaps = workspace.checklist.filter(item => !item.done).map(item => item.label);
  const outsidePeriod = workspace.transactions.filter(row => row.date < workspace.periodStart || row.date > workspace.periodEnd).length;
  const uncategorised = workspace.transactions.filter(row => !row.category.trim()).length;
  if (!workspace.transactions.length) gaps.unshift("Import at least one bookkeeping record");
  if (!workspace.documents.length) gaps.push("Attach source documents or an evidence index");
  if (outsidePeriod) gaps.push(`${outsidePeriod} record${outsidePeriod === 1 ? " is" : "s are"} outside the period`);
  if (uncategorised) gaps.push(`${uncategorised} record${uncategorised === 1 ? " needs" : "s need"} a category`);
  const total = workspace.checklist.length;
  return { complete, total, percent: total ? Math.round((complete / total) * 100) : 0, gaps, outsidePeriod, uncategorised };
}
