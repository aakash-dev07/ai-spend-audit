
import { AuditResult } from "./types";


const globalStore = globalThis as typeof globalThis & {
  __auditStore?: Map<string, AuditResult>;
};

if (!globalStore.__auditStore) {
  globalStore.__auditStore = new Map<string, AuditResult>();
}

const store = globalStore.__auditStore;

export function saveAudit(result: AuditResult): void {
  store.set(result.id, result);
}

export function getAudit(id: string): AuditResult | null {
  return store.get(id) ?? null;
}
