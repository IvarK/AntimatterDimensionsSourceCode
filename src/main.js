import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { browserCheck, init } from "../javascripts/game";

// eslint-disable-next-line capitalized-comments
// import { watchLatestCommit } from "@/commit-watcher";

if (browserCheck()) init();
// eslint-disable-next-line capitalized-comments
// watchLatestCommit();
