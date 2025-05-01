const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware.js')
const {addIncome,showAllIncome,deleteIncome, downloadIncomeExcel} = require('../controllers/income.controller');

//add income 
router.post('/add',protect, addIncome);

//show All income
router.get('/showAll',protect, showAllIncome);

//download excel
router.get('/downloadExcel',protect, downloadIncomeExcel);

//delete one income
router.get('/deleteOne/:id',protect, deleteIncome);

module.exports = router