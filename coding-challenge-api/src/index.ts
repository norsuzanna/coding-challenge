import express, { Request, Response } from "express";
import cors from "cors";

import { getUser } from "./controller/user";
import getSales from "./controller/sales";
import getSalesSummary from "./controller/sales-summary"

const app = express();
const port = 8080;

app.use(cors());

app.get("/user", getUser);
app.get("/sales", getSales);
app.get("/sales-summary", getSalesSummary);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
