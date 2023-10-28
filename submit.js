const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

async function connectToMongoDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    // Now you can perform database operations using `client.db()`
    return client.db(); // Return the database for further operations
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error; // Rethrow the error to be caught by the calling function
  }
}

module.exports = async (req, res) => {
  try {
    const db = await connectToMongoDB();
    
    // Extract form data from the request body
    const { hoto, suna, sunanMahaifi, cikakkenAdreshi, lambarWaya, sanaa, matsayinAure, shekarunHaihuwa, lokacinKaratu } = req.body;
    
    // Perform any necessary validation or processing of the form data
    
    // Insert the form data into the database
    await db.collection('forms').insertOne({
      hoto,
      suna,
      sunanMahaifi,
      cikakkenAdreshi,
      lambarWaya,
      sanaa,
      matsayinAure,
      shekarunHaihuwa,
      lokacinKaratu
    });
    
    res.status(200).send("Form submitted successfully");
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).send("Internal Server Error");
  }
};