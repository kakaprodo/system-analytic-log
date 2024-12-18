# System analytic log

A client gate of the kakaprodo/system-analytic package that collect analytics and send them to the server.

## installation

```sh
  npm install system-analytic-log
```

## Usage

to start using this package, you will need to initialise its instance by providing all the necessary setup options

```js
analyticInit({
    backendUrl: `https://example-my-server-dns.com/api`,
    submitAfter: 5000,
    tenant_id: "system",
});
```

you can also add `requestHeaders` information such as authentication keys.

## Options Explanation

| Option        | Description                                                                                   | Type     | Default  | Required |
| ------------- | --------------------------------------------------------------------------------------------- | -------- | -------- | -------- |
| `backendUrl`  | The URL of your server's API endpoint where analytics data will be submitted.                 | `string` | N/A      | Yes      |
| `submitAfter` | Time interval (in milliseconds) after which collected analytics data will be sent to backend. | `number` | `10000`  | No       |
| `tenant_id`   | This can be any string to identifier the entity for which you are collecting analytics        | `string` | `system` | NO       |

## Collect analytics

There is two ways of collecting analytics:

-   Collect then the package will submit data for you
-   Or collect and submit data directly

### Collect and leave submission to the package

Use this method when you don't want to send many requests to your server.

```js
addLog({
    tag: "Banana",
    action: "viewed",
    group: "fruit",
    duplicate_after: "never",
});
```

The `addLog` function collects data and submits the collected analytics either when the specified `submitAfter` duration has elapsed or when the collection reaches a threshold of `5` items, whichever comes first.

### Collect and submit right a way

use this method when you need to hit your backend server on every analytic collection:

```js
sendLog({
    tag: "Banana",
    action: "viewed",
    group: "fruit",
    duplicate_after: "never",
});
```

### `addLog` or `sendLog` Options Explanation

| Option            | Description                                                                               | Type                                                                               | Default   | Required | Example                               |
| ----------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------- | -------- | ------------------------------------- |
| `tag`             | A label or identifier for the log. Typically describes the item or event being tracked.   | `string`                                                                           | N/A       | Yes      | `"Banana"`                            |
| `action`          | Describes the action performed on the `tag`.                                              | `string`                                                                           | N/A       | No       | `"viewed"`                            |
| `group`           | Used to categorize or group similar logs together.                                        | `string`                                                                           | N/A       | No       | `"fruit"`                             |
| `duplicate_after` | Determines how frequently duplicate logs for the same `tag` and `action` can be recorded. | `'minute' \| 'hour' \| 'day' \| 'week' \| 'month' \| 'year' \| 'never' \| 'every'` | `'never'` | No       | `"hour"`                              |
| `payload`         | An object containing additional data about the log. Can include any key-value pairs.      | `object`                                                                           | `{}`      | No       | `{ color: "yellow", size: "medium" }` |
| `value`           | A numeric value associated with the log, useful for analytics calculations.               | `number`                                                                           | `1`       | No       | `5`                                   |

1. **`tag`**

    - **Description**: Acts as a unique identifier for the item or event being tracked.
    - **Example**: For an e-commerce site, `tag` could be `"ProductPage"` to track views of a specific product.

2. **`action`**

    - **Description**: Describes what action was performed. This could be actions like `"clicked"`, `"viewed"`, or `"purchased"`.
    - **Example**: `"viewed"` indicates the item was viewed.

3. **`group`**

    - **Description**: Categorizes logs into logical groups for better organization and filtering.
    - **Example**: `"fruit"` groups all fruit-related logs together.

4. **`duplicate_after`**

    - **Description**: Sets the interval during which duplicate logs for the same `tag` and `action` are ignored.
    - **Possible Values**:
        - `'minute'`, `'hour'`, `'day'`, `'week'`, `'month'`, `'year'`: Restricts duplicates within the specified time frame.
        - `'never'`: Prevents duplicates entirely.
        - `'every'`: Allows duplicates at any time.
    - **Example**: Setting this to `'day'` ensures the same log is recorded only once per day.

5. **`payload`**

    - **Description**: Allows you to attach additional context or metadata as key-value pairs.
    - **Example**: `{ color: "yellow", size: "medium" }` provides extra information about the logged item.

6. **`value`**
    - **Description**: A numeric value associated with the log, often used for summing or averaging analytics data.
    - **Default**: `1` if not specified.
    - **Example**: Setting `value: 5` might indicate 5 units of the item were interacted with.

---

## Collect Analytics From Html Tags

Before using this approach you will need first to configure `htmlDomSettings` on the main instance, so our instance setup will look like:

```js
analyticInit({
    backendUrl: `https://example-my-server-dns.com/api`,
    submitAfter: 5000,
    tenant_id: "system",
    htmlDomSettings: {
        attributePrefix: "data-sa", // can also be : analytic, ...
        singleSubmission: false,
    },
});
```

### `htmlDomSettings` Options Explanation

| Sub-Option         | Description                                                                                                                                                           | Type      | Default     | Required |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- | -------- |
| `attributePrefix`  | Prefix for custom HTML attributes that trigger analytics tracking.                                                                                                    | `string`  | `"data-sa"` | No       |
| `singleSubmission` | When set to `true`, each log defined on an HTML tag will trigger an immediate submission. Otherwise, logs will be collected and submitted after a specified interval. | `boolean` | `false`     | No       |

### Usage

#### Supported attributes suffix

Here is the list of tag `suffix` supported by this package:

-   `event` : A crucial attribute used by this package to capture any existing HTML DOM event. Without this attribute, no data will be collected.
-   `tag`
-   `action`
-   `group`
-   `value`
-   `duplicate` : same functionality as `duplicate_after`
-   `direct` : can be `0` or `1`. its value will overide the `singleSubmission` setting.

#### Example of using HTML DOM

Remember the attribute prefix that we are using is set to `attributePrefix: "data-sa"`, means we will be using `data-sa` before the supported suffix:

```html
<button
    data-sa-event="click"
    data-sa-tag="Banana"
    data-sa-action="viewed"
    data-sa-group="fruit"
    data-sa-duplicate="day"
>
    View Product
</button>
```

## License

This project is licensed under the ISC License.

## Additional Resources

-   [kakaprodo/system-analytic](https://yupidoc.com/projects/system-analytic/preview) : the php-laravel package that works with this Js package
