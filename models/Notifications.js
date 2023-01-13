const mongoose = require('mongoose');
const schema = mongoose.Schema;

const NotoficationsSchema = new schema({
    name: { type: String  },
    email: { type: String  },
    mobile: { type: Number  },
    bookType: {
        type: schema.Types.ObjectId,
        ref: 'Files'
    },
    users: {
        type: schema.Types.ObjectId,
        ref: 'Users'
    },
    price: { type: String},
    messeges: { type: String},
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


const Notofications = mongoose.model('Notofications', NotoficationsSchema);
module.exports = {
    Notofications,
    NotoficationsSchema
}