#!/usr/bin/env sh

set -eu

mvn --quiet verify exec:java "$@" -Dexec.mainClass=io.github.agathevaisse.DictionaryApp
