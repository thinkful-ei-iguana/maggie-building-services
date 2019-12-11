
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping List service object', function () {
  let db;

  let testItems = [
    {
      id: 1,
      name: 'pizza',
      price: '10.50',
      category: 'Snack',
      date_added: new Date()
    },
    {
      id: 2,
      name: 'celery',
      price: '5.99',
      category: 'Lunch',
      date_added: new Date()
    },
    {
      id: 3,
      name: 'raspberries',
      price: '3.44',
      category: 'Breakfast',
      date_added: new Date()
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before('clear', () => db('shopping_list').truncate());

  before('setup', () => db('shopping_list').truncate());

  afterEach('clear', () => db('shopping_list').truncate());

  after('end db connection', () => {
    return db.destroy();
  });

  /*
  The reason to use context here is for the semantics of reading the 
  test code to see that we're setting a "context" of state for a 
  group of tests.
  */
  context('Given shopping_list has data', () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });


    it('getAllItems() resolves all items from shopping_list table', () => {
      const expected = testItems.map(item => ({
        ...item,
        checked: false
      }))
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(expected);
        });
    });

    it('getById() resolves an item by id from shopping_list table', () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            price: thirdTestItem.price,
            category: thirdTestItem.category,
            checked: false,
            date_added: thirdTestItem.date_added
          });
        });
    });

    it('deleteItem() removes an item by id from shopping_list table', () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test item array without the "deleted" item
          const expected = testItems
            .filter(item => item.id !== itemId)
            .map(item => ({
              ...item,
              checked: false
            }))
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'updated name',
        price: '500.99',
        checked: true,
        date_added: new Date()
      }
      const original = testItems[idOfItemToUpdate - 1];
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...original,
            ...newItemData
          })
        })
    })

  });

  context('Given shopping_list has no data', () => {
    it('getAllItems() resolves an empty array', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
  });

  it('insertItem() inserts a new item and resolves the new item with an id', () => {
    const newItem = {
      id: 5,
      name: 'new name',
      price: '1.00',
      category: 'Lunch',
      checked: true,
      date_added: new Date()
    };
    return ShoppingListService.insertItem(db, newItem)
      .then(actual => {
        expect(actual).to.eql({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          checked: newItem.checked,
          date_added: newItem.date_added
        });
      });
  });
});