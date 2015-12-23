#!/usr/bin/env bash

echo -n "Running jslint. "
CUSTOM_TAGS="version,example,static,namespace,requires,property"
SRC_PATH="app"

fixjsstyle --strict --custom_jsdoc_tags "${CUSTOM_TAGS}" -r "${SRC_PATH}" -e "${SRC_PATH}"/assets/libs
gjslint --strict --custom_jsdoc_tags "${CUSTOM_TAGS}" -r "${SRC_PATH}" -e "${SRC_PATH}"/assets/libs
