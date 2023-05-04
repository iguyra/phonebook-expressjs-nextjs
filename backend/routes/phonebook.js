const express = require("express");
const {
  createPhonebook,
  getPhonebooks,
  updatePhonebook,
  deletePhonebook,
  searchPhonebooks,
} = require("../controllers/phonebookController");

const router = express.Router();

router
  .route("/")
  .post(createPhonebook)
  .get(getPhonebooks)
  .put(updatePhonebook)
  .delete(deletePhonebook);

router.route("/:term").get(searchPhonebooks);

module.exports = router;
