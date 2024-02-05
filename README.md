# Northcoders News API

Welcome to the Northcoders News API, a RESTful API designed to serve data for a news aggregation and discussion platform similar to Reddit. This API provides endpoints for retrieving articles, comments, users, topics, and more.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Deployment](#api-deployment)
- [Repository](#repository)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- MongoDB installed locally or a connection to a MongoDB instance

## Getting Started

To get a local copy up and running, follow these simple steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Gen0419/nc-news-api.git
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

## API Deployment

The Northcoders News API is deployed and hosted on Render. You can access the API using the following base URL:

[https://reddit-clone-scv5.onrender.com](https://reddit-clone-scv5.onrender.com)

Feel free to explore the available endpoints and interact with the API.

## Repository

The source code for the Northcoders News API is available on GitHub.

- Repository: [https://github.com/Gen0419/nc-news-api](https://github.com/Gen0419/nc-news-api)
- GitHub: [@Gen0419](https://github.com/Gen0419)

Feel free to explore the code, submit issues, or contribute to the project.

## Documentation

For detailed documentation on the available endpoints and how to use them, please refer to the [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news) documentation.

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).
