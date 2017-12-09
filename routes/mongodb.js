"use strict";

var express = require('express');
var router = express.Router();

const db = require("../src/mongodb/mongodb.js").mongoDB('mongodb://localhost:27017/chat', 'messages');

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
