import { createUser, createSession, verifyUser, verifyToken } from '../controllers/authController';
import { Router } from 'express';

const router = Router();

router.post(
  '/signup',
  createUser,
  createSession,
  (_, res) => {
    let statusCode = 200;
    // NOTE: why does hasLogged have so many potential values?
    if ([false, 'format', 'empty'].includes(res.locals.verification.hasLogged)) {
      statusCode = 401;
    }
    res.status(statusCode).json(res.locals.verification);
  }
);

router.post(
  '/login',
  verifyUser,
  createSession,
  (_, res) => {
    // testing purpose
    console.log(res.locals.verification);
    let statusCode = 200;
    if (res.locals.verification.hasLogged == false) {
      statusCode = 401;
    }
    res.status(statusCode).json(res.locals.verification);
  }
);

router.post('/verify', verifyToken, (_, res) => {
  res.locals.tokenVerif === true
    ? res.status(200).json({ verified: true })
    : res.status(401).json({ verified: false });
});

export default router;
