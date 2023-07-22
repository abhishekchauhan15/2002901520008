const express = require("express");
const axios = require("axios");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const ROLL_NO = process.env.ROLL_NO;
const CLIENT_SECRET = process.env.CLIENT_SECRET;


let authToken = "";

async function getAuthToken() {
  try {
    const response = await axios.post(`${BASE_URL}/train/auth`, {
      companyName: "Abhi",
      clientID: CLIENT_ID,
      ownerName: "Abhishek",
      ownerEmail: "abhi@gmail.com",
      rollNo: ROLL_NO,
      clientSecret: CLIENT_SECRET,
    });
    authToken = response.data.access_token;
    console.log("response", authToken);
  } catch (error) {
    console.error("Error fetching authorization token:", error.message);
  }
}

async function fetchTrainDetails() {
  try {
    await getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios.get(`${BASE_URL}/train/trains`, config);
    // console.log(response.data);
    return response.data; // Replace this with the actual API response parsing
  } catch (error) {
    console.error("Error fetching train details:", error.message);
    return [];
  }
}

// Function to filter trains departing in the next 12 hours and ignore those departing in the next 30 minutes
function filterTrains(trains) {
  const now = new Date();
  const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  return trains.filter((train) => {
    const departureTime = new Date(
      `${new Date().toDateString()} ${train.departureTime}`
    );
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    return (
      departureTime > thirtyMinutesFromNow &&
      departureTime <= twelveHoursFromNow
    );
  });
}

// Function to calculate seat availability and pricing for sleeper and AC coaches
function calculateSeatAvailabilityAndPricing(train) {
  // Replace this with the actual calculations based on the train data
  train.seatsAvailable = {
    sleeper: Math.floor(Math.random() * 50) + 1,
    AC: Math.floor(Math.random() * 30) + 1,
  };
  train.price = {
    sleeper: Math.floor(Math.random() * 2000) + 500,
    AC: Math.floor(Math.random() * 5000) + 1000,
  };
  return train;
}

// Function to sort the trains based on price, ticket availability, and departure time
function sortTrains(trains) {
  return trains.sort((a, b) => {
    // Sort by price in ascending order
    const priceComparison = a.price.AC - b.price.AC;
    if (priceComparison !== 0) {
      return priceComparison;
    }

    // Sort by ticket availability in descending order
    const seatsComparison = b.seatsAvailable.AC - a.seatsAvailable.AC;
    if (seatsComparison !== 0) {
      return seatsComparison;
    }

    // Sort by departure time after considering delays in descending order
    const departureA = new Date(
      `${new Date().toDateString()} ${a.departureTime}`
    );
    const departureB = new Date(
      `${new Date().toDateString()} ${b.departureTime}`
    );
    departureA.setMinutes(departureA.getMinutes() + a.delayedBy);
    departureB.setMinutes(departureB.getMinutes() + b.delayedBy);

    return departureB - departureA;
  });
}

app.get("/trains", async (req, res) => {
  try {
    // Fetch train details from the API
    const trains = await fetchTrainDetails();

    // Filter trains departing in the next 12 hours and ignore those departing in the next 30 minutes
    const filteredTrains = filterTrains(trains);
    console.log("filteredTrains", filteredTrains)

    // Calculate seat availability and pricing for sleeper and AC coaches
    const processedTrains = filteredTrains.map(
      calculateSeatAvailabilityAndPricing
    );

    // Sort the trains based on price, ticket availability, and departure time
    const sortedTrains = sortTrains(processedTrains);

    // Limit the result to the top 4 trains
    const topTrains = sortedTrains.slice(0, 4);

    res.json(trains);
  } catch (error) {
    console.error("Error processing train data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
