# Breakout

This is a monorepo.

- `packages/www`: [Next.js](https://nextjs.org/) app for build and server the frontend

## Getting Started

Start the frontend with

```
yarn start
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Everything is deployed on push to master and on successful CI.

- The server is deployed to [Heroku](https://dashboard.heroku.com/)
- The frontend is deployed to [Zeit](zeit.co/)

## CI

There is a Github action to build server and client on push.

## Theming

Component styling is accomplished with [ThemeUI](https://theme-ui.com/). The
theme for the site (light and dark mode) are defined in
`/packages/www/src/styles/index.ts`. The base components used can be seen at
[webrtc-experiement.now.sh/styles](https://webrtc-experiement.now.sh/styles).
