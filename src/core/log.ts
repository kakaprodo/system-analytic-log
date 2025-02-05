import { LogItem, MainSetupOption } from "types/analytic.type";
import { BaseLog } from "./base-log";


export class Log extends BaseLog {
    constructor(setup: MainSetupOption) {
        if (!setup) {
            throw new Error("The 'setup' parameter is required and cannot be undefined. You should provide atleast your backendUrl.");
        }
        super(setup);
    }

    /**
     * Push logs to array
     */
    add(log: LogItem) {
        if (!log.tag) {
            throw new Error("The 'tag' value is required.");
        }

        this.displayInConsole(log);

        this.logs.push(this.formatLog(log));

        this.persistLogs();

        if (this.logs.length === 5) this.submitMany();

        return this;
    }

    /**
     * submit single log to the server
     */
    async send(log: LogItem) {
        this.displayInConsole(log);
        
        this.submit(await this.formatLog(log))
    }
}