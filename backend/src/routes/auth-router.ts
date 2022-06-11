
import authService from '@services/auth-service';
import { ParamMissingError } from '@shared/errors';
import { Request, Response, Router } from 'express';
import { body, check, validationResult } from 'express-validator';
import StatusCodes from 'http-status-codes';
import userRepo from '../database/user-repo';
import { IUser } from '../models/user-model';


// Constants
const router = Router();
const { OK } = StatusCodes;

// Paths
export const p = {
  login: '/login',
  register: '/register',
  logout: '/logout',
} as const;

// Cookie Properties
export const cookieProps = Object.freeze({
  key: 'ExpressGeneratorTs',
  secret: process.env.COOKIE_SECRET,
  options: {
    httpOnly: true,
    signed: true,
    path: (process.env.COOKIE_PATH),
    maxAge: Number(process.env.COOKIE_EXP),
    domain: (process.env.COOKIE_DOMAIN),
    secure: (process.env.SECURE_COOKIE === 'true'),
  },
});


/**
 * Login a user.
 */
router.post(p.login,
  async (req: Request, res: Response) => {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
      throw new ParamMissingError();
    }
    // Get jwt
    const jwt = await authService.login(email, password);

    // Return
    return res.status(OK).json({
      token: jwt
    });
  });

/**
 * Register a user.
 */
router.post(p.register,
  body('email').isEmail().notEmpty().withMessage('Korisnik sa ovom email adresom već postoji.').custom(
    async val => !!await userRepo.getByEmail(val) 
  ),
  body('password').notEmpty().withMessage('Lozinka ne sme biti prazna.'),
  async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    // Check email and password present
    const user = req.body as IUser;
    await authService.register(user.email, user.password, user.name)

    // Add jwt to cookie
    return res.status(OK).json(user);
  });


/**
 * Logout the user.
 */
router.get(p.logout, (_: Request, res: Response) => {
  const { key, options } = cookieProps;
  res.clearCookie(key, options);
  return res.status(OK).end();
});


// Export router
export default router;
