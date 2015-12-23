# UI part pf project


## Install UI project:

1. Install [NodeJS](https://nodejs.org/)

Then run from your terminal:


```bash
$ npm install
```

For production mode run:

```bash
$ npm install --production
```

to avoid setup dev required modules.


## Build 

Every time you made a change for JavaScript, CSS or HTML files, you have to 
rebuild a project:


```bash
$ npm run-script build
```


Available options:


```
--js-source-map JavaScript Source Maps version 3
--js-optimization=[simple|advanced]
--xml-optimization
--no-base64=true avoid base64 transform
```


In generated folder `vendor/assets` you will find all files, according 
to profiles.


## JS Lint:

Before push your code, your must to check it with `JSLint` tool:


```bash
$ ./build/jslint.sh
```


## Run tests:


```bash
$ npm run-script test
```

then refer to `tests/coverage` folder and open `index.html` file in folder 
name of your browser was used.

You will find a page like that

![Unit Test Coverage](docs/unit-test-coverage.png)


## JSDoc

```bash
$ npm run-script doc
```

then refer to `docs/api/index.html`.
