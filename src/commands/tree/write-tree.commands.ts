import { buildTree } from "./buildTree.tree.commands";

export function writeTreeCmd(): string | null {
    const basePath = process.cwd();
    const sha = buildTree(basePath);
    return sha;
}
