# Vue3 + Firebase9 + Vuetify3 Template Project

WORK IN PROGRESS

## Project setup

1. Setup your firebase project, needs email auth, firestore, hosting, storage
2. `.firebaserc` should point to your project
3. `src/firebase-config.ts` needs updated to your projects config
4. npm install, both in main dir and in functions dir
5. `firebase deploy`

## Features

 - Authentication + Authorization
 - Admin Dashboard for users (promote,delete), guarded by cloud functions
 - Reload Persistance


## License

Public Domain

## Contributing

I'm open to PRs that improve the project's clarity/tidyness, or flesh out the user management system a bit more.

## TODOs

- update firestore with username on sign in
- 