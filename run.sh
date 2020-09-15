#!/usr/bin/env sh

set -eu

mvn --quiet exec:java -Dexec.mainClass=io.github.agathevaisse.DictionaryApp