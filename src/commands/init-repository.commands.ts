import fs from "node:fs";
import path from "node:path";

// initialize .gitty repository
export function initRepo(GIT_DIR: string) {
    try {
        // stores files, trees, commits based on there hashes
        fs.mkdirSync(path.join(GIT_DIR, "objects"), { recursive: true });
        // stores branch pointers
        fs.mkdirSync(path.join(GIT_DIR, "refs", "heads"), { recursive: true });
        // HEAD file path
        const headPath = path.join(GIT_DIR, "HEAD");
        // only creates HEAD file if gitty is first time initialize to avoid overwrite of current branch
        if (!fs.existsSync(headPath)) {
            // create HEAD file
            fs.writeFileSync(headPath, "ref: refs/heads/main\n");
            process.stdout.write(
                `Initialized empty gitty repository in ${GIT_DIR}\n`
            );
            return;
        }
        process.stdout.write(
            `Reinitialized existing Git repository in ${GIT_DIR}\n`
        );
    } catch (error) {
        process.stderr.write(`fatal: error occurred\n${error}\n`);
        process.exit(1);
    }
}
