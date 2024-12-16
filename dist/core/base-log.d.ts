import { LogItem, MainSetupOption } from 'types/analytic.type';
export declare class BaseLog {
    browserId: string | null;
    tenant_id: string;
    logs: LogItem[];
    backendUrl: string;
    requestHeaders: object;
    singleLogEndpoint?: string;
    manyLogEndpoint?: string;
    eventOptions: {
        onSubmitSucceeded: (value?: any) => void;
        onSubmitFailed: (value?: any) => void;
        htmlDomSettings?: import("types/analytic.type").HtmlDomSettings;
    };
    submitAfter: number;
    constructor({ tenant_id, backendUrl, requestHeaders, singleLogEndpoint, manyLogEndpoint, submitAfter, ...eventOptions }: MainSetupOption);
    loadBrowserIdentifier(): Promise<void>;
    formatLog(log: LogItem): LogItem;
    submitMany(): Promise<void>;
    submit(log: LogItem): Promise<void>;
    /**
     * Countdown submitter for submitting logs in mass
     * after a given number or period
     */
    initCountDownSubmitter(): Promise<void>;
    dispatchToServer(data: LogItem | LogItem[]): Promise<void>;
    persistLogs(): void;
    getPersistedLogs(): LogItem[];
}
