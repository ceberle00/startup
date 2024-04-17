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
const scoreCollection = db.collection('songs'); //not sure how collection works, maybe not right?
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

//change these, this will all get used based on the user
/*async function addSong(song, username, playListName) 
{
  const user = await userCollection.findOne({ email: username });
  const playlistIndex = user.playlists.findIndex(playlist => playlist.title === playListName);

  if (playlistIndex === -1) {
      console.log(`Playlist not found with name: ${playListName}`);
      return; // Exit function if playlist not found
  }

  // Make a copy of the user's playlists array to modify
  const updatedPlaylists = [...user.playlists];

  // Add the song to the specified playlist
  updatedPlaylists[playlistIndex].songs.push(song);

  // Update the user document in the collection with the updated playlists
  await userCollection.updateOne(
      { _id: user._id }, // Filter by user's _id
      { $set: { playlists: updatedPlaylists } } // Update playlists array
  );

}
function getSongs(username, playListName) {
  const user =  userCollection.findOne({email: username});
  const playlistIndex = user.playlists.findIndex(playlist => playlist.title === playListName);
  return user.playlists[playlistIndex].songs;
}
async function addPlay(playlist, userEmail) 
{
    //playCollection.insertOne(playlist);
  try{
    const userWanted = await userCollection.findOne({ email: userEmail });
    if (!userWanted) {
      console.log(`User ${userEmail} not found.`);
      return;
    }
    if (!Array.isArray(userWanted.playlists)) {
      console.log(`User ${userEmail} playlists not in expected format.`);
      return;
    }
    const playlists = userWanted.playlists || []; // Ensure playlists is an array
    playlists.push(playlist);
    const updatedPlaylists = [...playlists, { title: playlist, songs: [] }]

    updateResult = await userCollection.updateOne(
      { _id: userWanted._id },
      { $set: { playlists: updatedPlaylists } }
    );
    if (updateResult.modifiedCount !== 1) {
      console.log(`Failed to update playlists for user ${userEmail}.`);
      return ["teehee"]; // Return empty array if update operation fails
    }
    return updatedPlaylists;

  } catch (error) {
    console.error('Error adding playlist:', error);
    throw error; // Rethrow error to propagate it up if needed
  }
}*/
/*async function getPlaylists(userEmail) 
{
  try {
    const userRecord = await userCollection.findOne({ email: userEmail });
    if (!userRecord || !userRecord.playlists) {
      console.log(`User ${userEmail} not found or playlists not available.`);
      return []; // Return an empty array if playlists are not available
    }
    return userRecord.playlists;
  } catch (error) {
    console.error('Error retrieving playlists:', error);
    return [];
  }
}*/
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
module.exports = {
    getUser,
    getUserByToken,
    createUser,
    getPlaylists,
    addPlaylist,
  };