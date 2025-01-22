"use strict";
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
exports.sendLog = exports.addLog = exports.analyticInit = void 0;
const log_1 = require("./core/log");
/**
 * Make the Log gate available on the window
 */
const analyticInit = (_a) => {
    var { htmlDomSettings } = _a, setup = __rest(_a, ["htmlDomSettings"]);
    const logGate = window.ANALYTIC_LOG = new log_1.Log(setup);
    htmlDomSettings && listenToAnalyticDomEvents(htmlDomSettings);
    return logGate;
};
exports.analyticInit = analyticInit;
const listenToAnalyticDomEvents = (settings) => {
    var _a, _b;
    const prefix = (_a = settings.attributePrefix) !== null && _a !== void 0 ? _a : 'data-sa';
    const shouldSubmit = (_b = settings.singleSubmission) !== null && _b !== void 0 ? _b : true;
    const elements = document.querySelectorAll(`[${prefix}-event]`);
    elements.forEach((element) => {
        const eventValue = element.getAttribute(`${prefix}-event`);
        const htmlTag = eventValue === 'DOMContentLoaded' ? document : element;
        htmlTag.addEventListener(eventValue, () => {
            var _a, _b, _c, _d, _e;
            const tenantId = element.getAttribute(`${prefix}-tenant`);
            const tag = element.getAttribute(`${prefix}-tag`);
            const action = (_a = element.getAttribute(`${prefix}-action`)) !== null && _a !== void 0 ? _a : eventValue;
            const group = element.getAttribute(`${prefix}-group`);
            const value = (_b = element.getAttribute(`${prefix}-value`)) !== null && _b !== void 0 ? _b : '1';
            const duplicate_after = ((_c = element.getAttribute(`${prefix}-duplicate`)) !== null && _c !== void 0 ? _c : 'never');
            const directSubmit = Number((_d = element.getAttribute(`${prefix}-direct`)) !== null && _d !== void 0 ? _d : '1') !== 0;
            const handler_type = ((_e = element.getAttribute(`${prefix}-handler`)) !== null && _e !== void 0 ? _e : 'all');
            (shouldSubmit && directSubmit ? exports.sendLog : exports.addLog)({
                tenant_id: tenantId,
                tag,
                action,
                group,
                value: Number(value),
                duplicate_after,
                handler_type,
            });
        });
    });
};
/**
 * Add logs to be submitted after a specific period
 */
const addLog = (log) => {
    return window.ANALYTIC_LOG.add(log);
};
exports.addLog = addLog;
/**
 * Direct submit of a single log to server
 */
const sendLog = (log) => {
    window.ANALYTIC_LOG.send(log);
};
exports.sendLog = sendLog;
