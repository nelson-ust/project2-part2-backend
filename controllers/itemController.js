// controllers/itemController.js

const mongoose = require("mongoose");
const Item = require("../models/itemModel");

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API operations related to items
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Item created successfully
 *       '400':
 *         description: Bad request - Invalid input data
 *       '500':
 *         description: Internal server error
 */
exports.createItem = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation: Check if required fields are provided
    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required fields." });
    }

    const newItem = new Item({ name, description });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    // Error handling: Handle database errors or other unexpected errors
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       '200':
 *         description: Successfully retrieved items
 *       '500':
 *         description: Internal server error
 */
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve an item by ID from the database
 * @param {string} itemId - ID of the item to retrieve
 * @returns {Promise<object|null>} - Resolves with the item if found, or null if not found
 */
const getItemByIdFromDatabase = async (itemId) => {
  try {
    // Validation: Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return null; // Invalid ID format
    }

    const item = await Item.findById(itemId);

    return item; // Returns null if the item is not found
  } catch (error) {
    console.error("Error retrieving item by ID:", error);
    throw error; // Handle the error as needed
  }
};

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to retrieve
 *     responses:
 *       '200':
 *         description: Item retrieved successfully
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
exports.getItemById = async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await getItemByIdFromDatabase(itemId);

    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Item updated successfully
 *       '400':
 *         description: Bad request - Invalid input data
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  try {
    const { name, description } = req.body;

    // Validation: Check if required fields are provided
    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required fields." });
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });

    if (updatedItem) {
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to delete
 *     responses:
 *       '200':
 *         description: Item deleted successfully
 *       '400':
 *         description: Bad request - Invalid ID
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;

  // Validation: Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const deletedItem = await Item.findOneAndDelete({ _id: itemId });

    if (deletedItem) {
      res.status(200).json(deletedItem);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
