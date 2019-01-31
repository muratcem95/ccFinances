const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        unique: true
    },
    ccPayment: {
        type: Number,
        default: 0
    },
    received: {
        type: Number,
        default: 0
    },
    left: {
        type: Number,
        default: 0
    },
    partnerName: {
        type: String,
        default: null
    },
    partnerType: {
        type: String,
        default: null
    },
    partnerPayment: {
        type: Number,
        default: 0
    },
    partnerCommissionRate: {
        type: Number,
        default: 0
    },
    partnerCommissionAmount: {
        type: Number,
        default: 0
    },
    partnerCommissionStructure: {
        type: String,
        default: null
    },
    partnerReceived: {
        type: Number,
        default: 0
    },
    partnerLeft: {
        type: Number,
        default: 0
    },
    details: {
        type: String,
        default: null
    }
});

const Students = mongoose.model('students', StudentsSchema);

module.exports = {Students};