const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    icon : {
        type : String,

    },
    category : { // Example : Food, Rent, Groceries
        type : String,
        required : true,

    },
    amount : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
},{timestamps : true});

module.exports = mongoose.model('Expense',ExpenseSchema)