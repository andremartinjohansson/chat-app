"use strict";

var express = require('express');
var router = express.Router();

const db = require("mongo-amj").init('mongodb://localhost:27017/chat', 'messages');

router.get("/", async (req, res) => {
    const data = await db.get();

    await db.close();
    res.render("index", {
        items: data
    });
});

module.exports = router;
