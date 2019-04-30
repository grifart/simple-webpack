#!/usr/bin/env bash

# Cleanup after test run
function cleanup {
	dist=$1; # 1st parameter
	rm yarn.lock
	rm -rf node_modules
	rm -rf ${dist}
}

function assertFileExists {
	file=$1;
	# if file does not exists
	if [[ ! -f ${file} ]]; then
		echo "Expected file ${file} does not exist.";
		exit 1;
	fi
}

function assertCommandDoesNotFail {
	result=$1
	if [[ ${result} -ne 0 ]]; then
		echo "Last command was expected to succeed, but it did not!"
		exit 1
	fi
}
