const express = require("express");
const fs = require("fs");
const PORT = 3000;
const server = express();
const router = express.Router();
const winerOscarPath = "./data";

// Configuración del server
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
// Home
router.get("/", (req, res) => {
  fs.readFile("./templates/index.html", "utf-8", (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      res.set("Content-Type", "text/html");
      res.send(data);
    }
  });
});
// listado de años disponibles
router.get("/winersOscar", (req, res) => {
  fs.readdir(winerOscarPath, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const mydata = data.map((x, i) => data[i].replace("oscars-", "").replace(".json", ""));
      const newObject = {
        years: mydata,
      };

      if (newObject) {
        res.json(newObject);
      } else {
        res.status(404).send("Error inesperado lista Años.");
      }
    }
  });
});
// .Json de un año seleccionado 2011, 2012 ...
router.get("/winersOscar/:id", (req, res) => {
  const id = `oscars-${req.params.id}.json`;
  const winerOscarPathId = winerOscarPath + "/" + id;
  fs.readFile(winerOscarPathId, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const winersOscar = JSON.parse(data);
      if (winersOscar) {
        res.json(winersOscar);
      } else {
        res.status(404).send("Fichero no encontrado.");
      }
    }
  });
});

router.post("/winersOscar/:id", (req, res) => {
  // Leemos el fichero pokemons
  fs.readFile(winerOscarPath, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const pilotosF1 = JSON.parse(data);
      const newPilotoF1 = req.body;
      const lastId = pilotosF1[pilotosF1.length - 1].id;
      newPilotoF1.id = lastId + 1;
      pilotosF1.push(newPilotoF1);

      // Guardamos fichero
      fs.writeFile(pilotosFilePath, JSON.stringify(pilotosF1), (error) => {
        if (error) {
          res.status(500).send("Error inesperado");
        } else {
          res.json(newPilotoF1);
        }
      });
    }
  });
});

server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});
