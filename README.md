# Github OAuth Lambda Function

- No dependencies!
- Environment Variables: `CLIENT_ID` & `CLIENT_SECRET`
- Successful response (`application/json`)
```
{
  token: <YOUR_TOKEN>
}
```
- Unsuccessful response (`application/json`)
```
{
  message: <ERROR_MESSAGE>
}
```