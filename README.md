# Finance Tracker

A minimalist finance tracker MVP built with Expo, React Native, Expo Router, TypeScript, Zustand, and react-native-svg. Designed for iOS Expo Go testing.

## Getting Started

```bash
npm install
npm run ios
```

This launches the Expo development server and opens Expo Go on iOS simulator/devices.

## Features

- Bottom tab navigation (Home, Transactions, Leaderboard, Account)
- Global state management powered by Zustand with seeded mock data
- Stylish home dashboard with summaries and a custom mini bar chart
- Transactions grouped by day with income/expense color coding
- Floating Add Transaction button and modal for quick entry with date picker
- Editable profile name and currency selection

## Tech Stack

- Expo SDK 50
- Expo Router 3
- React Native 0.73
- TypeScript
- Zustand for state management
- react-native-svg for chart rendering
- @react-native-community/datetimepicker for date selection

## Structure

```
app/
  _layout.tsx        # Root stack + modal routing
  (tabs)/            # Bottom tab routes
  transactions/      # Modal screen for adding transactions
components/          # Shared UI components
lib/                 # Global store and utilities
```

## Notes

- The project targets iOS via Expo Go. No additional native setup is required.
- Data is stored in-memory for now but the store has a simple shape that can be swapped with SQLite later.
- There are intentionally no PNG assets to keep the repository lightweight.
