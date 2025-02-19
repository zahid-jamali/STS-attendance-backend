const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
   	date: {
        type: Date,
        default: Date.now, 
        required: true
    },
    entryTime: {
        type: Date,
        required: true
    },
    exitTime: {
        type: Date
    },
    workHours: {
        type: Number,
        default: 0
    },

});

module.exports = mongoose.model("Attendance", attendanceSchema);
