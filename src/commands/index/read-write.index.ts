import fs from "node:fs";
import path from "node:path";
import type { Index } from "./index.types";

const INDEX_PATH = path.join(".gitty", "index");

// load the staging area, empty if it does not exist yet
export function readIndex(): Index {
    if (!fs.existsSync(INDEX_PATH)) return {};
    return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
}

// save the staging area, sorted by path
export function writeIndex(index: Index): void {
    const sorted: Index = {};
    // @ts-ignore
    for (const key of Object.keys(index).sort()) sorted[key] = index[key];
    fs.writeFileSync(INDEX_PATH, JSON.stringify(sorted, null, 2));
}
