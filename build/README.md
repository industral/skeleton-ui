$ npm install

TO BUILD:

$ node build.js

OPTIONS:
--js-source-map JavaScript Source Maps version 3
--js-optimization=[simple|advanced]
--xml-optimization
--no-base64=true avoid base64 transform

Production:

$ node build.js --js-optimization=simple --xml-optimization

To build separate files:
$ node build.js --separate-files=true

in generated folder you will find all files, according profiles.

To run tests:

$ npm run-script test

Then refer to `tests/coverage` folder and open `index.html` file in folder 
name of your browser was used.
