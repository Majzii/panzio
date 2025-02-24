const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
app .use(bodyParser.json());

const db = mysql.createConnection(
    {
        user: "root",
        host: "localhost",
        password: "",
        database: "fogado",
    }
);

app.get("/", (req, res) => {
    res.send("Fut a backend!");
})

app.listen(3001, () => {
    console.log("Server is runningg on port 3001");
});

app.get("/szobak",(req, res) => {
    const sql = "SELECT * FROM `szobak`";
    db.query(sql, (err, result) => {
        if(err) return res.json(err);
        return res.json(result)
    })
})

app.get("/szobafoglaltsag/:sznev",(req, res) => {
    const {sznev} = req.params;
    const sql = "SELECT vendegek.vnev AS 'Vendég neve', foglalasok.erk AS 'Érkezés', foglalasok.tav AS 'Távozás' FROM `foglalasok` INNER JOIN vendegek ON foglalasok.vendeg = vendegek.vsorsz INNER JOIN szobak ON foglalasok.szoba = szobak.szazon WHERE szobak.sznev = ? ORDER BY vendegek.vnev ASC";
    db.query(sql, [sznev], (err, result) => {
        if(err) return res.json(err);
        return res.json(result)
    })
})

app.get("/foglaltsag/:szazon",(req, res) => {
    const { szazon } = req.params;
    const sql = `SELECT vendegek.vnev, foglalasok.erk, foglalasok.tav
    FROM foglalasok
    JOIN vendegek ON foglalasok.vendeg = vendegek.vsorsz
    WHERE foglalasok.szoba = ?
    ORDER BY vendegek.vnev ASC`;
    db.query(sql, [szazon], (err, result) => {
        if(err) return res.json(err);
        return res.json(result)
    })
})