import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import companyService from '@services/company-service';
import { ParamMissingError } from '@shared/errors';

import { body, validationResult } from 'express-validator';
import { ICompany } from '../../models/company-model';
import { ICreateCompanyRequestDto } from './dtos/company/create-company-request.dto';




// Constants
const router = Router();
const { CREATED, OK, ACCEPTED } = StatusCodes;


// Paths
export const p = {
  get: '/all',
  add: '/add',
  update: '/update',
  delete: '/delete/:id',
} as const;



/**
 * Get all companies.
 */
router.get(p.get, async (_: Request, res: Response) => {
  const companys = await companyService.getAll();
  return res.status(OK).json({ companys });
});


/**
 * Add one company.
 */
router.post(p.add,
  body('company_name').isString().withMessage('Unesite naziv kompanije'),
  async (req: ICreateCompanyRequestDto, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { company_name } = req.body;

    const company = {
      company_name
    }

    // Fetch data
    const inserted = await companyService.addOne(company);
    return res.status(CREATED).json({ company: inserted, message: 'Uspešno dodata nova kompanija.' });
  });

router.delete(p.delete,
  async (req: Request, res: Response) => {

    const companyId = parseInt(req.params.id);

    try {
      await companyService.delete(companyId);

      return res.status(ACCEPTED).json({ msg: 'Uspešno obrisana kompanija.' })
    } catch (error) {

      return res.status(500).json({ msg: 'Ne postoji ta kompanija.' })
    }
  })


// Export default
export default router;
