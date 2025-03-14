# Vite React App

## Overview

This project is a React application bootstrapped with **Vite** for fast development and optimized builds. You can access its live version here https://pokemon-frontend-neon.vercel.app/ . The API response is extremley slow because the backend deployed to the free server of Render. I would highly recommend to run it on local.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v20 or later)

- **npm** (v6 or later) or **yarn**

---

## Setup Instructions

### 1. Clone the Repository

```

git clone https://github.com/geekyarjun/news-aggregator

cd your-repo

```

### 2. Install Dependencies

```

npm install

# or

yarn install

```

### 3. Create `.env` File

Create a `.env` file in the root directory and add the following environment variables:

```

# Vite settings

VITE_NEWS_API_KEY
VITE_GUARDIAN_API_KEY
VITE_NYTIMES_API_KEY

```

### 4. Start the Application

#### Development Mode

```

npm run dev

```

This starts the application in development mode. The app will be available at `http://localhost:5173` by default.

#### Production Mode

```

npm run build

npm run preview

```

This builds the application and serves the production build locally.

---

## Scripts

- **npm run dev**: Starts the development server.

- **npm run build**: Builds the application for production.

- **npm run preview**: Serves the production build locally.

---

## Project Structure

```

.

├── src

│ ├── assets # Static assets (images, fonts, etc.)

│ ├── components # Reusable React components

│ ├── hooks # Custom React hooks

│ ├── pages # Application pages

│ ├── services # API service functions

│ ├── lib # lib configs and Utility functions

│ └── main.jsx # Entry point

├── public # Public files served as-is

├── .env # Environment variables

├── .gitignore # Ignored files

├── package.json # Node.js dependencies and scripts

└── README.md # Project documentation

```

---

## Environment Variables

Here are the key environment variables used in this project:

---

## Troubleshooting

1.  **Environment Variables Not Loaded**:

- Ensure the `.env` file exists in the root directory and contains the required variables.

2.  **Port Already in Use**:

- Modify the `VITE_PORT` value in the `vite.config.js` or terminate the process using the port.

3.  **API Errors**:

- Verify that the `VITE_NEWS_API_KEY` is correct and the API server is running.

---

## Contributing

1. Fork the repository.

2. Create a new branch for your feature/fix.

3. Commit your changes with a clear message.

4. Push your branch and open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please reach out to [Arjun Shrivastava](mailto:itsarjunshrivastava@gmail.com).
