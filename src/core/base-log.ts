
import { getFingerprint } from '@thumbmarkjs/thumbmarkjs'
import { LogItem, MainSetupOption } from 'types/analytic.type';

const logStorageKeyName = 'salogsfndskjds_ana';

export class BaseLog {
    browserId: string | null = null;
    tenant_id: string;
    logs: LogItem[] = [];

    backendUrl: string;
    requestHeaders: object;
    singleLogEndpoint?: string;
    manyLogEndpoint?: string;

    eventOptions;

    submitAfter: number;

    constructor({
        tenant_id = 'system',
        backendUrl,
        requestHeaders = {},
        singleLogEndpoint = 'analytic-logs/add',
        manyLogEndpoint = 'analytic-logs/add-many',
        submitAfter,
        ...eventOptions
    }: MainSetupOption) {
        this.tenant_id = tenant_id;
        this.backendUrl = backendUrl;
        this.requestHeaders = requestHeaders;
        this.singleLogEndpoint = singleLogEndpoint;
        this.manyLogEndpoint = manyLogEndpoint;
        this.eventOptions = eventOptions;
        this.logs = this.getPersistedLogs();
        this.submitAfter = submitAfter === null ? 50 : ( submitAfter ?? 10000)
        

        this.loadBrowserIdentifier();
        this.initCountDownSubmitter();
    }

    async loadBrowserIdentifier() {
        const fp = await getFingerprint();
        this.browserId = fp;
    }

    formatLog(log: LogItem): LogItem {
        log.tenant_id = log.tenant_id ?? this.tenant_id;
        log.value = log.value ?? 1;
        log.identifier = log.identifier ?? (this.browserId as string);
        return log;
    }

    async submitMany() {
        if (this.logs.length === 0) return;

        await this.dispatchToServer(this.logs);

        this.logs = [];

        this.persistLogs();

        this.initCountDownSubmitter();
    }

    async submit(log: LogItem) {
        await this.dispatchToServer(log);
    }

    /**
     * Countdown submitter for submitting logs in mass
     * after a given number or period
     */
    async initCountDownSubmitter() {
        setTimeout(() => this.submitMany(), this.submitAfter);
    }

    async dispatchToServer(data: LogItem | LogItem[]) {

        if (!this.browserId) await this.loadBrowserIdentifier();
        
        const isSingleLog = (data as any).length === undefined;

        const url = this.backendUrl + '/' + (
            isSingleLog ? this.singleLogEndpoint : this.manyLogEndpoint
        );

        if (isSingleLog) {
            data = {
                ...data,
                identifier: this.browserId as string,
            };
            
        } else {
            data = (data as LogItem[]).map(log => ({
                ...log,
                identifier: this.browserId as string,
            }));
            data = this.uniquefyLogs(data);

            if (data.length === 0) return;
            console.log(data);
            return;
        }


        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...this.requestHeaders,
            },
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
    }

    persistLogs() {
        sessionStorage.setItem(`${this.tenant_id}-${logStorageKeyName}`, JSON.stringify(this.logs));
    }

    getPersistedLogs(): LogItem[] {
        const logs = sessionStorage.getItem(`${this.tenant_id}-${logStorageKeyName}`);

        return logs === null ? [] : JSON.parse(logs as string);
    }

    uniquefyLogs(logs: LogItem[]): LogItem[] {
        const seen = new Set<string>();
        return logs.filter(log => {
            const serialized = JSON.stringify(log);
            if (seen.has(serialized)) {
            return false;
            }
            seen.add(serialized);
            return true;
        });
    }
}