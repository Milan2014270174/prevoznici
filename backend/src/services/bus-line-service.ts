import busLineRepo from '../database/bus_line-repo';
import { UserNotFoundError } from '@shared/errors';
import { IBusLine } from '../models/bus_line-model';



/**
 * Get all busLines.
 * 
 * @returns 
 */
function getAll(): Promise<IBusLine[]> {
  return busLineRepo.getAll();
}


/**
 * Add one busLine.
 * 
 * @param busLine 
 * @returns 
 */
function create(busLine: IBusLine) {
  return busLineRepo.create(busLine);
}


// /**
//  * Update one busLine.
//  * 
//  * @param busLine 
//  * @returns 
//  */
// async function updateOne(busLine: IBusLine): Promise<void> {

//   return busLineRepo.update(busLine);
// }


// /**
//  * Delete a busLine by their id.
//  * 
//  * @param id 
//  * @returns 
//  */
// async function deleteOne(id: number): Promise<void> {
//   const persists = await busLineRepo.persists(id);
//   if (!persists) {
//     throw new UserNotFoundError();
//   }
//   return busLineRepo.delete(id);
// }


// Export default
export default {
  getAll,
  create,
  // updateOne,
  // delete: deleteOne,
} as const;
