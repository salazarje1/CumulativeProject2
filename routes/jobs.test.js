const request = require('supertest'); 

const db = require('../db'); 
const app = require('../app'); 

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token
} = require('./_testCommon'); 

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll); 


/** Testing GET / returns all jobs
 * 
 * 
 */
describe("GET /", () => {
  test('Get all companies', async () => {
    const res = await request(app).get('/jobs');

    expect(res.statusCode).toBe(200); 
    expect(res.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: 'Dev',
          salary: 4000,
          equity: '1',
          company_handle: 'c2'
        },
        {
          id: expect.any(Number),
          title: 'Test',
          salary: 300,
          equity: '0',
          company_handle: 'c1'
        },
        {
          id: expect.any(Number),
          title: 'Test2',
          salary: 3200,
          equity: '0.1',
          company_handle: 'c1'
        },
        {
          id: expect.any(Number),
          title: 'Test3',
          salary: 500,
          equity: '0',
          company_handle: 'c3'
        }
      ]
    })
  })
})

/** Test POST / creating a new job
 * 
 * Authorization required
 */

describe('POST /jobs', () => {
  const newJob = {
    title: "New Test",
    salary: 100,
    equity: 0,
    companyHandle: 'c1'
  }

  test("Adding new job", async () => {
    const res = await request(app)
      .post('/jobs')
      .send(newJob)
      .set('authorization', `Bearer ${u1Token}`);

    expect(res.statusCode).toBe(201); 
    expect(res.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "New Test",
        salary: 100,
        equity: '0',
        company_handle: 'c1'
      }
    })
  })

  test("Adding without admin auth", async () => {
    const res = await request(app)
      .post('/jobs')
      .send({
        title: "New Test 1",
        salary: 100,
        equity: 0,
        companyHandle: 'c2'
      })
    
    expect(res.statusCode).toBe(401);
  })
})