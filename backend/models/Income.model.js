const mongoose = require('mongoose');

const IncomeSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    source :{
        type : String,
        required : true,
    },
    amount : {
        type : Number,
        required : true
    },
    date: { 
        type: Date, 
        default: Date.now
     },
     icon : {
        type : String,
     }

},{timestamps:true});

module.exports =  mongoose.model("Income",IncomeSchema);
