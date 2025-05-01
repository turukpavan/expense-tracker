const IncomeModel = require('../models/Income.model');
const xlsx = require('xlsx');

const addIncome = async (req,res)=>{
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    
  try {
      const {source,amount,icon}= req.body;
      const userId = req.user.id;
      if (!source || !amount) return res.status(400).json({ message: "All fields are required" });
  
      const newIncome = new IncomeModel({userId, source, amount, icon});
      await newIncome.save();
  
      res.status(201).json({message : "Income added successfully",income : newIncome});
  } catch (error) {
    res.status(500).json({ message: "Error while adding income", error: error.message });
}
    
};

const showAllIncome = async (req, res) => {
    try {
        const allIncome = await IncomeModel.find({userId:req.user.id}).sort({ createdAt: -1 }); // Sort by latest entries

        res.status(200).json({ success: true, income: allIncome });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching income records", error: error.message });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const deletedIncome = await IncomeModel.findOneAndDelete({ _id: req.params.id });

        if (!deletedIncome) {
            return res.status(404).json({ message: "No income record found to delete" });
        }

        res.status(200).json({ message: "Income deleted successfully", deletedIncome });
    } catch (error) {
        res.status(500).json({ message: "Error while deleting income", error: error.message });
    }
};

const downloadIncomeExcel = async (req, res)=>{
    const userId = req.user.id ;
    try {
        const income = await IncomeModel.find({userId}).sort({date : -1});
        //Prepare data for Excel
        const data = income.map((item)=>({
            Source : item.source,
            Amount : item.amount,
            Date : item.date ? new Date(item.date).toISOString().split('T')[0] : "Invalid Date",

        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (error) {
        res.status(500).json({message : "server Error"})
    }
}
module.exports = {addIncome,showAllIncome, deleteIncome, downloadIncomeExcel};