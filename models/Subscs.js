const mongoose = require('mongoose');
const schema = mongoose.Schema;

const SubscsSchema = new schema({
    email: { type: String  },
    mobile: { type: String  },
    gender: { type: String  },
    dob: { type: String  },
    bookType: {
        type: schema.Types.ObjectId,
        ref: 'Files'
    },
    subscribe: { type: String},
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


const Subscs = mongoose.model('Subscs', SubscsSchema);
module.exports = {
    Subscs,
    SubscsSchema
}