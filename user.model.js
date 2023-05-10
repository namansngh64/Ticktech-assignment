const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: crypto.randomUUID()
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      trim: true
    },
    hobbies: [
      {
        type: String,
        required: true
      }
    ]
  },
  { timestamps: true }
);
userSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  next();
});

module.exports = mongoose.model("User", userSchema);
