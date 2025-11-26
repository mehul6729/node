// user collection

const userCollection = {
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true },
  password: String, // store hashed password, never plain
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number], // [longitude, latitude]
  },
  coverPhoto: String, // URL to uploaded image
  teams: [
    // A user can create multiple teams
    {
      type: ObjectId,
      ref: "Team",
    },
  ],
  createdAt: { type: Date, default: Date.now },
};

const teamCollection = {
  _id: ObjectId,
  teamId: { type: String, unique: true }, // or auto-generate
  teamName: String,
  sportType: { type: String, enum: ["football", "cricket"] },
  numberOfPlayers: Number,
  players: [
    {
      name: String,
      position: String, // eg. Goalkeeper, Batsman, etc.
    },
  ],
  teamRating: { type: Number, default: 0 },
  preferredPlayTime: {
    start: String, // e.g. "06:00"
    end: String, // e.g. "09:00"
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number], // [longitude, latitude] — same as user location
  },
  createdBy: {
    type: ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
};
