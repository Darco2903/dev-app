# dev-app

DevApp created to access and toggle dev tools faster

## How to use

1. Create [**aws.json**](./config/aws.json), [**uniserverz.json**](./config/uniserverz.json) and [**livebox.json**](./config/livebox.json) files in the **config** folder with the following structure:

**aws.json**

```json
{
    "accessKeyId": "ACCESS_KEY_ID",
    "secretAccessKey": "SECRET_ACCESS"
}
```

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
