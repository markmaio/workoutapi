# Workout Tracker API

## Overview
The **Workout Tracker API** is a RESTful API built with **Express.js** and **MongoDB** to track and manage running workouts. It allows users to add, retrieve, filter, and delete workout records while also tracking total distance run.

## Features
- Add new workout entries with details such as distance, duration, calories burned, and heart rate.
- Retrieve all workouts or filter workouts by various parameters, such as date, distance, calories, and route nickname.
- Track the total distance run across all workouts.
- Delete a specific workout by its name (e.g., "MorningRun").

## Technologies
- **Node.js**: JavaScript runtime.
- **Express.js**: Backend framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB object modeling for Node.js.

## API Endpoints

### POST /workouts
Add a new workout record with details such as date, distance, and duration.

### GET /workouts
Retrieve all workout records from the database.

### GET /workouts/filter
Filter workouts based on query parameters like date, minimum distance, and route nickname.

### GET /workouts/total-distance
Get the total distance covered in all recorded workouts.

### DELETE /workouts/:id
Delete a workout record by its unique identifier (ID).

### GET /workouts/filter?min_calories=number
Filter workouts to find those with a minimum number of calories burned.

### GET /workouts/filter?max_distance=number
Filter workouts to find those with a maximum distance.

### GET /workouts/filter?max_heart_rate_bpm=number
Filter workouts to find those with a maximum average heart rate.

### GET /workouts/filter?route_nickname=name
Filter workouts by the route nickname to find workouts associated with a specific route.

## Getting Set Up

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- Have a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster set up.
- npm install
- npm start
