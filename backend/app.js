const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
require("dotenv").config();

// Database connections
const meltEvaDbConnection = require("./connections/meltEvaDbConnection");
const meltRoxDbConnection = require("./connections/meltRoxDbConnection");

const app = express();
const port = process.env.PORT || 5000;

// InfluxDB Part
repl.repl.ignoreUndefined = true;

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const token = process.env.INFLUXDB_TOKEN;
const url = "https://us-east-1-1.aws.cloud2.influxdata.com";

const client = new InfluxDB({ url, token });

let org = `Testing`;
let bucket = `MelioLabs`;

let writeClient = client.getWriteApi(org, bucket, "ns");

for (let i = 0; i < 5; i++) {
  let point = new Point("measurement1")
    .tag("tagname1", "tagvalue1")
    .intField("field1", i);

  void setTimeout(() => {
    writeClient.writePoint(point);
  }, i * 1000); // separate points by 1 second

  void setTimeout(() => {
    writeClient.flush();
  }, 5000);
}

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
meltEvaDbConnection();
meltRoxDbConnection();

// Routes
app.use("/api", routes);

// Start server on port 5000 only when connected to database
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
