import { MongoClient } from "mongodb";
import { name } from "../meta/config";

export const db = new MongoClient( process.env.DB_PORT, {
    appName: name.toLowerCase().replace(" ","-"),
    retryWrites: true,
}).db(process.env.DB_NAME);
