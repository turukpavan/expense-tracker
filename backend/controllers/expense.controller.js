const ExpenseModel = require('../models/Expense.model');
const xlsx = require('xlsx');

const addExpense = async (req,res)=>{
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    
  try {
      const {category,amount,icon}= req.body;
      const userId = req.user.id;
      if (!category || !amount) return res.status(400).json({ message: "All fields are required" });
  
      const newExpense = new ExpenseModel({userId, category, amount, icon});
      await newExpense.save();
  
      res.status(201).json({message : "Expense added successfully",expense : newExpense});
  } catch (error) {
    res.status(500).json({ message: "Error while adding Expense", error: error.message });
}
    
};

const showAllExpense = async (req, res) => {
        // const userId = req.user.id;
        // console.log("Userid====>",userId);
        
    try {
        const allExpense = await ExpenseModel.find({userId:req.user.id}).sort({ createdAt: -1 }); // Sort by latest entries

        res.status(200).json({ success: true, expense: allExpense });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching expense records", error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await ExpenseModel.findOneAndDelete({ _id: req.params.id });
        console.log(deletedExpense);

        if (!deletedExpense) {
            return res.status(404).json({ message: "No expense record found to delete" });
        }

        res.status(200).json({ message: "Expense deleted successfully", deletedExpense });
    } catch (error) {
        res.status(500).json({ message: "Error while deleting expense", error: error.message });
    }
};

const downloadExpenseExcel = async (req, res)=>{
    const userId = req.user.id ;
    try {
        const expense = await ExpenseModel.find({userId}).sort({date : -1});
        //Prepare data for Excel
        const data = expense.map((item)=>({
            Source : item.category,
            Amount : item.amount,
            Date : item.date ? new Date(item.date).toISOString().split('T')[0] : "Invalid Date",

        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({message : "server Error"})
    }
}
module.exports = {addExpense,showAllExpense, deleteExpense, downloadExpenseExcel};