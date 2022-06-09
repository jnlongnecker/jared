#!/bin/sh

echo "Component name?"
read COMP_NAME

cd src
mkdir $COMP_NAME
cd $COMP_NAME

CLASS_NAME=${COMP_NAME^}
JS_CONTENT="export default class ${CLASS_NAME} extends HTMLElement {}"

echo $JS_CONTENT > $COMP_NAME.js
echo "<!-- To Do -->" > $COMP_NAME.html
echo "/* To Do /*" > $COMP_NAME.css