import crypto from "node:crypto";

// converts the given blob fileObject into the hashCode
export function hashFileObject(obj: Buffer): string {
    try {
        if (!obj) throw new Error(`fatal: No object is provided for hashing\n`);
        const hashCode = crypto.createHash("sha1").update(obj).digest("hex");
        return hashCode;
    } catch (error) {
        process.stderr.write((error as Error).message + "\n");
        process.exit(1);
    }
}
