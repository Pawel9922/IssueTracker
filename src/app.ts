import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import {MONGODB_URI} from "./util/configuration";
import exphbs from "express-handlebars";
import logger from "./util/logger";

import * as mainController from "./controllers/dashboardController";

const app = express();

mongoose.Promise = bluebird;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true } ).catch(err => {
    logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

app.set("port", process.env.PORT || 3000);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", mainController.dashboardController);

app.listen(app.get("port"), () => {
    logger.debug("App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"));
});
