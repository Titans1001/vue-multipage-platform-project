export let baseUrl = "http://127.0.0.1:8080/"

if (process.env.BASE_URL) {
    if (process.env.NODE_ENV === 'development') {
    } else {
        fileBaseUrl = process.env.BASE_URL;
        baseUrl = process.env.BASE_URL;
    }
}
