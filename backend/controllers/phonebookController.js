const Phonebook = require("../models/Phonebook");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createPhonebook = catchAsync(async (req, res, next) => {
  let { firstName, lastName, phoneNumber } = req.body;

  if (!firstName || !lastName || !phoneNumber) {
    return next(new AppError("error", 400));
  }

  let phonebook = await Phonebook.findOne({
    phoneNumber: req.body.phoneNumber,
  });

  if (phonebook) {
    const message = `This phone number already exist`;
    return next(new AppError(message, 400));
  }

  phonebook = await Phonebook.create(req.body);

  res.status(200).send({ success: true, phonebook });
});

exports.getPhonebooks = catchAsync(async (req, res, next) => {
  let phonebooks = await Phonebook.find();

  res.status(200).send({ success: true, phonebooks });
});

exports.updatePhonebook = catchAsync(async (req, res, next) => {
  let phonebook = await Phonebook.findById(req.body._id);

  if (!phonebook) {
    return next(new AppError("this item does not exist", 400));
  }

  phonebook = await Phonebook.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  });

  res.status(200).send({ success: true, phonebook });
});

exports.deletePhonebook = catchAsync(async (req, res, next) => {
  let phonebook = await Phonebook.findById(req.body._id);

  if (!phonebook) {
    return next(new AppError("this item does not exist", 400));
  }

  phonebook = await Phonebook.findByIdAndDelete(req.body._id);

  res.status(200).send({ success: true, phonebook });
});

exports.searchPhonebooks = catchAsync(async (req, res, next) => {
  let { term } = req.query;

  let phonebook;
  if (term) {
    phonebook = await Phonebook.find({
      $or: [{ firstName: term }, { lastName: term }],
    });
  } else {
    phonebook = await Phonebook.find();
  }

  res.status(200).send({ success: true, phonebook });
});
