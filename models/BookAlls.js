const mongoose = require('mongoose');
const schema = mongoose.Schema;

const BookAllsSchema = new schema({
    name: { type: String  },
    title: { type: String  },
    file: { type: String  },
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


const BookAlls = mongoose.model('BookAlls', BookAllsSchema);
module.exports = {
    BookAlls,
    BookAllsSchema
}