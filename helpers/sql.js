const { BadRequestError } = require("../expressError");

/** Updates data for SQL query 
 * 
 * Changes the API keys into SQL keys
 * 
 * Turns data brought in, into references. 
 * Helps keep querys safe from SQL injections.
 *  
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/** Captures request queries for SQL queries
 * 
 * changes request query keys into sql queries
 * Helps keep querys safe from SQL injections
 * 
 */

function sqlForFilterSearch(dataToFilter, jsToSql){
  const keys = Object.keys(dataToFilter); 
  if(keys.length === 0) throw new BadRequestError("No data"); 


  const cols = keys.map((colsName, idx) =>{
    console.log(dataToFilter.hasEquity);
    if(colsName === 'hasEquity' && dataToFilter.hasEquity === 'true'){
      return `(equity Is Null) != $${idx + 1} And equity > 0`;
    }
    switch(colsName) {
      case 'name': return `name ilike $${idx + 1}`;
      case 'minNum': return `num_employees > $${idx + 1}`;
      case 'maxNum': return `num_employees <= $${idx + 1}`;
      case 'title': return `title iLike $${idx + 1}`;
      case 'minSalary': return `salary >= $${idx + 1}`;
      default:
        throw new BadRequestError('Bad Search'); 
    }
  })


  return {
    setCols: cols.join(" And "),
    values: Object.values(dataToFilter)
  }
}



module.exports = { 
  sqlForPartialUpdate, 
  sqlForFilterSearch
};
