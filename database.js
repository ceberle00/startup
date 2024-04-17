//const url = "mongodb+srv://camilleeberle:%40Cam148003428@cs260project.7xvqb.mongodb.net/?retryWrites=true&w=majority&appName=CS260Project"

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

//if doesn't work, try link commented out above
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority&appName=CS260Project`;
const client = new MongoClient(url);
const db = client.db('project');
const userCollection = db.collection('user');
const playlistCollection = db.collection('playlist');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) 
{
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4()
  };
  await userCollection.insertOne(user);

  return user;
}
async function addPlaylist(playlistTitle, email) {
  const user = await getUser(email);

  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }
  

  const playlist = {
    title: playlistTitle,
    songs: [] // Initialize songs array for the playlist
  };
  
  // Insert the playlist into the playlist collection
  await playlistCollection.insertOne(playlist);

  // Update the user document to include the new playlist
  await userCollection.updateOne(
    { email: email },
    { $push: { playlists: playlistTitle } }
  );

  return playlist;
}
async function getPlaylists() {
  try {
    // Fetch all playlists from the playlist collection
    const playlistsCursor = await playlistCollection.find();
    
    // Convert the cursor to an array of playlists
    const playlists = await playlistsCursor.toArray();

    // Return the playlists as JSON
    return playlists;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw new Error('Failed to fetch playlists');
  }
}
async function addSongToPlaylist(playlistTitle, song) {
  const playlist = await playlistCollection.findOne({ title: playlistTitle });

  if (!playlist) {
    throw new Error(`Playlist ${playlistTitle} not found`);
  }

  // Update the playlist document to include the new song
  await playlistCollection.updateOne(
    { title: playlistTitle },
    { $push: { songs: song } }
  );
}
module.exports = {
    getUser,
    getUserByToken,
    createUser,
    getPlaylists,
    addPlaylist,
    addSongToPlaylist,
  };