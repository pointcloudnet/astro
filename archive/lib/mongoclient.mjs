'use strict';

import { MongoClient } from 'mongodb';

// const mongohost = 'black.local';
// const mongoport = 27017;
const mongodbname = 'mongodb00';
const mongourl = 'mongodb://black/rs0?directConnection=true&appName=mongosh+2.1.1';
const mongoclient = new MongoClient(mongourl);
const db = await mongoclient.connect();
const dbc = mongoclient.db(mongodbname);
const db_coll = dbc.collection('bookmarks');

export { db_coll, mongoclient };

