const { set } = require('../app.js');
const db = require('../db.js'); 
const { BadRequestError, NotFoundError } = require('../expressError'); 
const { sqlForPartialUpdate, sqlForFilterSearch } = require('../helpers/sql');


class Job {

  /** Finds all jobs and returns a list of jobs.
   * 
   * 
   */
  static async findAll() {
    const results = await db.query(`
    Select id, title, salary, equity, company_handle From jobs`
    )
    const jobs = results.rows;

    return jobs; 

  }

  /** Return one job found from id. 
   * 
   * if not found returns a not found error. 
   * 
   * 
   */
  static async find(id) {
    const results = await db.query(`
      Select id, title, salary, equity, company_handle From jobs
      Where id = $1
    `, [id])
    const job = results.rows[0]; 

    if(!job) throw new NotFoundError(`No job found at id ${id}`); 

    return job;
  }

  /** Filter through jobs return data about jobs
   * 
   * Return {id, title, salary, equity, company_handle}
   * 
   * Returns an empty array if no jobs are found
   * 
   */
  static async getFiltered(filters) {
    const { setCols, values } = sqlForFilterSearch(filters); 

    console.log(setCols, values); 
    const jobsRes = await db.query(
      `Select id, title, salary, equity, company_handle As "companyHandle" 
      From jobs Where ${setCols}`,
      [...values]
    )

    const jobs = jobsRes.rows;

    return jobs; 
  }

  /** Create new jobs postings, return job data
   * 
   * 
   */
  static async create({ title, salary, equity, companyHandle }) {
    const result = await db.query(
      `Insert Into jobs (title, salary, equity, company_handle)
        Values ($1, $2, $3, $4)
        Returning id, title, salary, equity, company_handle
      `, [title, salary, equity, companyHandle])

    const job = result.rows[0]; 
    return job; 
  }

  /** Update a job, return id, title, salary, equity, company_handle
   * 
   * can only update title, salary, and equity
   */
  static async update(id, data){
    const { setCols, values } = sqlForPartialUpdate(data, {
      companyHandle: "company_handle"
    })
    const idIdex = `$${values.length + 1}`;

    const result = await db.query(`
      Update jobs Set ${setCols} Where id=${idIdex}
      Returning id, title, salary, equity, company_handle
    `, [...values, id]);

    const job = result.rows[0]; 

    if(!job) throw new NotFoundError(`No job found at id ${id}`); 

    return job; 
  }

  /** Delete job from database, deletes and returns nothing. 
   * 
   * Checks to see if job was found, if not throws error. 
   * 
   */
  static async remove(id) {
    const result = await db.query(`
      Delete From jobs Where id = $1 Returning id, title, company_handle
    `, [id])
    console.log(result); 
    const job = result.rows[0]; 

    if(!job) throw new NotFoundError(`No job found at id ${id}`); 

    return job; 
  }
}

module.exports = Job; 