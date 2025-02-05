"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const base_log_1 = require("./base-log");
class Log extends base_log_1.BaseLog {
    constructor(setup) {
        if (!setup) {
            throw new Error("The 'setup' parameter is required and cannot be undefined. You should provide atleast your backendUrl.");
        }
        super(setup);
    }
    /**
     * Push logs to array
     */
    add(log) {
        if (!log.tag) {
            throw new Error("The 'tag' value is required.");
        }
        this.displayInConsole(log);
        this.logs.push(this.formatLog(log));
        this.persistLogs();
        if (this.logs.length === 5)
            this.submitMany();
        return this;
    }
    /**
     * submit single log to the server
     */
    send(log) {
        return __awaiter(this, void 0, void 0, function* () {
            this.displayInConsole(log);
            this.submit(yield this.formatLog(log));
        });
    }
}
exports.Log = Log;
