require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/history.db", () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS history (
    service VARCHAR(255),
    timestamp TIMESTAMP,
    status VARCHAR(10),
    statusText VARCHAR(30), 
    ms INT,
    PRIMARY KEY(service, timestamp)
    );`,
    (err) => {
      if (err) console.log(err);
    }
  );
});

const app = express();

process.env.PORT = process.env.PORT || 8080;
process.env.INTERVAL = process.env.INTERVAL || 5000;

let lastUpdate = null;
let services;
try {
  services = require("./services.js");
} catch (error) {
  console.log(
    "services.js not found! Please rename the file services.sample.js to services.js!"
  );
  process.exit(0);
}

const checkService = async (service) => {
  let ms = null;
  let code = null;
  let status = "offline";
  let text = "Connection error";

  try {
    let start = Date.now();
    let response = await fetch(service.url, {
      follow: 0,
    });
    let end = Date.now();
    ms = end - start;
    code = response.status;
    text = response.statusText || "";
    if (code === (service.expectedCode || 200)) {
      status = ms < 250 ? "online" : "degraded";
    } else {
      status = "offline";
    }
  } catch (err) {}

  service.lastStatus = service.status;
  service.status = status;
  service.statusCode = code;
  service.statusText = text;
  service.ms = ms;
  lastUpdate = Date.now();

  if (service.lastStatus && service.lastStatus != service.status) {
    // TODO: WebHooks, Push Notifications, SMS, ...
  }

  db.run(
    "INSERT INTO history VALUES (?, ?, ?, ?, ?)",
    [service.name, Date.now(), status, text, ms],
    (err) => {
      if (err) console.log(err);
    }
  );
};

const checkStatus = () => {
  for (let service of services) {
    checkService(service);
  }
};

checkStatus();
setInterval(checkStatus, process.env.INTERVAL);

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

app.get("/services", (req, res) => {
  return res.json({
    lastUpdate,
    services: services.map((service) => {
      return {
        name: service.name,
        status: service.status,
        statusCode: service.statusCode,
        statusText: service.statusText,
        ms: service.ms,
      };
    }),
  });
});

app.get("/service/:name", (req, res) => {
  let service = req.params.name;
  let count = req.query.count;
  if (!count || count > 100) count = 100;

  if (services.find((s) => s.name === service)) {
    db.all(
      "SELECT timestamp, status, statusText, ms FROM history WHERE service = ? ORDER BY timestamp DESC LIMIT ?",
      [service, Number(count)],
      (err, rows) => {
        if (err) console.log(err);
        return res.json(rows.reverse());
      }
    );
  } else {
    return res.sendStatus(404);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`uptime-monitor server listening on port ${process.env.PORT}`);
});
