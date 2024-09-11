import fs from "fs";
import path from "path";
import proc from "child_process";

function executeCommand(command) {
  return proc.execSync(command).toString().trim();
}

const commit = {
  sha: executeCommand("git rev-parse HEAD"),
  message: executeCommand("git log -1 --pretty=%B"),
  author: executeCommand("git log -1 --pretty=format:%an")
};

const json = JSON.stringify(commit);

fs.writeFileSync(path.resolve(import.meta.dirname, "../dist/commit.json"), json);
