import { lucia, type InitializeAdapter, type Adapter } from 'lucia';
import { astro } from 'lucia/middleware';
// import { mongoose } from '../adapter-mongoose/dist/mongoose';
// import { Model, mongoose } from '../adapter-mongoose/dist/index';
import { mongoose } from '@lucia-auth/adapter-mongoose';
import mongodb from 'mongoose';

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

/*
mongoose: (models: {
    User: Model
    ,Session: Model | null
    ,Key: Model
}) => InitializeAdapter<Adapter>;
*/
export type Auth = typeof auth;