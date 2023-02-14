const express = require("express");
const fs = require("fs");
const dataRoute = "./pizzas.json";
const path = require("path");
const fileReaderAsync = require("./fileReader");
const fileWriterAsync = require("./fileWriter");

const filePath = path.join(`${__dirname}/pizzaTypes.json`);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9005;

app.get("/", (req, res) => {
  res.redirect(301, '/edit/pizza');
});

app.get(["/edit/pizza","/edit/pizza/:id"], async (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.use('/public', express.static(`${__dirname}/../frontend/public`));

app.get("/api/pizza", async function(req, res, next){
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  res.send(JSON.stringify(fileData));
})

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));