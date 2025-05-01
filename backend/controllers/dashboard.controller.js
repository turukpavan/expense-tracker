const Income = require("../models/Income.model")

const Expense = require("../models/Expense.model");

const {isValidObjectId, Types} = require("mongoose");

//Add Expense
const getDashboardData = async(req,res)=>{
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income & expenses
        const totalIncome = await Income.aggregate([
            {$match : {userId:userObjectId}},
            {$group : {_id:null, total:{$sum:"$amount"}}},
        ]);
        // console.log("totalIncome",{totalIncome, userId : isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            {$match : {userId:userObjectId}},
            {$group : {_id:null, total:{$sum:"$amount"}}},
        ]);
        // console.log("totalExpense",{totalExpense, userId : isValidObjectId(userId)});
        

        //get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date : {$gte : new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)},
        }).sort({date : -1});

        //get expense transactions in the last 60 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
             date : {$gte : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)},
        }).sort({date : -1});

        //total expenses for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce((sum, transactions)=>sum + transactions.amount,0);

         //total expenses for last 30 days
         const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, transactions)=>sum + transactions.amount,0);

        //Fetch last 5 transaction (income + expenses)
        const lastTransactions = [
            ...(await Income.find({userId}).sort({date : -1}).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type : "income"
            })),
            ...(await Expense.find({userId}).sort({date : -1}).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type : "Expense"
            })),
            
        ].sort((a,b)=>b.date - a.date); // sort latest first 

        //Final Response
        res.json({
            totalBalance:(totalIncome[0]?.total || 0)-(totalExpense[0]?.total || 0),
            totalIncome : totalIncome[0]?.total || 0,
            totalExpense : totalExpense[0]?.total || 0,
            last30DaysExpenses:{
                total : expensesLast30Days,
                transactions : last30DaysExpenseTransactions
            },
            last60DaysIncome:{
                total : incomeLast60Days,
                transactions : last60DaysIncomeTransactions
            },
            recentTransactions : lastTransactions

        })
    } catch (error) {
        res.status(500).json({message : "Server Error",error})
    }
}

module.exports = {getDashboardData}