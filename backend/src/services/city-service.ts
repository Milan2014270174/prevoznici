import { UserNotFoundError } from '@shared/errors';
import cityRepo from '../database/city-repo';
import { ICity } from '../models/city-model';



/**
 * Get all users.
 * 
 * @returns 
 */
function getAll(): Promise<ICity[]> {
  return cityRepo.getAll();
}


/**
 * Add one user.
 * 
 * @param user 
 * @returns 
 */
async function addOne(user: ICity): Promise<ICity | null> {
  return cityRepo.create(user);
}



// Export default
export default {
  getAll,
  addOne,
} as const;
