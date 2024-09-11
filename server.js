import express from 'express';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());

// Connect to MongoDB
const mongoUri = 'mongodb+srv://markamaiojr:Passw0rd@cluster0.5mure.mongodb.net/your-database-name?retryWrites=true&w=majority';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas! Woo!');
}).catch((err) => {
  console.error('Could not connect to MongoDB Atlas', err);
});

// Define Workout Schema
const workoutSchema = new mongoose.Schema({
    route_nickname: { type: String, required: true, unique: true },
    date_time: { type: Date, required: true },
    distance_km: { type: Number, required: true },
    duration_min: { type: Number, required: true },
    average_pace_min_km: { type: Number, required: true },
    heart_rate_bpm: { type: Number },
    calories_burned: { type: Number },
    notes: { type: String }
});


// Create Workout model
const Workout = mongoose.model("Workout", workoutSchema);

// POST /workouts - Add a new workout
app.post("/workouts", async (req, res) => {
    const { route_nickname, date_time, distance_km, duration_min, average_pace_min_km, heart_rate_bpm, calories_burned, notes } = req.body;

    if (!route_nickname || !date_time || !distance_km || !duration_min || !average_pace_min_km) {
        return res.status(400).send({ message: "Missing required fields." });
    }

    try {
        const existingWorkout = await Workout.findOne({ route_nickname });

        if (existingWorkout) {
            return res.status(400).send({ message: "Workout with this route nickname already exists." });
        }

        const newWorkout = new Workout({
            route_nickname,
            date_time,
            distance_km,
            duration_min,
            average_pace_min_km,
            heart_rate_bpm,
            calories_burned,
            notes
        });

        await newWorkout.save();
        res.status(201).send({ message: "Your workout has been added! Keep breaking that sweat!", workout: newWorkout });
    } catch (error) {
        res.status(500).send({ message: "Error saving workout.", error });
    }
});



// GET /workouts - Retrieve all workouts
app.get("/workouts", async (req, res) => {
    try {
        const workouts = await Workout.find();  // Retrieve all workouts from DB
        res.status(200).send(workouts);
    } catch (error) {
        res.status(500).send({ message: "Error fetching workouts.", error });
    }
});

// GET /workouts/filter - Filtered retrieval
app.get("/workouts/filter", async (req, res) => {
    const { 
        date, 
        min_distance, 
        max_distance, 
        min_calories, 
        max_calories, 
        min_heart_rate_bpm, 
        max_heart_rate_bpm, 
        route_nickname 
    } = req.query;

    try {
        let query = {};

        // Check for contradictory filters
        if (min_distance && max_distance && parseFloat(min_distance) > parseFloat(max_distance)) {
            return res.status(400).send({ message: "Minimum distance cannot be greater than maximum distance." });
        }

        // Filter by date
        if (date) {
            query.date_time = { $gte: new Date(date) };
        }

        // Filter by minimum distance
        if (min_distance) {
            query.distance_km = { $gte: parseFloat(min_distance) };
        }

        // Filter by maximum distance
        if (max_distance) {
            query.distance_km = { $lte: parseFloat(max_distance) };
        }

        // Filter by minimum calories
        if (min_calories) {
            query.calories_burned = { $gte: parseFloat(min_calories) };
        }

        // Filter by maximum heart rate
        if (max_heart_rate_bpm) {
            query.heart_rate_bpm = { $lte: parseFloat(max_heart_rate_bpm) };
        }

        // Filter by route nickname
        if (route_nickname) {
            query.route_nickname = route_nickname;
        }

        const filteredWorkouts = await Workout.find(query);  // Apply filters
        res.status(200).send(filteredWorkouts);
    } catch (error) {
        res.status(500).send({ message: "Error filtering workouts.", error });
    }
});

// GET /workouts/total-distance - Retrieve total distance
app.get('/workouts/total-distance', async (req, res) => {
    try {
        const totalDistance = await Workout.aggregate([
            { $group: { _id: null, totalDistance: { $sum: "$distance_km" } } }
        ]);
        
        const distance = totalDistance[0] ? totalDistance[0].totalDistance : 0;
        res.status(200).send({ total_distance: distance });
    } catch (err) {
        res.status(500).send({ message: 'Error calculating total distance.', error: err.message });
    }
});

// DELETE /workouts/:route_nickname - Delete a workout by route_nickname
app.delete('/workouts/:route_nickname', async (req, res) => {
    const { route_nickname } = req.params;

    try {
        const result = await Workout.findOneAndDelete({ route_nickname });

        if (!result) {
            return res.status(404).send({ message: 'Workout not found.' });
        }

        res.status(200).send({ message: 'Workout deleted successfully.' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting workout.', error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Workout app is running on Port ${PORT}! Yippee!`)
})