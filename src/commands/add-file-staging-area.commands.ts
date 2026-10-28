import fs from "node:fs";
import path from "node:path";
import { readIndex, writeIndex } from "./index/read-write.index";
import { hashObject } from "../fileOperations/hashObject.fileOperations";
import type { Index } from "./index/index.types";

// file -> [file], directory -> every file inside it (skipping the repo folder)
function collectFiles(absolutePath: string): string[] {
    const stat = fs.statSync(absolutePath);
    if (!stat.isDirectory()) return [absolutePath];

    const files: string[] = [];
    for (const name of fs.readdirSync(absolutePath)) {
        if (name === ".git" || name === ".gitty") continue;
        files.push(...collectFiles(path.join(absolutePath, name)));
    }
    return files;
}

// stages ONE file: writes the blob and sets the index entry
export function stageFile(
    index: Index,
    GIT_DIR: string,
    WORK_DIR: string,
    filePath: string
): void {
    const absolutePath = path.resolve(WORK_DIR, filePath);
    const stat = fs.statSync(absolutePath);

    const mode = stat.mode & 0o111 ? "100755" : "100644";
    const hash = hashObject(GIT_DIR, WORK_DIR, absolutePath, true)!; // true = write the blob

    const relPath = path
        .relative(WORK_DIR, absolutePath)
        .split(path.sep)
        .join("/");

    index[relPath] = { mode, hash };
}

export function addFile(GIT_DIR: string, WORK_DIR: string, paths: string[]) {
    try {
        if (!paths.length) throw new Error(`Nothing specified, nothing added.`);

        // validate ALL paths first, so a bad path leaves the index untouched
        for (const p of paths) {
            if (!fs.existsSync(path.resolve(WORK_DIR, p)))
                throw new Error(
                    `fatal: pathspec '${p}' did not match any files`
                );
        }

        const index = readIndex();
        for (const p of paths) {
            const absolutePath = path.resolve(WORK_DIR, p);
            for (const file of collectFiles(absolutePath)) {
                stageFile(index, GIT_DIR, WORK_DIR, file);
            }
        }
        writeIndex(index);
    } catch (error) {
        process.stderr.write((error as Error).message + "\n");
        process.exit(1);
    }
}
