# Weather Monitoring

## Project Overview

The Weather Monitoring Application is designed to provide real-time weather updates for specified locations.
The application retrieves weather data at configurable intervals and notifies users of any significant changes in weather
conditions.

## Features

- Retrieve weather data for specified locations.
- Configurable intervals for data retrieval.
- Alerts for consecutive weather updates.
- User-friendly interface for easy navigation.
- Built with modern web technologies.

## Technologies Used

- **Frontend:** React.js, HTML
- **API:** OpenWeatherMap API
- **State Management:** Local Storage
- **Styling:** CSS/Bootstrap

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- [Git](https://git-scm.com/) (optional, for cloning the repository)

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yasar56/Weather-Monitoring.git

   ```

2. Navigate to the project directory:

   ```bash
   cd Weather-Monitor
   ```

## Installing React and Dependencies

1. Initialize the React Project (if not already done):
   If you don't have the create-react-app tool installed, you can install it globally using npm:

   ```bash
   npm install -g create-react-app

   ```

2. Install Project Dependencies:

   Make sure you are in the project directory, then install all required dependencies:

   ```bash
    npm install

   ```

3. Run the Application:

   Start the development server

   The application will be available at http://localhost:3000/.

   ```bash
   npm start

   ```

## Usage

#### 1. Selecting a City:

- Use the Select City dropdown to choose a city.
- The weather for the selected city will be displayed automatically.

#### 2. Viewing Weather Data:

- Current Temperature (Celsius or Fahrenheit).
- Weather Conditions (e.g., sunny, cloudy).
- Humidity and Wind Speed.

#### 3. Customizing Temperature Units:

- Celsius (°C)
- Fahrenheit (°F)
The temperature will update based on your selection.

#### 4. Configurable Update Intervals:
- Adjust how often the app retrieves weather updates in the Settings Menu.

### 5. Alerts for Significant Changes
- The app will notify you of significant weather changes after two consecutive updates.



## Directory Structure

    src/
    |── assets/
    ├── components/
    │   └── weatherMon.jsx
    ├── App.js
    ├── index.js
    ├── index.css
    └── app.css

## Contact

#### For any inquiries or support, please contact:

- Mohamed Javed Yasar
- Email: yasarm0024@gmail.com
