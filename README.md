# AI-Driven Banking Backend

A secure, AI-powered digital banking backend that integrates fraud detection, spending categorization, and an AI chatbot for enhanced banking services.

## Features

- 🔒 **Fraud Detection**: Real-time transaction monitoring using AI
- 📊 **Spending Categorization**: Automatic transaction categorization and insights
- 🤖 **AI Chatbot**: Intelligent banking assistant for customer support
- 🔐 **JWT Authentication**: Secure API access
- ⚡ **WebSocket Support**: Real-time updates and notifications
- 📈 **Scalable Architecture**: Built with FastAPI for high performance

## Prerequisites

- Python 3.8+
- PostgreSQL
- Redis
- Virtual Environment (recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd banking-backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values according to your setup

5. Initialize the database:
   ```bash
   # Make sure PostgreSQL is running
   # Create database and user as specified in .env
   ```

6. Start Redis:
   ```bash
   # Make sure Redis is running on the specified port
   ```

## Running the Application

1. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

2. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Fraud Detection
- `POST /api/v1/fraud/detect`: Analyze transaction for potential fraud

### Spending Categorization
- `POST /api/v1/spending/categorize`: Categorize a transaction
- `POST /api/v1/spending/insights`: Generate spending insights

### Chatbot
- `POST /api/v1/chat/message`: Process chat messages

### Health Check
- `GET /api/v1/health`: Check system health status

## WebSocket Connection

Connect to `ws://localhost:8000/ws` for real-time updates.

## Security

- JWT-based authentication
- CORS protection
- Rate limiting
- Input validation
- Secure password hashing

## Development

1. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

2. Run tests:
   ```bash
   pytest
   ```

3. Check code style:
   ```bash
   flake8
   black .
   ```

## Production Deployment

1. Update `.env` with production settings
2. Set up proper security measures
3. Use production-grade servers (e.g., Gunicorn)
4. Set up monitoring and logging
5. Configure proper database backup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 