'use strict'

const express = require("express");
const jwork = require("./jwork.js");
const app = express();
const port = 3001;

app.use(express.static("public"));
jwork.rebuild();
let routes = jwork.getRoutes();

for (let route of routes) {
    if (route === 'index') {
        app.get("/", (req, res) => {
            res.sendFile(`${__dirname}/pages/index.html`);
        });
        continue;
    }

    app.get("/" + route, (req, res) => {
        res.sendFile(`${__dirname}/pages/${route}.html`);
    });
}



app.listen(port, () => {
    console.log(`Server started on port ${port}: http://localhost:${port}`);
})