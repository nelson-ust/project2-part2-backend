const express = require("express");
const router = express.Router();  // Add this line to create an express router

const itemController = require("../controllers/itemController");

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
 *                 example: ExampleItemName
 *               description:
 *                 type: string
 *                 example: ExampleItemDescription
 *     responses:
 *       '201':
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: generatedID
 *               name: ExampleItemName
 *               description: ExampleItemDescription
 *       '500':
 *         description: Internal server error
 */
router.post("/", itemController.createItem);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       '200':
 *         description: Successfully retrieved items
 *         content:
 *           application/json:
 *             example:
 *               - _id: generatedID1
 *                 name: ExampleItemName1
 *                 description: ExampleItemDescription1
 *               - _id: generatedID2
 *                 name: ExampleItemName2
 *                 description: ExampleItemDescription2
 *       '500':
 *         description: Internal server error
 */
router.get("/", itemController.getAllItems);

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
 *                 example: UpdatedItemName
 *               description:
 *                 type: string
 *                 example: UpdatedItemDescription
 *     responses:
 *       '200':
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: generatedID
 *               name: UpdatedItemName
 *               description: UpdatedItemDescription
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", itemController.updateItem);

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
 *         content:
 *           application/json:
 *             example:
 *               _id: generatedID
 *               name: DeletedItemName
 *               description: DeletedItemDescription
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", itemController.deleteItem);

module.exports = router;
