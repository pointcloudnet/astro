"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// import { lucia, type InitializeAdapter, type Adapter } from 'lucia';
var lucia_1 = require("lucia");
// import { astro } from 'lucia/middleware';
// import { mongoose } from '../adapter-mongoose/dist/mongoose';
// import { Model, mongoose } from '../adapter-mongoose/dist/index';
var adapter_mongoose_1 = require("@lucia-auth/adapter-mongoose");
var mongoose_1 = require("mongoose");
require("../schema/schema");
/*

const User = new mongodb.model(
    "User"
    , new mongodb.Schema({
        _id: {
            type: String
            , required: true
        }
    } as const
    , { _id: false }
    )
);

const Key = mongodb.model(
    "Key",
    new mongodb.Schema(
        {
            _id: {
                type: String,
                required: true
            },
            user_id: {
                type: String,
                required: true
            },
            hashed_password: String
        } as const,
        { _id: false }
    )
);

const Session = mongodb.model(
    "Session",
    new mongodb.Schema(
        {
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
        } as const,
        { _id: false }
    )
);

export const auth = lucia({
    env: import.meta.env.DEV ? "DEV" : "PROD"
    , middleware: astro()
    , adapter: mongoose({
          User
        , Key
        , Session
    })
    , getUserAttributes: (data) => {
        return {
            username: data.username
        };
    }
});
*/
/*
const mongoose = (models: {
    User: Model;
    Session: Model | null;
    Key: Model;
}) => InitializeAdapter<Adapter>;
*/
var User = mongoose_1.default.model('User');
var Key = mongoose_1.default.model('Key');
var Session = mongoose_1.default.model('Session');
exports.auth = (0, lucia_1.lucia)({
    // adapter: mongoose(mongoose)
    adapter: (0, adapter_mongoose_1.mongoose)({ User: User, Key: Key, Session: Session }),
    env: import.meta.env.DEV ? "DEV" : "PROD",
    middleware: astro(),
    getUserAttributes: function (databaseUser) {
        return {
            username: databaseUser.username
        };
    }
});
// const client = await mongodb.connect();
mongoose_1.default.connect('mongodb://black/mongodb00', null);
