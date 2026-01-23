# GSheet-CRUD

A Google Sheets RESTful API service based on [sheetsql](https://github.com/joway/sheetsql), using Google Sheets as a database with full CRUD operations.

## Features

- Use Google Sheets as a lightweight database
- Standard RESTful API (GET/POST/PUT/DELETE)
- Support query parameters for data filtering
- Built with Next.js, supports one-click deployment to Vercel

## Prerequisites

### 1. Share Google Sheets Permission

**Important**: You must add the following service account email as an **Editor** to your Google Sheets, otherwise reading and writing data will not work:

```
gsheett-younami@woven-fountain-458301-p7.iam.gserviceaccount.com
```

Steps:
1. Open your Google Sheets document
2. Click the "Share" button in the top right corner
3. Paste the above email address in the "Add people" input field
4. Set the permission to "Editor"
5. Click "Done"

### 2. Prepare Sheet Data

- The **first row** of the sheet must be column names (field names)
- Data starts from the second row

Example sheet structure:

| name | age | email |
|------|-----|-------|
| John | 25 | john@example.com |
| Jane | 30 | jane@example.com |

## API Usage

### URL Format

```
/{doc_id}/{sheet_name}
```

- `doc_id`: Google Sheets document ID (can be found in the URL: `https://docs.google.com/spreadsheets/d/{doc_id}/edit`)
- `sheet_name`: Sheet name (optional, defaults to `Sheet1`)

### Query Data (GET)

Get all data:
```bash
GET /{doc_id}/{sheet_name}
```

Query with conditions:
```bash
GET /{doc_id}/{sheet_name}?name=John&age=25
```

### Insert Data (POST)

Insert a single record:
```bash
POST /{doc_id}/{sheet_name}
Content-Type: application/json

{
  "name": "Mike",
  "age": 28,
  "email": "mike@example.com"
}
```

Insert multiple records:
```bash
POST /{doc_id}/{sheet_name}
Content-Type: application/json

[
  {"name": "Mike", "age": 28, "email": "mike@example.com"},
  {"name": "Sarah", "age": 35, "email": "sarah@example.com"}
]
```

### Update Data (PUT)

Match data to update using query parameters:
```bash
PUT /{doc_id}/{sheet_name}?name=John
Content-Type: application/json

{
  "age": 26,
  "email": "new_email@example.com"
}
```

### Delete Data (DELETE)

Match data to delete using query parameters:
```bash
DELETE /{doc_id}/{sheet_name}?name=John
```

## Local Development

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Configure Service Account

Save the Google Cloud service account JSON key file as `google-serviceaccount.json` in the project root directory.

### Start Development Server

```bash
npm run dev
# or
yarn dev
```

The service will start at [http://localhost:3000](http://localhost:3000).

## Deployment

### Deploy to Vercel (Recommended)

1. Push the project to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variable in project settings under "Environment Variables":
   - Name: `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`
   - Value: Paste the complete contents of `google-serviceaccount.json` file
4. Click Deploy

### Other Deployment Methods

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

**Note**: When deploying in non-Vercel environments, ensure you configure the service account credentials using one of these methods:
- Set environment variable `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` (value is the JSON file content)
- Or place the `google-serviceaccount.json` file in the project root directory

## Tech Stack

- [Next.js](https://nextjs.org/) - React full-stack framework
- [sheetsql](https://github.com/joway/sheetsql) - Google Sheets database operation library
- [qs](https://www.npmjs.com/package/qs) - URL query string parsing

## Related Links

- [sheetsql GitHub](https://github.com/joway/sheetsql)
- [sheetsql NPM](https://www.npmjs.com/package/sheetsql)
- [Google Cloud Service Account Documentation](https://cloud.google.com/docs/authentication/production)

## License

MIT
