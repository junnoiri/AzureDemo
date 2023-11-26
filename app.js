require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5500;
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Provide static directory for frontend
app.use(express.static("static"));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", async (req, res) => {
  client.connect;

  // Get the selected drink name and freezing time from the query parameters
  const selectedDrink = req.query.selectedDrink;
  const minutes = req.query.selectedFreezingMinute;
  const seconds = req.query.selectedFreezingSecond;

  let mongoResult = await client
    .db("quebec-database")
    .collection("drinks")
    .find()
    .toArray();
  res.render("index", {
    drinkOptions: mongoResult,
    selectedDrink: selectedDrink,
    selectedFreezingMinute: minutes,
    selectedFreezingSecond: seconds,
  });
});

app.post("/addCustomDrink", async (req, res) => {
  try {
    const customDrinkName = req.body.customDrinkName;
    const freezingTime = req.body.freezingTime;

    // Added: Check if the input values are valid
    if (!customDrinkName || !freezingTime || isNaN(parseInt(freezingTime))) {
      return res
        .status(400)
        .send("Invalid input. Drink name and freezing time are required.");
    }

    const collection = client.db("quebec-database").collection("drinks");

    // Modified: Check if same drink name already exists
    const existingDrink = await collection.findOne({
      drinkName: customDrinkName,
    });
    if (existingDrink) {
      return res
        .status(400)
        .send("This drink already exists. Choose a different name.");
    }

    // Insert the custom drink into the database
    await collection.insertOne({
      drinkName: customDrinkName,
      freezingTime: String(freezingTime),
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the custom drink.");
  }
});

app.post("/selectDrink", async (req, res) => {
  try {
    const selectedDrink = req.body.selectedDrink;
    // console.log("selectedDrink:", selectedDrink);

    if (selectedDrink === "select") {
      return res.status(400).send("Please select a drink.");
    }

    // Assuming you have a MongoDB collection named "drinks"
    const collection = client.db("quebec-database").collection("drinks");

    // Find the selected drink's freezing time
    const drink = await collection.findOne({ drinkName: selectedDrink });
    // console.log("drink:", drink);

    if (drink) {
      // Get the freezing time of the selected drink
      const freezingTime = drink.freezingTime;

      // Convert freezing time to minutes and seconds
      const minutes = Math.floor(freezingTime);
      const seconds = Math.ceil((freezingTime - minutes) * 60);

      // console.log("minutes:", minutes);
      // console.log("seconds:", seconds);

      // Set redirect path and query parameters
      const redirectToPath = "/";
      const redirectToQuery = `?selectedDrink=${encodeURIComponent(
        selectedDrink
      )}&selectedFreezingMinute=${encodeURIComponent(
        minutes
      )}&selectedFreezingSecond=${encodeURIComponent(seconds)}`;

      // redirect
      res.redirect(redirectToPath + redirectToQuery);
    } else {
      // Handle the case where the drink is not found
      res.status(404).send("Selected drink not found in the database.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the custom drink.");
  }
});

app.get("/mail", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.grant_email,
      pass: process.env.grant_pass,
    },
  });

  var mailOptions = {
    from: process.env.grant_email,
    to: process.env.grant_email,
    text: "Test email",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

app.listen(port, () =>
  console.log(`Server is running...on http://localhost:${port}`)
);
