import "drag-drop-touch";
import "./shims";
import "./merge-globals";
import { DEV } from "@/env";
import { browserCheck, init } from "../javascripts/game";

import { watchLatestCommit } from "@/commit-watcher";

if (browserCheck()) init();
if (DEV) watchLatestCommit();
