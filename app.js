const express = require("express");
const jwork = require("./jwork.js");
const app = express();
const port = 3001;

app.use(express.static("public"));
jwork.rebuild();


app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}: http://localhost:${port}`);
})