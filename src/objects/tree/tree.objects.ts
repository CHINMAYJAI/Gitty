/*
format:
tree <size>\0
     <mode> <name>\0<20_byte_sha>
     <mode> <name>\0<20_byte_sha>
     <mode> <name>\0<20_byte_sha>
     <mode> <name>\0<20_byte_sha>
*/

import type { TreeEntry } from "./types/treeObject.types";

// sort the directories
function sortKey(e: TreeEntry): Buffer {
    return Buffer.from(e.mode === "40000" ? e.name + "/" : e.name);
}

// generates the subtree(sub-dir)/leaf node(file)
export function treeObject(entries: TreeEntry[]): Buffer {
    const sortedBody = [...entries].sort((a, b) =>
        Buffer.compare(sortKey(a), sortKey(b))
    );
    //  build the body of treeObject
    // <mode> <name>\0<20_byte_sha>
    const body = Buffer.concat(
        sortedBody.map((e) =>
            Buffer.concat([
                Buffer.from(`${e.mode} ${e.name}\0`),
                Buffer.from(e.sha, "hex"),
            ])
        )
    );
    // build the header
    // tree <size>\0
    const header = Buffer.from(`tree ${body.length}\0`);
    return Buffer.concat([header, body]);
}
