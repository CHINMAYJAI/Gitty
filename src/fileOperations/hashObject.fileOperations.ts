import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { blobObject } from "../objects/index.objects";
/*
1. check for existence of file
2. read the file
3. create the blob
4. calculate the hash (on plain data)
5. if -w flag is there then store the hash (compressed blob)
*/
export function hashObject(
    GIT_DIR: string,
    WORK_DIR: string,
    filePath: string | undefined,
    writeFlag: boolean
) {
    try {
        if (!filePath) return;

        const absoluteFilePath = path.resolve(WORK_DIR, filePath);

        if (!fs.existsSync(absoluteFilePath))
            throw new Error(
                `fatal: could not open '${filePath}' for reading: No such file or directory`
            );

        const fileContent = fs.readFileSync(absoluteFilePath);

        const blob = blobObject(fileContent);
        const hash = crypto.createHash("sha1").update(blob).digest("hex");
        process.stdout.write(hash);
        if (!writeFlag) return;
        const dirname = hash.slice(0, 2);
        const objDir = path.join(GIT_DIR, "objects", dirname);
        const filename = hash.slice(2);
        const objPath = path.join(objDir, filename);
        if (!fs.existsSync(objPath)) {
            fs.mkdirSync(objDir, { recursive: true });
            fs.writeFileSync(objPath, zlib.deflateSync(blob));
        }
    } catch (error) {
        process.stderr.write((error as Error).message + "\n");
        process.exit(1);
    }
}
