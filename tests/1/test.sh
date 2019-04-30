#!/usr/bin/env bash
source ../functions.sh

cleanup dist

yarn install
yarn run build

echo "Check that it produces all expected files..."
assertFileExists dist/main.js
assertFileExists dist/main.js.map
assertFileExists dist/main.css
assertFileExists dist/main.css.map

echo "Check that webpack generated valid JavaScript...";
node dist/main.js
assertCommandDoesNotFail

cleanup dist
