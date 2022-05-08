import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { browserCheck, init } from "../javascripts/game";

import { watchLatestCommit } from "@/commit-watcher";

if (browserCheck()) init();
watchLatestCommit();
