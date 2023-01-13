const mongoose = require('mongoose');
const schema = mongoose.Schema;

const FilesSchema = new schema({
    file: { type: String  },
    unicodes: {type: String },
    unicodebook:  { type: schema.Types.ObjectId,
        ref: 'BookAlls' },
    title: { type: String},
    tags: { type: String },
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


const Files = mongoose.model('Files', FilesSchema);
module.exports = {
    Files,
    FilesSchema
}