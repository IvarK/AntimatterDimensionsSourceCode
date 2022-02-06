import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { init } from "../javascripts/game";
import { watchLatestCommit } from "@/commit-watcher";

init();
watchLatestCommit();
