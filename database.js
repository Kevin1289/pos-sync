import { MongoClient, ServerApiVersion } from 'mongodb';

// Get username and password using process.env
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const host = process.env.MONGODB_HOST;
const appName = process.env.MONGODB_APP_NAME;

if (!username) {
  console.error('Missing MongoDB username');
  process.exit(1);
}

if (!password) {
  console.error('Missing MongoDB password');
  process.exit(1);
}

if (!host) {
  console.error('Missing MongoDB host');
  process.exit(1);
}

if (!appName) {
  console.error('Missing MongoDB app name');
  process.exit(1);
}

const uri = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=${appName}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
