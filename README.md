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

### Clone and Setup

```bash
# Clone the repository
git clone [your-repo-url]

# Setup the monorepo (installs dependencies in all packages)
npm run setup
```

### Development

```bash
# Run everything (backend, frontend, and Firebase emulators)
npm run dev:local

# Run separately
npm run dev:frontend  # Only frontend
npm run dev:backend   # Only backend
npm run dev:emulators # Only Firebase emulators
```

### Users Collection

- `totalAverageWeightRatings`: Average rating score
- `numberOfRents`: Total number of rentals
- `recentlyActive`: Timestamp of last activity
- `potentialScore`: Calculated field for efficient querying

## Score Calculation

```
potentialScore = (totalAverageWeightRatings * 10) + (numberOfRents * 0.1) + (recentlyActive * 0.000001)
``` 