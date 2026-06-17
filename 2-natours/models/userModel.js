import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is requeried"],
  },
  email: {
    type: String,
    required: [true, "email is requeried"],
    validate: [validator.isEmail, "email must have a correct schema"],
    unique: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,

    minLength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords are not matched",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: "admin",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // console.log(
    //   parseInt(this.passwordChangedAt.getTime() / 1000),
    //   this.passwordChangedAt.getTime() / 1000,
    // );
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256") // FIXED
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) {
    return;
  }
  this.passwordChangedAt = Date.now() - 1000;
});

// userSchema.pre("/^find/", function () {
//   this.find({ active: { $ne: false } });
// });

export const User = mongoose.model("user", userSchema);
