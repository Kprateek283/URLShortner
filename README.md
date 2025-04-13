# URL Shortener

A modern URL shortening service built with React, TypeScript, and Node.js.

## Features

- Shorten long URLs into manageable links
- Custom alias support for shortened URLs
- Analytics tracking for shortened URLs
- Modern and responsive user interface
- Secure and reliable URL redirection

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint for code quality

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Project Structure

```
.
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
│
└── backend/           # Node.js backend server
    ├── controllers/   # Route controllers
    ├── models/        # Database models
    ├── routes/        # API routes
    ├── middleware/    # Custom middleware
    ├── utils/         # Utility functions
    ├── database/      # Database configuration
    └── server.js      # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kprateek283/URLShortner.git
cd URLShortner
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

2. Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable tools and libraries 
