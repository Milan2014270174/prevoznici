import userRepo from 'src/database/user-repo';
import { IUser } from '@models/user-model';
import { UserNotFoundError } from '@shared/errors';



/**
 * Get all users.
 * 
 * @returns 
 */
function getAll(): Promise<IUser[]> {
  return userRepo.getAll();
}


/**
 * Add one user.
 * 
 * @param user 
 * @returns 
 */
function addOne(user: IUser): Promise<IUser | null> {
  return userRepo.create(user);
}


/**
 * Get one user.
 * 
 * @param user 
 * @returns 
 */
function getByEmail(user: IUser): Promise<IUser | null> {
  return userRepo.getByEmail(user.email);
}



// Export default
export default {
  getByEmail,
  getAll,
  addOne,
} as const;
