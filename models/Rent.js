const { Schema, model } = require('mongoose');

let rentSchema = new Schema({
    expireDay: { type: Schema.Types.String, required: true },
    car: { type: Schema.Types.ObjectId, required: true, ref: 'Car' },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = model('Rent', rentSchema);