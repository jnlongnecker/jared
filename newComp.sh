#!/bin/sh

echo "Component name?"
read COMP_NAME

echo "Attach Shadow? (y/n)"
read SHADOW_CHOICE

cd src
mkdir $COMP_NAME
cd $COMP_NAME

CLASS_NAME=${COMP_NAME^}
JS_CONTENT="${SHADOW_CONTENT}export default class ${CLASS_NAME} extends HTMLElement {}"

if [ $SHADOW_CHOICE = "n" ]
then
    NEWLINE=$'\n'
    echo "/* jwork flag no-shadow */$NEWLINE$JS_CONTENT" > $COMP_NAME.js
else
    echo $JS_CONTENT > $COMP_NAME.js
fi
echo "<!-- To Do -->" > $COMP_NAME.html
echo "/* To Do /*" > $COMP_NAME.css