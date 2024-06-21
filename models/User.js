import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Function to generate a random alphanumeric string
const generateRandomId = () => {
  return crypto.randomBytes(16).toString('hex');
};

const userSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
    default: generateRandomId() // Set the default value to the random ID generator
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: [true, "Username exists, Please try again"],
    minlength: [5, "Username should be at least 5 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter an Email"],
    unique: [true, "Email exists, Please try again"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    unique: true,
    minlength: [6, "Password should be at least 6 characters"]
  }
}, {
  timestamps: true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

// Pre-save hook to ensure the ID is generated
userSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = generateRandomId();
  }
  next();
});

const User = model('User', userSchema);

export default User;
