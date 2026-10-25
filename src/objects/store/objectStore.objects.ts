import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { hashFileObject } from "../../utils/hashing/hashFileObject.utils";

// hashes the object, compresses it and stores it in .gitty/objects/, returns the sha. skips the write if the object already exists
export function writeObject(object: Buffer): string {
    const hashCode = hashFileObject(object);
    const folderPath = path.join(
        process.cwd(),
        ".gitty",
        "objects",
        hashCode.slice(0, 2)
    );
    const filePath = path.join(folderPath, hashCode.slice(2));
    if (fs.existsSync(filePath)) return hashCode;
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(filePath, zlib.deflateSync(object));
    return hashCode;
}
