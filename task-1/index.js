const app = require("./app");

require("dotenv").config();
const cloudinary = require("cloudinary");

// db
const { MongoClient } = require("mongodb");

// Create a new MongoClient
MongoClient.connect(
  process.env.CONNECTION_URL,
  function (err, client) {
    if (err) throw err;
    console.log("CONNECTION SUCCESSFUL");
    db = client.db("eventsdb");
  },
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`listening on ${process.env.PORT} `);
});
