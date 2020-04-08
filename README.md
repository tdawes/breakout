# Breakout

Deployed to [prodo-breakout.now.sh](https://prodo-breakout.now.sh).

![CI](https://github.com/prodo-dev/breakout/workflows/CI/badge.svg)

This is a monorepo.

- `packages/www`: [Next.js](https://nextjs.org/) app for frontend.
- `packages/server`: [Socket.IO](https://socket.io/) server for web socket communication.

## Getting Started

You need to run two things locally: the frontend and the server.

Start the frontend with

```
yarn start
```

Open [http://localhost:3000](http://localhost:3000).

Start the server in another terminal with

```
yarn start:server
```

### Creating a Firebase environment

1. Open [the Firebase console](https://console.firebase.google.com/)
2. Click "Add new project"
3. Name your project - the convention for development environments is `breakout-development-<name>`
4. In your project's console, click `Database ⟶ Create Database ⟶ Firestore ⟶ Create database`
5. Start the database in locked mode - we'll configure permissions later.

The rest of this README will assume that you created an environment with a project ID of `breakout-development-FOOBAR` - note that your project ID might not be the same as your chosen project name, as Firebase project IDs must be globally unique.

### Configuring your environment locally

1. Add a file named _envrc.local_ with the following contents:

   ```
   #!/bin/bash

   export GOOGLE_CLOUD_PROJECT='breakout-development-FOOBAR'
   ```

2. Create a folder under _packages/www/config/projects/breakout-development-FOOBAR_.
3. Inside this folder, create the following files:

   _ui.json_

   ```
   {
     "firebase": {
       "apiKey": "<api-key>",
       "authDomain": "breakout-development-FOOBAR.firebaseapp.com",
       "databaseURL": "https://breakout-development-FOOBAR.firebaseio.com",
       "projectId": "breakout-development-FOOBAR"
     }
   }
   ```

   where `<api-key>` is the Firebase Web API key, which can be found in the Firebase console by clicking `Settings ⟶ Project Settings ⟶ General`.

## Deployment

Everything is deployed on push to master and on successful CI.

- The server is deployed to [Heroku](https://dashboard.heroku.com/)
- The frontend is deployed to [Zeit](zeit.co/)

## CI

There is a [Github action](https://github.com/prodo-dev/breakout/actions) to build everything on push.

## Theming

Component styling is accomplished with [ThemeUI](https://theme-ui.com/). The
theme for the site (light and dark mode) are defined in
`/packages/www/src/styles/index.ts`. The base components used can be seen at
[localhost:3000/styles](http://localhost:3000/styles).
