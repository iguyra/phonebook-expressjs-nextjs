const mongoose = require("mongoose");

const phonebookSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date().toLocaleString() },
  firstName: {
    type: String,
    lowercase: true,
  },
  lastName: {
    type: String,
    lowercase: true,
  },

  phoneNumber: {
    type: Number,
  },
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);
module.exports = Phonebook;
