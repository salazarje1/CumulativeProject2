const db = require('../db.js');
const Job = require('./job.js');

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require('./_testCommon'); 


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll); 

/** Testing Created
 * 
 */

describe('create', function() {
  const newJob = {
    title: 'developer',
    salary: 45000,
    equity: 0.4,
    companyHandle: 'c1'
  }

  test('Creating a new job', async () => {
    let job = await Job.create(newJob); 

    const result = await db.query(`Select id, title, salary, equity, company_handle From jobs Where title='developer'`);

    console.log(result.rows[0]);

    expect(result.rows[0]).toEqual({
      id: expect.any(Number),
      title: "developer",
      salary: 45000,
      equity: '0.4',
      company_handle: 'c1'
    })
  })
})

/** Testing Find All 
 * 
 */

describe('Finding Jobs', () => {
  test('Finding all jobs', async () => {
    let jobs = await Job.findAll(); 

    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: 'Accommodation manager', 
        salary: 1000,
        equity: '0.5',
        company_handle: 'c1'
      },
      {
        id: expect.any(Number),
        title: 'Ship broker', 
        salary: 2000,
        equity: '0',
        company_handle: 'c1'
      },
      {
        id: expect.any(Number),
        title: 'manager', 
        salary: 344000,
        equity: '1',
        company_handle: 'c2'
      }
    ])
  })
})