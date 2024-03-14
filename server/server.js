const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/med_donations", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define Schema and Model for your data
const donationSchema = new mongoose.Schema({
  name: String,
  presentation: String,
  form: String,
  laboratory: String,
  scannedLot: String,
  scannedExp: String,
  scannedGtin: String,
  createdAt: { type: Date, default: Date.now }, // Add createdAt field with default value
  updatedAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", donationSchema);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error caught in error handling middleware:", err); // Add console log to trace error
  res.status(500).json({ error: "Internal server error" });
});

// API Endpoint to handle data submission
// app.post("/api/donations", async (req, res, next) => {
//   try {
//     const {
//       name,
//       presentation,
//       form,
//       laboratory,
//       scannedLot,
//       scannedExp,
//       scannedGtin,
//     } = req.body;

//     if (!name || !presentation) {
//       return res
//         .status(400)
//         .json({ error: "Name and Presentation are required" });
//     }

//     const newDonation = new Donation({
//       name,
//       presentation,
//       form,
//       laboratory,
//       scannedLot,
//       scannedExp,
//       scannedGtin,
//     });

//     await newDonation.save();

//     res.status(201).json({ message: "Donation saved successfully" });
//   } catch (error) {
//     console.error("Error caught in API endpoint:", error); // Add console log to trace error
//     next(error); // Pass error to the error handling middleware
//   }
// });

// API Endpoint to handle data submission
// app.post("/api/donations", async (req, res, next) => {
//   try {
//     const {
//       name,
//       presentation,
//       form,
//       laboratory,
//       scannedLot,
//       scannedExp,
//       scannedGtin,
//       time, // Add time property to the request body
//     } = req.body;

//     if (!name || !presentation) {
//       return res
//         .status(400)
//         .json({ error: "Name and Presentation are required" });
//     }

//     const newDonation = new Donation({
//       name,
//       presentation,
//       form,
//       laboratory,
//       scannedLot,
//       scannedExp,
//       scannedGtin,
//       time, // Save the time property to the database
//     });

//     await newDonation.save();

//     res.status(201).json({ message: "Donation saved successfully" });
//   } catch (error) {
//     console.error("Error caught in API endpoint:", error); // Add console log to trace error
//     next(error); // Pass error to the error handling middleware
//   }
// });

// // API Endpoint to update a donation
// app.put("/api/donations/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const donation = await Donation.findById(id);

//     if (!donation) {
//       console.log("Donation not found:", id);
//       return res.status(404).json({ error: "Donation not found" });
//     }

//     const {
//       name,
//       presentation,
//       form,
//       laboratory,
//       scannedLot,
//       scannedExp,
//       scannedGtin,
//       time, // Add time property to the request body
//     } = req.body;

//     donation.name = name;
//     donation.presentation = presentation;
//     donation.form = form;
//     donation.laboratory = laboratory;
//     donation.scannedLot = scannedLot;
//     donation.scannedExp = scannedExp;
//     donation.scannedGtin = scannedGtin;
//     donation.time = time; // Update the time property in the database

//     await donation.save();

//     console.log("Donation updated successfully:", id);
//     res.json({ message: "Donation updated successfully" });
//   } catch (error) {
//     console.error("Error caught in API endpoint:", error);
//     next(error);
//   }
// });

// API Endpoint to fetch all donations sorted from newest to oldest
app.get("/api/donations", async (req, res, next) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Error caught in API endpoint:", error);
    next(error);
  }
});

// API Endpoint to handle data submission
app.post("/api/donations", async (req, res, next) => {
  try {
    const newDonation = new Donation({
      ...req.body,
    });

    await newDonation.save();

    res.status(201).json({ message: "Donation saved successfully" });
  } catch (error) {
    next(error);
  }
});

// API Endpoint to update a donation
app.put("/api/donations/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndUpdate(id, {
      ...req.body,
      updatedAt: new Date(),
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json({ message: "Donation updated successfully" });
  } catch (error) {
    next(error);
  }
});

// API Endpoint to delete a donation
app.delete("/api/donations/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);

    if (!donation) {
      console.log("Donation not found:", id);
      return res.status(404).json({ error: "Donation not found" });
    }

    console.log("Donation deleted successfully:", id);
    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error caught in API endpoint:", error); // Add console log to trace error
    next(error); // Pass error to the error handling middleware
  }
});

// Sample route to browse and ensure the API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error caught in middleware:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
