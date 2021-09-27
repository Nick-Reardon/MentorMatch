const models = require('../models/pfaModels');

const dbController = {};

// Obtain all users matching query filter and returning specified fields
dbController.getUsers = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      firstName: 1,
      lastName: 1,
      email: 1,
    };

    const users = await models.User.find(queryFilter, specifiedFields);
    res.locals.users = users;
    res.locals.userCount = users.length;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getUsers',
      message: { err },
    });
  }
};

// Obtain all user groups matching query filter and returning specified fields
dbController.getUserGroups = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      name: 1,
      color: 1,
    };

    const userGroups = await models.UserGroup.find(
      queryFilter,
      specifiedFields
    );
    res.locals.userGroups = userGroups;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getUserGroups',
      message: { err },
    });
  }
};

// Obtain all skills matching query filter and returning specified fields
dbController.getSkills = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      name: 1,
      skillGroup: 1,
      teachers: 1,
    };

    const skills = await models.Skill.find(queryFilter, specifiedFields);
    res.locals.skills = skills;
    res.locals.skillCount = skills.length;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getSkills',
      message: { err },
    });
  }
};

// Obtain all user groups matching query filter and returning specified fields
dbController.getSkillGroups = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      name: 1,
      color: 1,
    };

    const skillGroups = await models.SkillGroup.find(
      queryFilter,
      specifiedFields
    );
    res.locals.skillGroups = skillGroups;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getSkillGroups',
      message: { err },
    });
  }
};

dbController.createMessage = async (req, res, next) => {
  try {
    const {
      contactEmail,
      sourceName,
      sourceEmail,
      targetEmail,
      targetName,
      skill,
    } = req.body;

    const genMessage = (fromName, toName, skill) => {
      return (
        'Hi' +
        toName +
        ', I am ' +
        fromName +
        ' from the learning group. I saw on the platform that you\'r willing to teach the skill ' +
        skill +
        ' and was wondering if I can learn from you. If you are avaliable, please contact me at: ' +
        contactEmail
      );
    };

    const messageDoc = {
      contactEmail,
      sourceName,
      sourceEmail,
      targetEmail,
      targetName,
      messageBody: genMessage(sourceName, targetName, skill),
      skill,
    };

    const message = await models.Message.create(messageDoc);

    return next();
  } catch (err) {
    console.log(err);
    return next();
  }
};

dbController.getMessages = async (req, res, next) => {
  try {
    console.log(req.params.email);

    const queryFilter = {
      sourceEmail: req.params.sourceEmail,
    };

    const specifiedFields = {};


    const messages = await models.Message.find(queryFilter, specifiedFields);

    res.locals.messages = messages;
    
    return next();
  } catch (err) {
    console.log(err);
    return next();
  }
};


module.exports = dbController;
