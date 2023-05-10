const { validationResult } = require("express-validator");
const User = require("./user.model");

exports.createUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg
    });
  }
  const { username, age, hobbies } = req.body;
  let user = new User({ username, age, hobbies });
  user.save((err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: "Error creating user" });
    }
    return res.status(201).json(user);
  });
};
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching users" });
    }

    return res.status(200).json(users);
  });
};
exports.getUserById = (req, res, next, id) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  if (!regexExp.test(id)) {
    return res.status(400).json({ error: "Id is not a valid uuid" });
  }
  User.findOne({ id: String(id) }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  });
};
exports.getUser = (req, res) => {
  return res.status(200).json(req.user);
};
exports.updateUser = (req, res) => {
  if (req.body.id) req.body.id = undefined;
  User.findOneAndUpdate(
    { id: req.user.id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Error while updating" });
      }
      return res.status(200).json(user);
    }
  );
};
exports.deleteUser = (req, res) => {
  User.findOneAndDelete({ id: req.user.id }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error while deleting user" });
    }
    return res.status(204).json({ deletedUser: user });
  });
};
