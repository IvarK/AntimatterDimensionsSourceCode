import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { init, browserCheck } from "../javascripts/game";
import { watchLatestCommit } from "@/commit-watcher";

if (browserCheck()) init();
watchLatestCommit();
