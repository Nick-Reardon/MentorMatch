/** This file sets up all relevant mongoose schemas */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;
const { genSalt, hash, compare } = bcrypt;

// --------------
// ---- USER ----
// --------------
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  userGroup: { type: String, default: 'user' },
  newMessage: { type: Boolean, required: true, default: false },
  teach: [
    {
      name: String,
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'skill',
      },
    },
  ],
  learn: [
    {
      name: String,
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'skill',
      },
    },
  ],
});

// set up preprocess for encrypting password
userSchema.pre('save', async function save(next) {
  try {
    const SALT_WORK_FACTOR = 10;
    const salt = await genSalt(SALT_WORK_FACTOR);
    this.password = await hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

//cannot access password with arrow func
userSchema.methods.verify = async function (password) {
  const check = compare(password, this.password);
  return check;
};

const User = model('user', userSchema);

// --------------------
// ---- USER GROUP ----
// --------------------
const userGroupSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String },
});

const UserGroup = model('userGroup', userGroupSchema);

// ---------------
// ---- SKILL ---- 
// ---------------
const skillSchema = new Schema({
  name: { type: String, required: true },
  skillGroup: { type: String, default: 'skill' },
  teachers: [
    {
      firstName: String,
      lastName: String,
      email: String,
      userGroup: { type: String, default: 'user' },
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
});

const Skill = model('skill', skillSchema);

// ---------------------
// ---- SKILL GROUP ----
// ---------------------
const skillGroupSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String },
});

const SkillGroup = model('skillGroup', skillGroupSchema);

// -----------------
// ---- MESSAGE ----
// -----------------
const messageSchema = new Schema({
  // info stored on login
  sourceName: { type: String, required: true },
  sourceEmail: { type: String, required: true },
  contactEmail: { type: String, required: true },
  // info stored on node
  targetName: { type: String, required: true },
  targetEmail: { type: String, required: true },
  // message generate on click node and send message functionality
  messageBody: { type: String, required: true },
  skill: { type: String },
  isRead: { type: Boolean, default: false },

}, {timestamps: true});

const Message = model('message', messageSchema);

export default { User, UserGroup, Skill, SkillGroup, Message };
