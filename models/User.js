const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Item = require('./item');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('remove', function (next) {

    Item.find({
        owner: this.id
    }, (err, items) => {
        if (err) {
            next(err);
        } else if (items.length > 0) {
            next(new Error('This author still has Items'));
        } else {
            next();
        }
    })
});


module.exports = mongoose.model('users', userSchema);