import companyRepo from 'src/database/company-repo';
import { ICompany } from '@models/company-model';
import { UserNotFoundError } from '@shared/errors';



/**
 * Get all users.
 * 
 * @returns 
 */
function getAll(): Promise<ICompany[]> {
  return companyRepo.getAll();
}


/**
 * Add one user.
 * 
 * @param user 
 * @returns 
 */
async function addOne(user: ICompany): Promise<ICompany | null> {
  return companyRepo.create(user);
}

/**
 * Delete a busLine by their id.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: number): Promise<void> {

  await companyRepo.deleteById(id);
}


// Export default
export default {
  delete: deleteOne,
  getAll,
  addOne,
} as const;
