const showTrains = async (req, res) => {
  try {
    // Fetch train details from the API
    const trains = await fetchTrainDetails();

    // Filter trains departing in the next 12 hours and ignore those departing in the next 30 minutes
    const filteredTrains = filterTrains(trains);

    // Calculate seat availability and pricing for sleeper and AC coaches
    const processedTrains = filteredTrains.map(
      calculateSeatAvailabilityAndPricing
    );

    // Sort the trains based on price, ticket availability, and departure time
    const sortedTrains = sortTrains(processedTrains);

    // Limit the result to the top 4 trains
    const topTrains = sortedTrains.slice(0, 4);

    res.json(topTrains);
  } catch (error) {
    console.error("Error processing train data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default showStats;
