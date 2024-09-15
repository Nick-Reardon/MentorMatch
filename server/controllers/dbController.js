/* eslint-disable prefer-const */
import models from '../models/pfaModels.js';
import mongoose from 'mongoose';

const { Types } = mongoose;
const dbController = {};

// Obtain all users matching query filter and returning specified fields
dbController.getUsers = async (_, res, next) => {
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
dbController.getUserGroups = async (_, res, next) => {
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
    if (res.locals.getSkills == undefined && req.params.skill != 'all') {
      queryFilter.name = [req.params.skill];
    }
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
dbController.getSkillGroups = async (_, res, next) => {
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

dbController.createMessage = async (req, _, next) => {
  try {
    let {
      contactEmail,
      sourceName,
      sourceEmail,
      targetEmail,
      targetName,
      skill,
    } = req.body;

    if (!contactEmail) {
      contactEmail = sourceEmail;
    }

    // TODO: move this helper function to a utils file/subdirectory
    const generateMessage = (_, toName, skill) => {
      return (
        'Hi ' +
        toName +
        '. I saw on the platform that you are willing to teach ' +
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
      messageBody: generateMessage(sourceName, targetName, skill),
      skill,
    };

    await models.Message.create(messageDoc);
    await models.User.updateOne({email: targetEmail}, {$set: {newMessage: true}});
    
    return next();

  } catch (err) {
    console.log(err);
    return next();
  }
};

dbController.getMessages = async (req, res, next) => {
  try {
    let targetEmail;

    if (req.params.targetEmail) {
      targetEmail = req.params.targetEmail;
    } else {
      targetEmail = req.body.targetEmail;
    }

    const queryFilter = { targetEmail, };

    const specifiedFields = {};

    const updateFields = {
      $set: { isRead: true },
    };

    const messages = await models.Message.find(
      queryFilter,
      specifiedFields
    ).sort({ createdAt: -1 });

    await models.Message.updateMany(queryFilter, updateFields);
    res.locals.messages = messages;

    return next();
  } catch (err) {
    console.log('Error at dbController.getMessages');
    console.log(err);
    return next();
  }
};

dbController.deleteMessages = async (req, res, next) => {
  try {
    res.locals.deleted = false;

    if (!req.body.messageID) {
      return next();
    }

    const queryFilter = {
      _id: Types.ObjectId(req.body.messageID),
    };

    const message = await models.Message.findOneAndDelete(queryFilter);

    if (message) {
      res.locals.deleted = true;
    }

    return next();
  } catch (err) {
    console.log('Error at dbController.delMessages');
    console.log(err);
    res.locals.deleted = false;
    return next();
  }
};

dbController.addSkill = async (req, res, next) => {
  try {
    const skillDoc = {
      name: req.body.skillName,
    };

    await models.Skill.create(skillDoc);

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.addSkill');
    console.log(err);
    res.locals.deleted = false;
    return next();
  }
};

dbController.deleteSkill = async (req, res, next) => {
  try {
    if (!req.body.skillName) {
      return next();
    }

    const queryFilter = {
      name: req.body.skillName,
    };

    const skill = await models.Skill.findOneAndDelete(queryFilter);


    const teachers = skill.teachers;

    const userIDs = [];
    for (const teacher of teachers) {
      userIDs.push(Types.ObjectId(teacher._id));
    }

    
    await models.User.updateMany({_id: {$in: userIDs}}, {$pull: {teach: {name: skill.name}}});

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delSkill');
    console.log(err);
    return next();
  }
};


dbController.addUserSkill = async (req, res, next) => {
  try {
    const { skillName, email } = req.body;
    // console.log('req body: ', req.body);

    const userInfo = await models.User.findOne({email}, {});


    const newTeacher = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email,
      _id: userInfo._id
    };

    const skillInfo = await models.Skill.findOneAndUpdate({name: skillName}, { $push: {teachers: newTeacher}});

    const newSkill = {
      name : skillInfo.name,
      _id : skillInfo._id,
    };

    await models.User.updateOne({email}, { $push: {teach: newSkill}});

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.addUserSkill');
    console.log(err);
    return next();
  }
};

dbController.deleteUserSkill = async (req, res, next) => {
  try {
    const { skillName, email } = req.body;

    const userInfo = await models.User.findOneAndUpdate({email}, {$pull: {teach: {name: skillName}}});

    const skillInfo = await models.Skill.findOneAndUpdate({name: skillName}, { $pull: {teachers: {email: email}}});

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delUserSkill');
    console.log(err);
    return next();
  }
};

dbController.updateemail = async (req, res, next) => {
  try {
    const { newEmail, currentEmail } = req.body;

    const conflict = await models.User.findOne({email: newEmail});

    if (conflict != null) {
      res.locals.update = false;
      return next();
    }

    const skillFilter = {'teachers.email': currentEmail};
    const skillUpdate = {$set: {'teachers.$.email' : newEmail}};
    await models.Skill.updateMany(skillFilter, skillUpdate);

    const targetEmailFilter = {targetEmail: currentEmail};
    const targetEmailUpdate = {$set: {targetEmail: newEmail}};
    await models.Message.updateMany(targetEmailFilter, targetEmailUpdate);

    const sourceEmailFilter = {sourceEmail: currentEmail};
    const sourceEmailUpdate = {$set: {sourceEmail: newEmail}};
    await models.Message.updateMany(sourceEmailFilter, sourceEmailUpdate);

    const userFilter = {email: currentEmail};
    const userUpdate = {$set: {email: newEmail}};
    await models.User.updateOne(userFilter, userUpdate);

    res.locals.update = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delUserSkill');
    console.log(err);
    res.locals.update = false;
    return next();
  }
};


export default dbController;
