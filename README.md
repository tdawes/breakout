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
