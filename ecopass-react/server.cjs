
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database(
  path.join(__dirname, "ecopass.db"),
  (err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
    } else {
      console.log("Connected to SQLite database");
    }
  }
);

// Create passes table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS passes (
      id TEXT PRIMARY KEY,
      ownerName TEXT,
      vehicle TEXT,
      phone TEXT,
      passengers INTEGER,
      visitDate TEXT,
      vehicleType TEXT,
      gate TEXT,
      plastic INTEGER
    )
  `, (err) => {
    if (err) {
      console.error("Table creation failed:", err.message);
      return;
    }

    console.log("Passes table created successfully");

    // Import existing JSON records if they are not already present
    const jsonPath = path.join(__dirname, "..", "db.json");

    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

      const insert = db.prepare(`
        INSERT OR IGNORE INTO passes
        (id, ownerName, vehicle, phone, passengers,
         visitDate, vehicleType, gate, plastic)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      (data.passes || []).forEach((pass) => {
        insert.run(
          pass.id,
          pass.ownerName,
          pass.vehicle,
          pass.phone,
          pass.passengers,
          pass.visitDate,
          pass.vehicleType,
          pass.gate,
          pass.plastic ? 1 : 0
        );
      });

      insert.finalize();
      console.log("Existing visitor records imported");
    }
  });
});

// READ - Get all visitor passes
app.get("/passes", (req, res) => {
  db.all("SELECT * FROM passes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(rows.map(pass => ({
      ...pass,
      plastic: Boolean(pass.plastic)
    })));
  });
});

// SEARCH - Search visitor by name
app.get("/passes/search/:name", (req, res) => {
  const name = `%${req.params.name}%`;

  db.all(
    "SELECT * FROM passes WHERE ownerName LIKE ?",
    [name],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(rows.map(pass => ({
        ...pass,
        plastic: Boolean(pass.plastic)
      })));
    }
  );
});

// CREATE - Add a new visitor pass
app.post("/passes", (req, res) => {
  const pass = req.body;
  const id = pass.id || randomUUID();

  db.run(
    `INSERT INTO passes
    (id, ownerName, vehicle, phone, passengers,
     visitDate, vehicleType, gate, plastic)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      pass.ownerName,
      pass.vehicle,
      pass.phone,
      pass.passengers,
      pass.visitDate,
      pass.vehicleType,
      pass.gate,
      pass.plastic ? 1 : 0
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ ...pass, id });
    }
  );
});

// UPDATE - Update visitor details
app.put("/passes/:id", (req, res) => {
  const pass = req.body;

  db.run(
    `UPDATE passes SET
    ownerName = ?, vehicle = ?, phone = ?, passengers = ?,
    visitDate = ?, vehicleType = ?, gate = ?, plastic = ?
    WHERE id = ?`,
    [
      pass.ownerName,
      pass.vehicle,
      pass.phone,
      pass.passengers,
      pass.visitDate,
      pass.vehicleType,
      pass.gate,
      pass.plastic ? 1 : 0,
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ message: "Pass not found" });
      }

      res.json({ ...pass, id: req.params.id });
    }
  );
});

// DELETE - Delete visitor pass
app.delete("/passes/:id", (req, res) => {
  db.get(
    "SELECT * FROM passes WHERE id = ?",
    [req.params.id],
    (err, pass) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!pass) return res.status(404).json({ message: "Pass not found" });

      db.run(
        "DELETE FROM passes WHERE id = ?",
        [req.params.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            ...pass,
            plastic: Boolean(pass.plastic)
          });
        }
      );
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
