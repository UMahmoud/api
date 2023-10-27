// Import the MongoDB library or use your preferred MongoDB library
const { MongoClient } = require('mongodb');

// Vercel serverless function
module.exports = async (req, res) => {
  try {
    // Extract form data from the request body
    const {
      hoto,
      suna,
      sunanMahaifi,
      cikakkenAdreshi,
      lambarWaya,
      sanaa,
      matsayinAure,
      shekarunHaihuwa,
      lokacinKaratu,
    } = req.body;

    // Set up a MongoDB connection
    const uri = "mongodb+srv://umid:%4'6uN9G;H@@~sz@mbala.epvt0ry.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Connect to the MongoDB database
    await client.connect();

    // Select the MongoDB collection where you want to insert the data
    const collection = client.db('your-database-name').collection('your-collection-name');

    // Create a document with the form data
    const document = {
      hoto,
      suna,
      sunanMahaifi,
      cikakkenAdreshi,
      lambarWaya,
      sanaa,
      matsayinAure,
      shekarunHaihuwa,
      lokacinKaratu,
    };

    // Insert the document into the collection
    await collection.insertOne(document);

    // Close the MongoDB connection
    await client.close();

    // Send a response to the client
    res.status(200).json({ message: 'Form data has been submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
