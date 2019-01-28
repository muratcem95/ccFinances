const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        unique: true
    },
    ccPayment: {
        type: Number,
        default: null
    },
    school: {
        type: String,
        default: null
    },
    schoolPayment: {
        type: Number,
        default: null
    },
    thirdParty: {
        type: String,
        default: null
    },
    thirdPartyPayment: {
        type: Number,
        default: null
    },
    details: {
        type: String,
        default: null
    }
});

const Students = mongoose.model('students', StudentsSchema);

module.exports = {Students};