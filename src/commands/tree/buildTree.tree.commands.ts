import fs from "node:fs";
import path from "node:path";
import { blobObject, treeObject } from "../../objects/index.objects";
import { writeObject } from "../../objects/store/objectStore.objects";
import type { TreeEntry } from "../../objects/tree/types/treeObject.types";

function convertFiletoFileObject(filePath: string): string {
    const fileContent = fs.readFileSync(filePath);
    return writeObject(blobObject(fileContent));
}

// build the tree from bottom to top recursively
export function buildTree(basePath: string): string | null {
    const dirContents = fs.readdirSync(basePath);
    const result: TreeEntry[] = [];
    for (const dirContent of dirContents) {
        if (dirContent === ".gitty" || dirContent === "node_modules") continue;
        const currentPath = path.join(basePath, dirContent);
        const stat = fs.statSync(currentPath);
        if (stat.isDirectory()) {
            const sha = buildTree(currentPath);
            if (sha) {
                result.push({
                    mode: "40000",
                    name: dirContent,
                    sha,
                });
            }
        } else if (stat.isFile()) {
            const sha = convertFiletoFileObject(currentPath);
            result.push({
                mode: "100644",
                name: dirContent,
                sha,
            });
        }
    }
    if (result.length === 0) return null;
    return writeObject(treeObject(result));
}
