const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Ruta GET / (mostrar mensajes)
app.get("/", (req, res) => {
  try {
    const data = fs.readFileSync("mensajes.json", "utf-8"); // string
    const mensajes = JSON.parse(data); // array de objetos

    // Generar HTML simple
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Mensajes</title>
      </head>
      <body>
        <h1>Mensajes</h1>
        <a href="/index.html">Nuevo mensaje</a>
        <ul>
    `;

    mensajes.forEach((m) => {
      html += `<li><strong>${m.usuario}:</strong> ${m.mensaje}</li>`;
    });

    html += `
        </ul>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error leyendo mensajes");
  }
});

//  Ruta POST /nuevo-mensaje (guardar mensaje)
app.post("/nuevo-mensaje", (req, res) => {
  try {
    const nuevoMensaje = {
      usuario: req.body.usuario,
      mensaje: req.body.mensaje,
    };

    const data = fs.readFileSync("mensajes.json", "utf-8");
    const mensajes = JSON.parse(data);

    mensajes.push(nuevoMensaje);

    fs.writeFileSync(
      "mensajes.json",
      JSON.stringify(mensajes, null, 2),
      "utf-8",
    );

    // Redirigir al home para ver el nuevo mensaje
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error guardando mensaje");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
