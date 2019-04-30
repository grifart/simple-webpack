#!/usr/bin/env bash
function cleanup() {
	rm yarn.lock
	rm -rf node_modules
	rm -rf www/dist
}

cleanup
yarn install
yarn run build
cleanup
