const mongoose = require("mongoose");

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    const devDATABASE = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );

    const db = await mongoose.connect(devDATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("DB CONNECTED");

    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.log(err, "Error connecting to database");
  }
}

module.exports = dbConnect;
