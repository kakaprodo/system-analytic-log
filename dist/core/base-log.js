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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLog = void 0;
const thumbmarkjs_1 = require("@thumbmarkjs/thumbmarkjs");
const logStorageKeyName = 'salogsfndskjds_ana';
class BaseLog {
    constructor(_a) {
        var { tenant_id = 'system', backendUrl, requestHeaders = {}, singleLogEndpoint = 'analytic-logs/add', manyLogEndpoint = 'analytic-logs/add-many', submitAfter } = _a, eventOptions = __rest(_a, ["tenant_id", "backendUrl", "requestHeaders", "singleLogEndpoint", "manyLogEndpoint", "submitAfter"]);
        this.browserId = null;
        this.logs = [];
        this.tenant_id = tenant_id;
        this.backendUrl = backendUrl;
        this.requestHeaders = requestHeaders;
        this.singleLogEndpoint = singleLogEndpoint;
        this.manyLogEndpoint = manyLogEndpoint;
        this.eventOptions = eventOptions;
        this.logs = this.getPersistedLogs();
        this.submitAfter = submitAfter === null ? 50 : (submitAfter !== null && submitAfter !== void 0 ? submitAfter : 10000);
        this.loadBrowserIdentifier();
        this.initCountDownSubmitter();
    }
    loadBrowserIdentifier() {
        return __awaiter(this, void 0, void 0, function* () {
            const fp = yield (0, thumbmarkjs_1.getFingerprint)();
            this.browserId = fp;
        });
    }
    formatLog(log) {
        var _a, _b, _c;
        log.tenant_id = (_a = log.tenant_id) !== null && _a !== void 0 ? _a : this.tenant_id;
        log.value = (_b = log.value) !== null && _b !== void 0 ? _b : 1;
        log.identifier = (_c = log.identifier) !== null && _c !== void 0 ? _c : this.browserId;
        return log;
    }
    submitMany() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.logs.length === 0)
                return;
            yield this.dispatchToServer(this.logs);
            this.logs = [];
            this.persistLogs();
            this.initCountDownSubmitter();
        });
    }
    submit(log) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dispatchToServer(log);
        });
    }
    /**
     * Countdown submitter for submitting logs in mass
     * after a given number or period
     */
    initCountDownSubmitter() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => this.submitMany(), this.submitAfter);
        });
    }
    dispatchToServer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.browserId)
                yield this.loadBrowserIdentifier();
            const isSingleLog = data.length === undefined;
            const url = this.backendUrl + '/' + (isSingleLog ? this.singleLogEndpoint : this.manyLogEndpoint);
            if (isSingleLog) {
                data = Object.assign(Object.assign({}, data), { identifier: this.browserId });
            }
            else {
                data = data.map(log => (Object.assign(Object.assign({}, log), { identifier: this.browserId })));
            }
            fetch(url, {
                method: 'POST',
                headers: Object.assign({ 'Accept': 'application/json', 'Content-Type': 'application/json' }, this.requestHeaders),
                body: isSingleLog ?
                    JSON.stringify(data)
                    : JSON.stringify({ logs: data }),
            }).then(response => response.json())
                .then(data => {
                this.eventOptions.onSubmitSucceeded && (this.eventOptions.onSubmitSucceeded)(data);
            }).catch(error => {
                console.error('Error:', error);
                this.eventOptions.onSubmitFailed && (this.eventOptions.onSubmitFailed)(data);
            });
        });
    }
    persistLogs() {
        sessionStorage.setItem(`${this.tenant_id}-${logStorageKeyName}`, JSON.stringify(this.logs));
    }
    getPersistedLogs() {
        const logs = sessionStorage.getItem(`${this.tenant_id}-${logStorageKeyName}`);
        return logs === null ? [] : JSON.parse(logs);
    }
}
exports.BaseLog = BaseLog;
