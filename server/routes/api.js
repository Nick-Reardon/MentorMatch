import { Router } from 'express';
import { getUsers, getUserGroups, getMessages, createMessage, deleteMessages, getSkills, addSkill, deleteSkill, addUserSkill, deleteUserSkill, updateemail } from '../controllers/dbController';
import { createNodes } from '../controllers/graphController';

const router = Router();


// ----- USERS ------
// ------------------
router.get('/allUsers', getUsers, (_, res) => {
  res.status(200).json(res.locals.users);
});

router.get('/allUserGroups', getUserGroups, (_, res) => {
  res.status(200).json(res.locals.userGroups);
});

// ---- MESSAGES ----
// ------------------
router.get('/messages/:targetEmail', getMessages, (_, res) => {
  res.status(200).json(res.locals.messages);
});

router.post('/sendMessage', createMessage, (_, res) => {
  res.status(200).json(true);
});

router.delete('/delMessage', deleteMessages, getMessages, (_, res) => {
  res.status(200).json(res.locals.messages);
});

// ---- SKILLS ----
// ---------------- 
router.get('/allSkills/:skill', getSkills, (_, res) => {
  res.status(200).json(res.locals.skills);
});

router.get('/allSkillGroups', getUserGroups, (_, res) => {
  res.status(200).json(res.locals.skillGroups);
});

router.post('/addSkill', addSkill, getSkills, (_, res) => {
  res.status(200).json(res.locals.skills);
});

// TODO: remove abbreviation on endpoint
router.delete('/delSkill', deleteSkill, getSkills, (_, res) => {
  res.status(200).json(res.locals.skills);
});

// TODO: fix casing on endpoint
router.post('/adduserskill', addUserSkill, getSkills, (_, res) => {
  res.status(200).json(res.locals.skills);
});

// TODO: fix casing on endpoint
// TODO: fix abbreviation on controller method
router.delete('/deleteuserskill', deleteUserSkill, getSkills, (_, res) => {
  res.status(200).json(res.locals.skills);
});

// ---- NODES -----
// ----------------
router.get(
  '/nodes/:skill',
  getSkills,
  createNodes,
  (_, res) => {
    const data = {
      skills: res.locals.skillName,
      nodes: res.locals.nodes,
      links: res.locals.links,
    };
    res.status(200).json(data);
  }
);

// TODO: fix casing on endpoint & controller method
router.put('/updateemail', updateemail, (_, res) => {
  res.status(200).json(res.locals.update);
});

export default router;
