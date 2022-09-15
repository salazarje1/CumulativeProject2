const { UnauthorizedError, BadRequestError } = require('../expressError');
const { sqlForPartialUpdate } = require('./sql.js'); 



describe('Test sqlForPartialUpdate function', () => {
  test('Works with good data', () => {
    const data = { firstName: "josue", lastName:"salazar"}; 
    const sql = { firstName: "first_name", lastName: "last_name", isAdmin: "is_admin", }

    const { setCols, values } = sqlForPartialUpdate(data, sql); 

    expect(setCols).toEqual('"first_name"=$1, "last_name"=$2'); 
    expect(values).toEqual([ 'josue', 'salazar' ])
  })

  test('No data added', () => {
    try {
      let data = {}; 
      const sql = { firstName: "first_name", lastName: "last_name", isAdmin: "is_admin", }

      const {setCol, values } = sqlForPartialUpdate(data, sql); 
      console.log(sqlForPartialUpdate(data, sql)); 
    } catch(err){
      console.log(err); 
      expect(err instanceof BadRequestError).toBeTruthy();     
    }
  })
})