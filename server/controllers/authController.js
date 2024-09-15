import mongoose from 'mongoose';
import jswt from 'jsonwebtoken';
import models from '../models/pfaModels.js';

const { Types } = mongoose;
const { sign, verify } = jswt;

const authController = {};

// TODO: move this helper function into a utils file/subdirectory
function validateEmail(str) {
  // NOTE: what the heck is this regex doing?
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(str).toLowerCase());
}

authController.verifyUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.locals.verification = {
        hasLogged: false,
      };
      return next();
    }

    // object specifying the fields to be requested from db
    const specifiedFields = {
      _id: 0,
      firstName: 1,
      lastName: 1,
      email: 1,
      isAdmin: 1,
      newMessage: 1,
    };

    // TODO: confirm whether the type of hasLogged stays as boolean, or changes?
    // ... if it changes, then why? (not good practice)
    const verification = {
      hasLogged: false,
    };
    
    const user = await models.User.findOne({ email });

    if (!user || (await user.verify(password)) === false) {
      verification.hasLogged = false;
      res.locals.verification = verification;
      return next();
    } else if (user && (await user.verify(password)) === true) {
      verification.hasLogged = true;
      verification.userInfo = {};
      for (const key in specifiedFields) {
        verification.userInfo[key] = user[key];
      }

      if (user.newMessage) {
        await models.User.updateOne({ email }, {$set: {newMessage: false}});
      }

      res.locals.verification = verification;
      return next();
    }
  } catch (err) {
    return next({
      log: 'Express error handler caught an error at authController.verifyUser',
      message: { err },
    });
  }
};

authController.createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, skillsToTeach } = req.body;
    const verification = {
      hasLogged: false,
    };
    // console.log(req.body);
    if (!email || !password || !firstName || !lastName) {
      res.locals.verification = {
        hasLogged: 'empty',
      };
      return next();
    }
    if (!validateEmail(email)) {
      verification.hasLogged = 'format';
      res.locals.verification = verification;
      return next();
    }

    const teach = [];
    for (const key in skillsToTeach) {
      teach.push({
        name: key,
        _id: Types.ObjectId(skillsToTeach[key]),
      });
    }

    // object specifying the filters on query
    const userDoc = {
      email,
      password,
      firstName,
      lastName,
      teach,
    };

    // object specifying the fields to be returned from db
    const specifiedFields = {
      firstName: 1,
      lastName: 1,
      email: 1,
      isAdmin: 1,
      newMessage: 1,
    };
  
    const emailExist = await models.User.findOne({ email });

    if (emailExist) {
      res.locals.verification = verification;
      return next();
    }

    const user = await models.User.create(userDoc);

    // update teachers in skill to reflect the new user
    const newTeacher = {
      firstName,
      lastName,
      email,
      _id: user._id,
    };

    const skills = Object.keys(skillsToTeach);
    if (skills.length != 0) {
      await models.Skill.updateMany(
        { name: { $in: skills } },
        { $push: { teachers: newTeacher } }
      );
    }

    verification.hasLogged = true;
    verification.userInfo = {};

    // pull requested fields from user info returned from db
    for (const key in specifiedFields) {
      verification.userInfo[key] = user[key];
    }
    res.locals.verification = verification;

    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: 'Express error handler caught an error at authController.verifyUser',
      message: { err },
    });
  }
};

authController.createSession = (req, res, next) => {
  try {
    if (res.locals.verification.hasLogged !== true) {
      return next();
    }
    const token = sign({ id: req.body.email }, process.env.ID_SALT);
    res.cookie('ssid', token, { maxAge: 300000 });
    return next();
  } catch (err) {
    console.log(err);
  }
};

authController.verifyToken = (req, res, next) => {
  try {
    const token = req.body.token;
    const isToken = verify(token, process.env.ID_SALT);

    if (isToken.id) {
      console.log('isToken is', isToken);
      res.locals.tokenVerif = true;

    } else res.locals.tokenVerif = false;
    
    return next();
  } catch (err) {
    
    return next({
      log: 'Express error handler caught an error at authController.verifyToken',
      message: { err },
    });
  }
};

export default authController;
