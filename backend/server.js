require("dotenv").load();
import express from "express";
import passport from "./config/passport";
import apiRoutes from "./routes/index";
import "./config/passport";
import bodyParser from "body-parser";
//import compression from 'compression';
import path from "path";
import mongoose from './config/db';
const app = express();

//app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api/", apiRoutes);
app.use(express.static(path.join(__dirname, '../www/landing')));
app.all("/", function(req, res) {
    res.sendFile(path.resolve(__dirname, "../www", "landing", "index.html"))
});
app.use(express.static(path.join(__dirname, '../www')));
// do not modify this. This is for react-router to work
app.get('/app*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../www', 'index.html'))
});

app.all('*', function(req, res) {
    res.redirect(303, '/')
})

export default app;
