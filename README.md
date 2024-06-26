# Bite Kiosk Sync Server

## Setup and Run

1. Clone the repository
   ```bash
   git clone git@github.com:Kevin1289/pos-sync.git
   cd pos-sync
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Start the server
    ```bash
    npm start
    ```

4. Trigger the sync by accessing the endpoint
    ```bash
    curl http://localhost:3000/trigger-sync?location_id=<your_location_id>
    ```

## Testing
To run the tests, use the following command:
```bash
npm test
```

## Logging
Logs are saved to `server.log` and also output to the console.

## Database
The project uses a mongoDB database. The connection string can be configured in the `.env` file. An `example.env` file is provided in the repository.
* You can create a free mongoDB instance at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
