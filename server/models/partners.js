const mongoose = require('mongoose');

const PartnersSchema = new mongoose.Schema({
    partnerName: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    commissionRate: {
        type: Number,
        required: true
    },
    commissionStructure: {
        type: String,
        required: true
    },
    paymentDetails: {
        type: String,
        required: true
    }
});

const Partners = mongoose.model('partners', PartnersSchema);

module.exports = {Partners};