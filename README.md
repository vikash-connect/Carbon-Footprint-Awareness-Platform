# Carbon Footprint Awareness Platform

A production-grade, vanilla JavaScript web application designed to help users track, understand, and reduce their carbon footprint.

## Features
- **Smart Onboarding:** 5-step quiz to establish a baseline carbon footprint.
- **Personal Dashboard:** Live Chart.js integration and real-time activity logging.
- **Action Engine:** AI-driven personalized reduction recommendations based on highest emission categories.
- **Community:** Gamified 7-day streak tracking, leaderboard, and badges.

## Technologies
- **Frontend:** Vanilla JS (ES6+ modules), HTML5, CSS3.
- **Testing:** Jest.
- **Charts:** Chart.js via CDN.
- **No frameworks, no build tools** (aside from Jest for tests).

## How to Run Locally
1. Clone the repository or navigate to the project directory.
2. Simply open `index.html` in any modern web browser! No local server or build step required.

## File Structure
- `index.html`: Application entry point and view skeleton.
- `src/`: 
  - `main.js`: Router and initializer.
  - `data/`: Constants and predefined action datasets.
  - `modules/`: Pure calculation logic, secure storage wrapper, charting, and DOM render helpers.
  - `views/`: View-specific controller logic.
- `styles/`: BEM-structured CSS files (base, components, views).
- `tests/`: Jest unit test suites for pure logic modules.

## How to Run Tests
Tests are written using Jest and are configured to run natively with Node's ES Modules support.

```bash
# Install Jest
npm install

# Run Tests
npm test
```
