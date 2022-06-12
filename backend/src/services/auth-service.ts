import bcrypt from 'bcrypt';

import jwtUtil from '@util/jwt-util';
import { UnauthorizedError } from '@shared/errors';
import userRepo from '../database/user-repo';
import { IUser } from '../models/user-model';



/**
 * Login()
 * 
 * @param email 
 * @param password 
 * @returns 
 */
async function login(email: string, password: string): Promise<string> {
  // Fetch user
  const user = await userRepo.getByEmail(email);
  if (!user) {
    throw new UnauthorizedError();
  }
  // Check password
  const pwdPassed = await bcrypt.compare(password, user.password);
  if (!pwdPassed) {
    throw new UnauthorizedError();
  }
  // Setup Admin Cookie
  return jwtUtil.sign({
    id: user.user_id,
    email: user.name,
    name: user.name,
    role_id: user.role_id,
    token: user.token
  });
}
/**
 * Register()
 * 
 * @param email 
 * @param password 
 * @param name 
 * @returns 
 */
async function register(email: string, password: string, name: string): Promise<IUser | null> {
  // Fetch user


  const salt = await bcrypt.genSalt();

  if (await userRepo.getByEmail(email))
    throw new Error('Korisnik sa ovom email adresom već postoji.')

  const user = await userRepo.create({
    email,
    password: await bcrypt.hash(password, 10),
    name,
    token: salt,
    role_id: 2
  });

  if (!user) {
    throw new UnauthorizedError();
  }

  const jwt = await jwtUtil.sign({
    id: user.user_id,
    email: user.name,
    name: user.name,
    role_id: user.role_id,
    token: user.token
  })

  return {
    ...user,
    token: jwt
  };
}




// Export default
export default {
  login,
  register
} as const;
