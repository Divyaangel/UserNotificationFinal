# User Notification Preferences API

## Overview
A serverless Nest.js API for managing user notification preferences and sending notifications with comprehensive features.

## Features
- User Notification Preferences Management
- Notification Sending Simulation
- Rate Limiting
- Logging
- Statistical Tracking
- Swagger OpenAPI Documentation

## Tech Stack
- Nest.js
- TypeScript
- MongoDB (Mongoose)
- Jest (Testing)
- Class Validator
- Swagger OpenAPI

## Prerequisites
- Node.js (v16+)
- MongoDB
- npm or Yarn

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/user-notification-preferences-api.git
cd user-notification-preferences-api
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```
MONGODB_URI=mongodb://localhost:27017/notification_preferences
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Run the Application

#### Development Mode
```bash
npm run start:dev
# or
yarn start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

## API Endpoints

### User Preferences
- `POST /api/preferences`: Create user preferences
- `GET /api/preferences/:userId`: Retrieve user preferences
- `PATCH /api/preferences/:userId`: Update user preferences
- `DELETE /api/preferences/:userId`: Delete user preferences

### Notifications
- `POST /api/notifications/send`: Send a notification
- `GET /api/notifications/:userId/logs`: Retrieve notification logs
- `GET /api/notifications/stats`: Get notification statistics

## Swagger Documentation
Access Swagger UI at: `http://localhost:3000/api-docs`

## Testing

### Unit Tests
```bash
npm run test
# or
yarn test
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

### AWS Lambda Deployment
1. Use Serverless Framework
2. Configure `serverless.yml`
3. Deploy with `serverless deploy`

## Docker Support
```bash
docker build -t notification-api .
docker run -p 3000:3000 notification-api
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License
