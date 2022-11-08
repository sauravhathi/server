const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        minLength: 10,
        maxLength: 14,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true

    },
    date: {
        type: Date,
        default: Date.now
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});


// encrypting password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

const User = mongoose.model("USERS", userSchema);

module.exports = User;