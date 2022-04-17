import { addError } from "./database";

export function handle(module: string): (err) => void {
    return (err) => {
        console.error(`Error occoured in module ${module}!\n${err}`);
        addError(module,err).catch(console.error);
    };
}