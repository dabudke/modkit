import { readFileSync } from "fs";

export const config = JSON.parse(readFileSync("./config.json", "utf-8"));

export const name: string = config.name;
export const prefix: string = config.prefix;
export const dbpath: string = config.dbpath;
export const color: string = config.color;
export const url: string = config.url;
export const team: { name: string, members: string[] }[] = config.team;
