#!/bin/bash

checkcmd() {
    command -v "$1" >/dev/null || {
        echo "mergeBundle.sh: command $1 does not exist or is not executable." >&2
        exit 1
    }
}
checkcmd realpath
checkcmd unzip

if [ $# -ne 1 ] || [[ ! "$1" =~ ^.*\.bundle$ ]]; then
    echo "mergeBundle.sh: Usage: mergeBundle.sh <FILE.bundle>"
    exit 2
fi
FILE="$(realpath "$1")"
cd ./bundle/ || echo "mergeBundle.sh: ./bundle directory not found" >&2

unzip -n "$FILE" || {
    echo "Failed." >&2
    exit 1
}
echo "Success!"
