// format: blob<size>\0<content>
export function blobObject(fileContent: Buffer): Buffer {
    const header = Buffer.from(`blob ${fileContent.length}\0`);
    return Buffer.concat([header, fileContent]);
}
