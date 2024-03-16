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
router.get("/winnersOscar", (req, res) => {
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
router.get("/winnersOscar/:id", (req, res) => {
  const id = `oscars-${req.params.id}.json`;
  const winerOscarPathId = winerOscarPath + "/" + id;
  fs.readFile(winerOscarPathId, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const winnersOscar = JSON.parse(data);
      if (winnersOscar) {
        res.json(winnersOscar);
      } else {
        res.status(404).send("Fichero no encontrado.");
      }
    }
  });
});

router.post("/winnersOscar/:id", (req, res) => {
  const id = `oscars-${req.params.id}.json`;
  const winerOscarPathId = winerOscarPath + "/" + id;

  // Leemos la ruta de los json
  fs.readFile(winerOscarPathId, (error, data) => {
    let winnersOscar = [];

    if (!error) {
      // si existe el fichero .json del año selecionado, almaceno los datos en un array previamente creado
      try {
        winnersOscar = JSON.parse(data);
      } catch (error) {
        res.status(500).send("Error inesperado");
      }
    }
    // si no existe el fichero .json del año seleccionado relleno un objecto con el body de la request,
    // y lo pusheo en un array anteriormente creado
    const newWinnerOscar = req.body;
    winnersOscar.push(newWinnerOscar);

    // Guardamos fichero, si no existe lo crea
    fs.writeFile(winerOscarPathId, JSON.stringify(winnersOscar), (error) => {
      if (error) {
        res.status(500).send("Error inesperado");
      } else {
        res.json(newWinnerOscar);
      }
    });
  });
});

server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});
