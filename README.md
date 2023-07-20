# Antimatter Dimensions

## Run

To run the game locally, you will need to install
[Node.js](https://nodejs.org/) (LTS suggested).

(As of right now we can only confirm that this repo builds properly on node v16, so for now you should ensure you have that main version to build AD. We are looking into this at the moment.)

First, run the following command in your terminal (or command line) while being
inside the checked out repository:

```
npm ci
```

After all the packages are installed, start up the game:

```
npm run serve
```

This will make the game served via your localhost, and the playable link will
be displayed in your terminal. The server **doesn't** need to be restarted
after you've made changes - just reload the page. The server **can**
occasionally crash, so check your terminal from time to time and run `serve`
again if needed.
