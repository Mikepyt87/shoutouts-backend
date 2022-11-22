import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import shoutoutRouter from "./routes/shoutoutRouter";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/shoutouts", shoutoutRouter);
export const api = functions.https.onRequest(app);
