const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    fullName: { type: String },
    dob: { type: String  },
    image: { type: String  },
    gender:  { type: String, enum : ['male','female']},
    age: {type: String },
    emailId: { type: String, required: true },
    mobileNo: { type: String },
    addresone: { type: String },
    addrestwo: { type: String },
    password: { type: String },
    city: { type: String },
    zipcode: { type: String },
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


const Users = mongoose.model('Users', UserSchema);
module.exports = {
    Users,
    UserSchema
}