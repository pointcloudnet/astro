import { Schema, Types, model, models } from '../lib/lucia';

interface IUser {
    _id: string;
}

interface IKey {
    _id: string;
    user_id: string;
    hashed_password: string;
}

interface ISession {
    _id: string;
    user_id: string;
    active_expires: number;
    idle_expires: number;
}

const userSchema = new Schema<IUser>(
    {
        _id: {
              type: String
            , required: true
        }
    } as const
    , { _id: false }
);

const keySchema = new Schema<IKey>(
    {
         _id: {
              type: String
            , required: true
        }
        , user_id: {
              type: String
            , required: true
        },
        hashed_password: String
    } as const,
    { _id: false }
);

const sessionSchema = new Schema<ISession>(
    {
         _id: {
              type: String
            , required: true
        }
        , user_id: {
              type: String
            , required: true
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
);

