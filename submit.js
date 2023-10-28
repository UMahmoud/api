const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const multer = require('multer');
const Joi = require('joi');
const { createLogger, transports } = require('winston');

const storage = multer.memoryStorage();
const upload = multer({ storage });

let cachedDb = null;

async function connectToMongoDB() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db(); // Get the database
    cachedDb = db; // Cache the database connection
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  }
}

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

// Define a schema for form validation
const formSchema = Joi.object({
  hoto: Joi.string().required(),
  suna: Joi.string().required(),
  sunanMahaifi: Joi.string().required(),
  cikakkenAdreshi: Joi.string().required(),
  lambarWaya: Joi.string().allow(''),
  sanaa: Joi.string().required(),
  matsayinAure: Joi.string().required(),
  shekarunHaihuwa: Joi.date().iso().required(),
  lokacinKaratu: Joi.array().items(Joi.string()).required(),
});

module.exports = async (req, res) => {
  try {
    const db = await connectToMongoDB();

    // Multer middleware to handle file upload
    upload.single('hoto')(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        res.status(500).send("Error uploading file");
        return;
      }

      // Validate form data
      const { error, value } = formSchema.validate(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }

      const hotoFile = req.file; // Uploaded file object

      // Insert the sanitized form data into the database
      await db.collection('forms').insertOne({
        hoto: hotoFile.buffer, // Store the file buffer in the database
        ...value,
      });

      res.status(200).send("Form submitted successfully");
    });
  } catch (error) {
    logger.error("Error handling the request:", error);
    res.status(500).send("Internal Server Error");
  }
};