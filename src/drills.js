require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});


function searchItemsByText(searchTerm) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
// searchItemsByText('a');

function paginateProducts(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// paginateProducts(1);

function itemsAddedAfterInputtedDate(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .groupBy('name', 'id')
    .orderBy([
      { column: 'date_added', order: 'DESC' }
    ])
    .then(result => {
      console.log(result);
    });
}
itemsAddedAfterInputtedDate(3);

function totalCostByCategory() {
  knexInstance
    .select('category')
    .sum('price AS total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result);
    });
}
// totalCostByCategory();