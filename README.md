# NowHere (Expo)

Local-first nearby snaps. Pair this app with the backend `docker-compose.dev.yml` stack (gateway, snaps, Mailhog, MinIO). There is no hosted production URL.

## Run locally

```bash
npm install
npx expo start
```

Use a **development build** (`npx expo run:android` / `npx expo run:ios`). Nearby maps and camera need native modules that Expo Go does not include.

Point the app at the compose gateway and snaps socket (simulator defaults; on a phone use your machine’s LAN IP instead of `localhost`):

```bash
export EXPO_PUBLIC_GATEWAY_URL=http://localhost:3005
export EXPO_PUBLIC_SNAPS_SOCKET_URL=http://localhost:3000
```

Start the backend with `docker compose -f docker-compose.dev.yml up` from the backend repo.

## Demo notes

- **Location consent** — onboarding (and a one-shot upgrade screen) must be checked before GPS runs. Settings → Privacy notice explains what is stored.
- **Language** — Settings has an English / Deutsch toggle. It is stored on this device (MMKV), not on the server.
- **Password reset** — request a reset in the app, then open Mailhog at `http://localhost:8025` (SMTP `:1025` on the dev compose file). There is no production mail provider.
- **Export / delete** — Settings can share a JSON export and delete the account (password required). Data lives on the machine that runs compose.

## Checks

```bash
npm run lint
npm run typecheck
npm test -- --ci --forceExit
# or
npm run check
```

CI (`.github/workflows/frontend.yml`) runs lint, typecheck, and unit tests. It does not deploy, does not use secrets, and does not run Detox or Playwright.
