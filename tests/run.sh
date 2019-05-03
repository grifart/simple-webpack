#!/usr/bin/env bash

# build sources of package
yarn run build

# run individual tests
cd 1
bash test.sh
cd ..

cd 2
bash test.sh
cd ..

