# EBuddy Monorepo

A monorepo containing frontend, backend, and shared code for the EBuddy application.

## Structure

- `frontend-repo`: Next.js frontend application
- `backend-repo`: Express.js backend API
- `packages/shared`: Shared code between frontend and backend

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Firebase CLI

### Development

```bash
# Run everything
npm run dev:local

# Run separately
npm run dev:frontend
npm run dev:backend
npm run dev:emulators
```

### Building

```bash
npm run build
```

## Data Structure

### Users Collection

- `totalAverageWeightRatings`: Average rating score
- `numberOfRents`: Total number of rentals
- `recentlyActive`: Timestamp of last activity
- `potentialScore`: Calculated field for efficient querying

## Score Calculation

```
potentialScore = (totalAverageWeightRatings * 10) + (numberOfRents * 0.1) + (recentlyActive * 0.000001)
``` 