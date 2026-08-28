import type { Workspace } from "./types";
import { emptyWorkspace } from "./types";

const DB_NAME = "mtd-evidence-pack:v1";
const STORE = "workspace";

function openDb(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadWorkspace(): Promise<Workspace> {
  const db = await openDb();
  return new Promise<Workspace>((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get("current");
    request.onsuccess = () => resolve((request.result as Workspace | undefined) ?? emptyWorkspace());
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

export async function saveWorkspace(workspace: Workspace): Promise<void> {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    transaction.objectStore(STORE).put({ ...workspace, updatedAt: new Date().toISOString() }, "current");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  }).finally(() => db.close());
}

export async function deleteWorkspace(): Promise<void> {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    transaction.objectStore(STORE).delete("current");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  }).finally(() => db.close());
}
