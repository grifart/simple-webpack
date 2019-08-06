#!/usr/bin/env bash
source ../functions.sh

cleanup www/dist

yarn install
yarn run build

echo "Check that it produces all expected files..."
assertFileExists www/dist/main.js
assertFileExists www/dist/main.js.map
assertFileExists www/dist/main.css
assertFileExists www/dist/main.css.map
assertFileExists www/dist/test.csv

echo "Check that webpack generated valid JavaScript...";
node www/dist/main.js
assertCommandDoesNotFail

cleanup www/dist
