import { LogItem, MainSetupOption } from "types/analytic.type";
import { BaseLog } from "./base-log";
export declare class Log extends BaseLog {
    constructor(setup: MainSetupOption);
    /**
     * Push logs to array
     */
    add(log: LogItem): this;
    /**
     * submit single log to the server
     */
    send(log: LogItem): Promise<void>;
}
