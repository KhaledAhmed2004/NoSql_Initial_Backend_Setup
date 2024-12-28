# `sendResponse` Utility

The utility is used to standardize API responses across your application. This ensures all responses follow the same structure, making it easier for frontend developers or API consumers to parse and handle the responses.

Here’s how the utility works:

### `sendResponse` Function:


```typescript
import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
```
1. **Input**: The `sendResponse` function takes two parameters:
   - `res`: The response object from Express, which is used to send the response to the client.
   - `data`: The response data that follows the `TResponse` type structure. This data includes:
     - `statusCode`: The HTTP status code to be sent in the response.
     - `success`: A boolean indicating if the request was successful.
     - `message`: An optional message, typically used for additional information about the request or response.
     - `data`: The actual response data (can be any type).

2. **Output**: The function formats the response as a JSON object containing the following structure:
   - `success`: A boolean indicating the success of the request.
   - `message`: A message, if available.
   - `data`: The actual data returned from the request.
   It then sends this JSON response back to the client with the appropriate HTTP status code.


### Example Usage in an API Route:

```typescript
const getAllUsersFromDB: RequestHandler = async (req, res) => {
  const users = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "List of users",
    data: users,
  });
};
```
