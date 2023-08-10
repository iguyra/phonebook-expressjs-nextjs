const mongoose = require("mongoose");

const phonebookSchema = new mongoose.Schema({
  createdAt: { type: Date, default: new Date().toLocaleString() },
  firstName: {
    type: String,
    minlength: 15,
    required: [true, "please provide your first name"],
  },
  lastName: {
    type: String,
    minlength: 15,
  },

  phoneNumber: {
    type: Number,
    minlength: 15,
    required: [true, "please provide your email"],
  },
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);
module.exports = Phonebook;
