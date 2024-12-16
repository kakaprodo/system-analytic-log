
export type AnalyticDuplicateAfter = 
  'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'never'
  | 'every';


export type LogItem = {
    /**
     * to whom the log is for, `system` will be the default
     */
    tenant_id?: string;

    /**
     * the log description or label
     */
    tag: string;

    /**
     * any action name: click, hover, custom ...
     */
    action?: string | null;

    /**
     * the category of the log
     */
    group?: string | null;
    
    value?: number; // default 1
    identifier?: string | null; // browser agent

    payload?: object;
    duplicate_after: AnalyticDuplicateAfter;

}

export type MainSetupOption = {
    backendUrl: string;
    tenant_id?: string;
    requestHeaders?: object;

    /**
     * endpoint where to submit a single log
     */
    singleLogEndpoint?: string;

    /**
     * endpoint where to submit many logs at the same time
     */
    manyLogEndpoint?: string;
      
    /**
     * Time in millisecond after what the package should submit
     * all the collected logs
     */
    submitAfter?: number | null,

    onSubmitSucceeded: (value?: any) => void;
    onSubmitFailed: (value?: any) => void;
    
    htmlDomSettings?: HtmlDomSettings;
}

export type HtmlDomSettings = {
    /**
     * the attribute prefix to be used on html tags: data-an, data-log,
     * analytic,... 
     */
    attributePrefix?: string;

    /**
     * When true, every single log defined on html tag will trigger a submission
     * even otherwise logs will be collected and subimitted after some period 
     */
    singleSubmission?: boolean;
}