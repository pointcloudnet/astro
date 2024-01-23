"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lucia_1 = require("../lib/lucia");
var userSchema = new lucia_1.Schema({
    _id: {
        type: String,
        required: true
    }
}, { _id: false });
var keySchema = new lucia_1.Schema({
    _id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    hashed_password: String
}, { _id: false });
var sessionSchema = new lucia_1.Schema({
    _id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    active_expires: {
        type: Number,
        required: true
    },
    idle_expires: {
        type: Number,
        required: true
    }
}, { _id: false });
