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
const playCollection = db.collection('play');

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
    token: uuid.v4(),
    playlists : [] //hopefully right lol
  };
  await userCollection.insertOne(user);

  return user;
}

//change these, this will all get used based on the user
async function addSong(song, username) 
{
  scoreCollection.insertOne(song);
}
function getSongs() {
  return scoreCollection;
}
async function addPlay(playlist, username) {
  const userWanted = userCollection.findOne({email : username});
  const updatedPlaylists = [...userWanted.playlists];
  updatedPlaylists.push({ title: playlist, songs: [] });
  await userCollection.updateOne(
    { _id: userWanted._id }, // Use the user's _id to identify the document
    { $set: { playlists: updatedPlaylists } } // Set the updated playlists array
);
  //playCollection.insertOne(song);
}
function getPlaylists() {
return playCollection;
}
module.exports = {
    getUser,
    getUserByToken,
    createUser,
    getSongs, 
    addSong,
    getPlaylists,
    addPlay,
  };