const express = require('express');
const itemController = require('../controllers/itemController');  // Make sure itemController is an instance of an Express router
const app = express();

app.use(express.json());
app.use('/items', itemController);


// const Item = require('../models/itemModel');

// app.use(express.json());
// app.use('/items', itemController);

describe('Item Controller Tests', () => {
  it('should get a list of items', async () => {
    // Add some sample items to the database before testing
    const sampleItems = [{ name: 'Item1', description: 'Description1' }, /* Add more items */];
    await Item.insertMany(sampleItems);

    const response = await request(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(sampleItems.length);
  });

  it('should create a new item', async () => {
    const newItem = { name: 'New Item', description: 'New Description' };

    const response = await request(app)
      .post('/items')
      .send(newItem);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.description).toBe(newItem.description);
  });

  // Add more tests for updating, deleting, etc.
});
