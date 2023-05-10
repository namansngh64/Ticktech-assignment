const { body } = require("express-validator");
const {
  createUser,
  getAllUsers,
  getUserById,
  getUser,
  updateUser,
  deleteUser
} = require("./user.controller");

const express = require("express");
const router = express.Router();

router.param("userId", getUserById);

router.post(
  "/users",
  body("username", "Username is required").isLength({ min: 1 }),
  body("age", "Age is required").isNumeric(),
  body("hobbies", "Hobbies is required").isArray(),
  createUser
);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

module.exports = router;
