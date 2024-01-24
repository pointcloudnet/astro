import { lucia } from 'lucia';
import { astro } from 'lucia/middleware';
import { mongoose } from '@lucia-auth/adapter-mongoose';
import mongodb from 'mongoose';
import { User, Key, Session } from '../schema/schema';


const User = mongodb.model('User');
const Key = mongodb.model('Key');
const Session = mongodb.model('Session');

export const auth = lucia({
	adapter: mongoose({ User, Key, Session})
	,env: "DEV"
	,middleware: astro()
	,getUserAttributes(databaseUser) {
		return {
			username: databaseUser.username
		};
	}
});
mongodb.connect('mongodb://black/mongodb00', null);
export type Auth = typeof auth;