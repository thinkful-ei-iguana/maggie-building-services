/*
Make a new file in your knex-practice project for
./src/shopping-list-service.js that contains methods for
CRUD: to get, insert, update and delete shopping list items.
Also, make a ./test/shopping-list-service.spec.js file
that tests the CRUD methods.
*/

const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from('shopping_list').select('*').where('id', id).first();
  },
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete();
  },
  updateItem(knex, id, newItemFields) {
    return knex('shopping_list')
      .where({ id })
      .update(newItemFields);
  }
};

module.exports = ShoppingListService;