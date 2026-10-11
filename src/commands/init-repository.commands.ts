import fs from "node:fs";
import path from "node:path";

// initialize .gitty repository
export function initRepo(GIT_DIR:string) {
    if (fs.existsSync(GIT_DIR)) {
        console.info("Git repository already exists.");
        return;
    }

    //   stores files, trees, commits based on there hashes
    fs.mkdirSync(path.join(GIT_DIR, "objects"), { recursive: true });
    //   stores branch pointers
    fs.mkdirSync(path.join(GIT_DIR, "refs", "heads"), { recursive: true });
    //   tells current active branch
    fs.writeFileSync(path.join(GIT_DIR, "HEAD"), "ref: refs/heads/main\n");

    console.log(`Initialized empty gitty repository in ${GIT_DIR}`);
}