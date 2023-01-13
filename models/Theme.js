const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ThemesSchema = new schema({
    name: { type: String  },
    bookType: {
        type: schema.Types.ObjectId,
        ref: 'Files'
    },
    detail: { type: String},
    isDeleted: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});


const Themes = mongoose.model('Themes', ThemesSchema);
module.exports = {
    Themes,
    ThemesSchema
}