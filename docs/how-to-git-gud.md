# How to gid gud?

This a reference sheet for the common development tasks
that you need to do to work on your mod.

**I want to start**

1. Install [Node LTS][]
2. Install [GitHub Desktop][]
3. Install [VS Code][]
4. Open GitHub Desktop and [clone][] repository
   https://github.com/IvarK/AntimatterDimensionsSourceCode
5. Open a cloned repository in VS Code, open a terminal
   (Terminal -> New Terminal)
6. In terminal run `npm ci`, wait for it to finish
7. In terminal run `npm run serve`, wait for it to finish
8. Open http://localhost:8080/ in your browser
9. You should see the game running on your local server

Now you can start edit the code is `src` folder, or
images/sounds/css in `public` folder.

**I want to start *and* I don't want to lose my changes
when my PC dies of cardiac arrest after it sees my code**

Do everything listed above, but [fork][] the repository,
and clone it instead. When working on the code, [commit][]
and [push][] your changes often.

**I restarted my PC and I want to continue where I left off**

1. Open a repository in VS Code, open a terminal
   (Terminal -> New Terminal)
2. Run `npm run serve`, wait for it to finish
3. Open http://localhost:8080/
4. You should see the game running on your local server

**New changes were pushed to the main AD repository and
I want to update my mod to these changes**

0. Pray to the highest powers that you don't get merge
   conflicts

If you did the stuff in **I want to start** section:

1. Open GitHub Desktop and [commit][] all your local
   changes.
2. After that, [sync][] your branch with the master
   branch
3. (Optional) If you've got merge conflicts, go to
   **Something's not working / I'm stuck** section

If you did the stuff in the fork section:

1. From the GitHub website you can [sync your fork][]
2. (Optional) If you've got merge conflicts, go to
   **Something's not working / I'm stuck** section

**Something's not working / I'm stuck**

Go to Discord channel #modifications-development and ask
your question there.

[//]: # (Links)

[Node LTS]: https://nodejs.org/
[GitHub Desktop]: https://desktop.github.com/
[VS Code]: https://code.visualstudio.com/
[clone]: https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop
[fork]: https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop
[commit]: https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop
[push]: https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/making-changes-in-a-branch/pushing-changes-to-github-from-github-desktop
[sync]: https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/keeping-your-local-repository-in-sync-with-github/syncing-your-branch-in-github-desktop
[sync your fork]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork
