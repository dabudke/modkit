import { readFileSync } from "fs";

export const config = JSON.parse(readFileSync("./config.json", "utf-8"));

export const name: string = config.name;
export const version: string = config.version;
export const color: number = config.color;
export const url: string = config.url;
export const icon: string = config.icon;
export const team: { name: string, members: string[] }[] = config.team;
export const owner: string = config.owner;
export const server: string = config.server;
