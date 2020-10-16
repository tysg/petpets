import chalk from "chalk";

export const log = {
    // Generic loggers
    info: (msg: string, ...rest: any) => console.log(msg, ...rest),
    error: (msg: string, ...rest: any) => console.error(chalk.red(msg), ...rest),
    fatal: (msg: string, ...rest: any) => console.error(chalk.red.bold(msg), ...rest),

    // Domain-specific loggers
    route: (msg: string, ...rest: any) => console.log(chalk.blue.bold(msg), ...rest),
    controller: (msg: string, ...rest: any) => console.log(chalk.blue(msg), ...rest),
    db_query: (msg: string, ...rest: any) => console.log(chalk.cyan(msg), ...rest)
};


// https://github.com/Na-Nazhou/CosMaS/blob/master/helpers/logging.js