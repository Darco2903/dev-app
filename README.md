# dev-app

DevApp created to access and toggle dev tools faster

## How to use

1. Create [**uniserverz.json**](./config/uniserverz.json) and [**livebox.json**](./config/livebox.json) files in the **config** folder with the following structure:

**uniserverz.json**

```json
[
    {
        "name": "DATABASE_NAME",
        "PATH": "PATH_TO_DATABASE",
        "EXEC": "CONTROLLER_EXECUTABLE",
        "APACHE": "APACHE_EXUTABLE",
        "MYSQL": "MYSQL_EXUTABLE"
    },
    ...
]
```

**livebox.json**

```json
{
    "username": "USERNAME",
    "password": "PASSWORD"
}
```

2. Run the app with the following command:

```bash
npm start
```

## Old Features

### CloudFront

Create [**aws.json**](./config/aws.json) file in the **config** folder with the following structure:

**aws.json**

```json
{
    "accessKeyId": "ACCESS_KEY_ID",
    "secretAccessKey": "SECRET_ACCESS"
}
```

The next step is to uncomment the following lines:

-   [**index.html**](./electron/browser/index.html#L10)
-   [**index.js**](./electron/window/index.js#L5)
-   [**index.js**](./electron/browser/js/main/index.js#L2)
-   [**index.js**](./electron/browser/js/main/index.js#L62)
-   [**index.js**](./electron/browser/css/main/index.css#L3)

The last step is to install the following dependencies:

```bash
npm install @aws-sdk/client-cloudfront
```
