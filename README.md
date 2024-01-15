# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- MongoDB installed locally or a connection to a MongoDB instance

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nc-news-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nc-news-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root of the project with the following content:

   ```env
   NODE_ENV=development
   DATABASE_URL=<your_local_mongodb_url>
   ```

   Note: The `.env` file is added to the `.gitignore` to keep sensitive information secure.

5. Run the development server:

   ```bash
   npm start
   ```

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

```
Make sure to replace `<your_local_mongodb_url>` with the actual URL of your local MongoDB instance. Also, if there's a separate file for environment variables like `.env.local` or `.env.example`, mention it in the README.
```
