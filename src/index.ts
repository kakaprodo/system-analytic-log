import { Log } from "./core/log";
import { AnalyticDuplicateAfter, HtmlDomSettings, LogItem, MainSetupOption } from "./types/analytic.type";

/**
 * Make the Log gate available on the window
 */
export const analyticInit = ({
    htmlDomSettings,
    ...setup
}: MainSetupOption): Log => {
    const logGate = (window as any).ANALYTIC_LOG = new Log(setup);

    htmlDomSettings && listenToAnalyticDomEvents(htmlDomSettings);
    
    return logGate;
}

const listenToAnalyticDomEvents = (settings : HtmlDomSettings) => {
    const prefix = settings.attributePrefix ?? 'data-sa';
    const shouldSubmit = settings.singleSubmission ?? true;

    const elements = document.querySelectorAll(`[${prefix}-event]`);
  
    elements.forEach((element) => {
        const eventValue = element.getAttribute(`${prefix}-event`);
        const htmlTag = eventValue === 'DOMContentLoaded'? document: element;
        htmlTag.addEventListener(eventValue as keyof ElementEventMap, () => {
            const tenantId = element.getAttribute(`${prefix}-tenant`);
            const tag = element.getAttribute(`${prefix}-tag`) as string;
            const action = element.getAttribute(`${prefix}-action`) ?? eventValue;
            const group = element.getAttribute(`${prefix}-group`);
            const value = element.getAttribute(`${prefix}-value`) ?? '1';
            const duplicate_after = (element.getAttribute(`${prefix}-duplicate`) ?? 'never') as AnalyticDuplicateAfter;
            const directSubmit = Number(element.getAttribute(`${prefix}-direct`) ?? '1') !== 0;

            (shouldSubmit && directSubmit ? sendLog : addLog)({
                tenant_id: tenantId as string,
                tag,
                action,
                group,
                value: Number(value),
                duplicate_after
            });
        });
    });
}

/**
 * Add logs to be submitted after a specific period
 */
export const addLog = (log: LogItem): Log => {
    return ((window as any).ANALYTIC_LOG as Log).add(log);
}

/**
 * Direct submit of a single log to server 
 */
export const sendLog = (log: LogItem) => {
    ((window as any).ANALYTIC_LOG as Log).send(log);
}
