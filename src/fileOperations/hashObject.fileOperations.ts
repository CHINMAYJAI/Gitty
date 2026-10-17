import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { blobObject } from "../objects/index.objects";
/*
1. check for existence of file
2. read the file
3. create the blob
4. calculate the hash (on content+header)
5. if -w flag is there then store the hash (compressed blob)
*/
export function hashObject(
    GIT_DIR: string,
    WORK_DIR: string,
    filePath: string | undefined,
    writeFlag: boolean
): string | null {
    try {
        if (!filePath) return null;

        const absoluteFilePath = path.resolve(WORK_DIR, filePath);

        if (!fs.existsSync(absoluteFilePath))
            throw new Error(
                `fatal: could not open '${filePath}' for reading: No such file or directory`
            );

        const fileContent = fs.readFileSync(absoluteFilePath);

        const blob = blobObject(fileContent);
        const hashCode = crypto.createHash("sha1").update(blob).digest("hex");
        if (!writeFlag) return hashCode;
        const dirname = hashCode.slice(0, 2);
        const objDir = path.join(GIT_DIR, "objects", dirname);
        const filename = hashCode.slice(2);
        const objPath = path.join(objDir, filename);
        if (!fs.existsSync(objPath)) {
            fs.mkdirSync(objDir, { recursive: true });
            fs.writeFileSync(objPath, zlib.deflateSync(blob));
        }
        return hashCode;
    } catch (error) {
        process.stderr.write((error as Error).message + "\n");
        process.exit(1);
    }
}
