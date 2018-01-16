"use strict";

var express = require('express');
var router = express.Router();

const dsn =  process.env.DB_DSN || "mongodb://localhost:27017/chat";
const db = require("mongo-amj").init(dsn, 'users');

router.post("/new", async (req, res) => {
    const data = await db.get({"name": req.body.name});

    await db.close();
    if (data.length > 0) {
        req.session['reg'] = 'User already exists.';
        res.redirect('/register');
        return;
    } else if (req.body.pw == req.body.pw_conf) {
        var item = {
            name: escape(req.body.name),
            pw: escape(req.body.pw),
            email: escape(req.body.email)
        };

        await db.insert(item);
        req.session['reg_success'] = 'You can now login.';
        res.redirect('/');
    } else {
        req.session['reg'] = "Passwords don't match.";
        res.redirect('/register');
    }
});

router.get("/reset", async (req, res) => {
    try {
        await db.reset();
        await db.close();
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
