# Project: Cassian
## Vue.js frontend

Project: Cassian is our open-source collaborative game design platform.  This is a Vue.js frontend for it.

### How to get it up and running

As it stands right now you need both the API and the client running locally.  This is because the API calls are all hardcoded right now.  Ew.  So go ahead and set up [cassian-api](https://github.com/bitphoenixsoftware/cassian-api) first before continuing.

Once that's done, it's mostly a matter of:

```
npm install
```

...to install dependencies, and then you can either do

```
npm run serve
```

...to run the development web server that hot-reloads as you make changes or...

```
npm run build
```

...to build the frontend for production use.  Also, even though we don't use unit tests because bla bla boring bla bla, you can

```
npm run test
```

to run the non-existent unit tests anyway.  I really don't know why you'd do that though, you'd have a better chance of fixing Michael's yucky coding inconsistencies by running

```
npm run lint
```

...to lint the entire project and spray air-freshener all over the yucky code smells.