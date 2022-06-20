'use strict'

const express = require("express");
const jwork = require("./jwork.js");
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3001;
}

app.use(express.static("public"));
jwork.rebuild();
let routes = jwork.getRoutes();

console.log("Starting server");

for (let route of routes) {
    if (route === '/index') {
        app.get("/", (req, res) => {
            res.sendFile(`${__dirname}/pages/index.html`);
        });
        continue;
    }
    app.get(route, (req, res) => {
        res.sendFile(`${__dirname}/pages${route}.html`);
    });

    app.get(route + "/*", (req, res) => {
        res.sendFile(`${__dirname}/pages${route}.html`);
    });
}

app.use((req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        res.sendFile(`${__dirname}/pages/404.html`);
        return;
    }

    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Error 404: Not found');
});



app.listen(port, () => {
    console.log(`Server started on port ${port}: http://localhost:${port}`);
})