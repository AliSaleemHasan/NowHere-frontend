# NowHere (Expo)

Nearby camera snaps on a map. Pairs with [NowHere-backend](https://github.com/AliSaleemHasan/NowHere-backend) `docker-compose.dev.yml`.

**There is no hosted production URL.** Not a store-listed app. Bundle IDs in `app.config.ts` are still Expo placeholders (`com.company.appname`).

Site: [ali-hasan.me/projects/nowhere](https://ali-hasan.me/projects/nowhere)

## Stack

Expo 53, React Native 0.79, Expo Router, MapLibre, TanStack Query, Zustand, MMKV, SecureStore, i18next DE/EN, expo-camera, Socket.IO client.

## Run

```bash
npm install
npx expo start
```

Use a **development build** (`npx expo run:android` / `npx expo run:ios`). Map and camera need native modules Expo Go does not include.

```bash
export EXPO_PUBLIC_GATEWAY_URL=http://localhost:3005
export EXPO_PUBLIC_SNAPS_SOCKET_URL=http://localhost:3000
```

On a physical phone, use the machine’s LAN IP, not `localhost`. Start the backend with `docker compose -f docker-compose.dev.yml up` from the backend repo.

## What works / what does not

Works: onboarding, location consent, map of nearby snaps, tags, camera capture (caption max **280** on the client), auth, settings (DE/EN in MMKV, not on the server), bookmarks, my snaps, JSON export / account delete (password required). Password reset uses Mailhog on the dev compose stack (`http://localhost:8025`).

Does not: production backend, store listing, Detox/Playwright, importing `libs/contracts` from the backend. Location is for the nearby feed, not a continuous background tracker.

## Checks

```bash
npm run lint
npm run typecheck
npm test -- --ci --forceExit
```

`.github/workflows/frontend.yml` runs lint, typecheck, and unit tests. It does not deploy.

Ali Saleem Hasan — [ali-hasan.me](https://ali-hasan.me)
