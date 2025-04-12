const mongoose = require('mongoose');


const spacesSchema = new mongoose.Schema({
    SpaceName: {
        type: String,
        required: true,
    },
})


const Spaces = mongoose.model('Spaces', spacesSchema);
module.exports = Spaces;