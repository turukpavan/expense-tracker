const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware.js')
const {addExpense,showAllExpense, deleteExpense, downloadExpenseExcel} = require('../controllers/expense.controller.js');

//add income 
router.post('/add',protect, addExpense);

//show All income
router.get('/showAll',protect, showAllExpense);

//download excel
router.get('/downloadExcel',protect, downloadExpenseExcel);

//delete one income
router.get('/deleteOne/:id',protect, deleteExpense);

module.exports = router