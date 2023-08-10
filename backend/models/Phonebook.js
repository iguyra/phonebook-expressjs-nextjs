const mongoose = require("mongoose");

const phonebookSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date().toLocaleString() },
  firstName: {
    type: String,
    lowercase: true,
    minlength: 15,
  },
  lastName: {
    type: String,
    lowercase: true,
    minlength: 15,
  },

  phoneNumber: {
    type: Number,
    minlength: 13,
  },
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);
module.exports = Phonebook;
