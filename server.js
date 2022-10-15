//muuttujia
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
let sanakirja = [];
let data = fs.readFileSync("./sanakirja.txt", { encoding: "utf8", flag: "r" });
const splitLines = data.split(/\r?\n/);

//pannaan tauluun data
splitLines.forEach((line) => {
  const sanat = line.split(" ");
  const sana = {
    fin: sanat[0],
    eng: sanat[1],
  };
  sanakirja.push(sana);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS asetukset
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");
  next();
});

//GET metodi
app.get("/sanakirja", (req, res) => {
  res.json(sanakirja);
});

//GET metodi yhelle sanalle
app.get("/sanakirja/:fin", (req, res) => {
  const haettavaSana = String(req.params.fin);
  let palautettavaSana = "Ei löytynyt sanalle englanninkielistä vastinetta"; //alustetaan palautus tässä
  const splitLines = data.split(/\r?\n/);
  var Exception = {};

  /*
  tässä tämmönen vammanen try-catch foreach looppi

  katotaan joka riviltä sanat ja jos suomenkielinen sana vastaa parametria,
  niin heitetään exception, joka poistaa meijät loopista ilman, että käydään koko lista
  */
  try {
    splitLines.forEach((line) => {
      const sanat = line.split(" ");
      const sana = {
        fin: sanat[0],
        eng: sanat[1],
      };
      if (sana.fin === haettavaSana) {
        palautettavaSana = sana.eng;
        throw Exception;
      }
    });
  } catch (error) {
    if (error !== Exception) {
      throw error;
    }
  }
  res.json(palautettavaSana); //palautetaan sana
});

//POST metodi
app.post("/sanakirja", (req, res) => {
  const sanapari = req.body;
  sanakirja.push(sanapari);

  try {
    data += `\n${sanapari.fin} ${sanapari.eng}`;
    fs.writeFileSync("./sanakirja.txt", data);
    return res.status(201).json(sanapari);
  } catch (error) {
    console.log(error);
    return res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
