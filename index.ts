import path from "node:path";
import { hashObject } from "./src/fileOperations/hashObject.fileOperations";
import { initRepo, catFile } from "./src/commands/index.commands";

// fetch gitty command by destructuring it
const [, , command, ...args] = process.argv;

const WORK_DIR = process.cwd();
const GIT_DIR = path.join(WORK_DIR, ".gitty");

switch (command) {
    case "init":
        initRepo(GIT_DIR);
        break;
    case "hash-object":
        const writeFlag = args.includes("-w");
        const filePath = args.find((arg) => arg !== "-w");
        const hashCode: string | null = hashObject(
            GIT_DIR,
            WORK_DIR,
            filePath,
            writeFlag
        );
        if (hashCode !== null) process.stdout.write(`${hashCode}\n`);
        break;
    case "cat-file":
        const flag = args[0];
        const commitHash = args[1];
        if (!commitHash && !flag) {
            process.stdout.write(
                `gitty cat-file: usage is to reads an object out of Gitty’s database and shows it to you`
            );
            throw new Error(
                `fatal: only two arguments allowed in <type> <object> mode`
            );
        }
        if (!commitHash || !flag) {
            process.stdout.write(
                `gitty cat-file: usage is to reads an object out of Gitty’s database and shows it to you`
            );
            throw new Error(
                `fatal: only two arguments allowed in <type> <object> mode, not 1`
            );
        }
        catFile(commitHash, flag);
        break;
    default:
        throw new Error(`error: unknown command: ${command}`);
}
