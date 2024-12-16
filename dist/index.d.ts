import { Log } from "./core/log";
import { LogItem, MainSetupOption } from "./types/analytic.type";
/**
 * Make the Log gate available on the window
 */
export declare const analyticInit: ({ htmlDomSettings, ...setup }: MainSetupOption) => Log;
/**
 * Add logs to be submitted after a specific period
 */
export declare const addLog: (log: LogItem) => Log;
/**
 * Direct submit of a single log to server
 */
export declare const sendLog: (log: LogItem) => void;
