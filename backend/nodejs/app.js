import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { webhook_post, webhook_get } from "./controllers/webhook.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["*"],
  })
);

app.post("/webhook", webhook_post);
app.get("/webhook", webhook_get);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
