"use strict";

var express = require('express');
var router = express.Router();

const dsn =  process.env.DB_DSN || "mongodb://localhost:27017/chat";
const db = require("mongo-amj").init(dsn, 'messages');

router.get("/reset", async (req, res) => {
    try {
        await db.reset();
        await db.close();
        res.redirect('back');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
