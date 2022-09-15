const express = require('express'); 
const jsonschema = require('jsonschema'); 
const { BadRequestError } = require('../expressError');

const { ensureAdmin } = require('../middleware/auth');
const Job = require('../models/job'); 

const jobNewSchema = require('../schemas/jobNew.json'); 
const jobUpdateSchema = require('../schemas/jobUpdate.json'); 

const router = new express.Router(); 


/** GET / returns all companies 
 * 
 * Authorization required: none
 */
router.get('/', async (req, res, next) => {
  let jobs; 
  console.log(Object.keys(req.query).length); 
  try {
    if(Object.keys(req.query).length !== 0){
      jobs = await Job.getFiltered(req.query);
    } else {
      jobs = await Job.findAll(); 
    }
    return res.json({ jobs }); 
  } catch(err) {
    return next(err); 
  }
})

/** GET /:id returns job with {id}
 * 
 * Authorization required: none
 * 
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const job = await Job.find(id); 
    return res.json({ job }); 
  } catch(err) {
    return next(err); 
  }
})

/** POST / Creates a new job
 * 
 * Authorization required: Admin
 * 
 */
router.post('/', ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, jobNewSchema); 
    if(!validator.valid) {
      const errs = validator.errors.map(e => e.stack); 
      throw new BadRequestError(errs); 
    }

    const job = await Job.create(req.body); 
    return res.status(201).json({ job }); 
  } catch(err) {
    return next(err); 
  }
})


/** POST /:id Update a job
 * 
 * Authorization required: Admin
 * 
 */
router.patch('/:id', ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if(!validator.valid){
      const errs = validator.errors.map(e => e.stack); 
      throw new BadRequestError(errs); 
    }

    const { id } = req.params; 

    const job = await Job.update(id, req.body); 
    return res.json({ job }); 
  } catch(err) {
    return next(err); 
  }
})

/** DELETE /:id Delete a job
 * 
 * Authorization required: Admin
 * 
 */

router.delete('/:id', ensureAdmin, async(req, res, next) => {
  try {
    const { id } = req.params; 
    const job = await Job.remove(id); 

    return res.json({ deleted: job }); 
    
  } catch(err) {
    return next(err); 
  }
})



module.exports = router; 