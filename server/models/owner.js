const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
    totalRevenue: {
        type: Number
    },
    receivables: {
        type: Number
    }
});

const Owner = mongoose.model('owner', OwnerSchema);

module.exports = {Owner};