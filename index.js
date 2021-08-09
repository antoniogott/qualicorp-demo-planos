const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express()
const port = process.env.PORT || 3000

const qcapi = "https://apisimulador.qualicorp.com.br";

// Certificado da API inválido, workaround:
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/public/qualicorp.html")));

app.get("/profissoes", (req, res) => {
    const estado = req.query.estado;
    const cidade = encodeURIComponent(req.query.cidade.toUpperCase());
    const apiKey = "***REMOVED***";

    const url = new URL(`profissao/${estado}/${cidade}`, qcapi);
    url.search = `api-key=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(profissoes => {
            res.send(profissoes);
        });
});

app.get("/entidades", (req, res) => {
    const estado = req.query.estado;
    const cidade = encodeURIComponent(req.query.cidade.toUpperCase());
    const profissao = encodeURIComponent(req.query.profissao);
    const apiKey = "***REMOVED***";

    const url = new URL(`entidade/${profissao}/${estado}/${cidade}`, qcapi);
    url.search = `api-key=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(entidades => {
            res.send(entidades);
        });
});

app.get("/planos", (req, res) => {
    const estado = req.query.estado;
    const cidade = req.query.cidade;
    const entidade = req.query.entidade.split(" - ")[0];
    const nasc = req.query.nasc;
    const apiKey = "***REMOVED***";

    const url = new URL(`plano`, qcapi);
    url.search = `api-key=${apiKey}`;

    const body = {
        "entidade": entidade,
        "uf": estado,
        "cidade": cidade,
        "datanascimento": [nasc]
    }

    const q = JSON.stringify(body);

    fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "x-gravitee-transaction-id": "69705fe6-8380-4886-b05f-e6838018869d"
        }
    })
        .then(res => res.json())
        .then(resPlanos => {
            res.send(resPlanos);
        });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
