const express = require('express');
const app = express();
const DB = require('./database.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

//this part mainly copied, hopefully fine lol
  
  // GetAuth token for the provided credentials
  apiRouter.post('/auth/login', async (req, res) => {
    console.log('in login');
    const user = await DB.getUser(req.body.email);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        setAuthCookie(res, user.token);
        res.send({ id: user._id });
        return;
      }
    }
    res.status(401).send({ msg: 'Unauthorized' });
  });

  apiRouter.post('/auth/create', async (req, res) => {
    console.log('in create');
    if (await DB.getUser(req.body.email)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      console.log('Received email:', req.body.email);
      console.log('Received password:', req.body.password);
      const user = await DB.createUser(req.body.email, req.body.password);
  
      setAuthCookie(res, user.token);
  
      res.send({
        id: user._id,
      });
    }
  });
  // DeleteAuth token if stored in cookie
  apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
  });
  
  // GetUser returns information about a user
  apiRouter.get('/user/:email', async (req, res) => {
    const user = await DB.getUser(req.params.email);
    if (user) {
      const token = req?.cookies.token;
      res.send({ email: user.email, authenticated: token === user.token });
      return;
    }
    res.status(404).send({ msg: 'Unknown' });
  });
  

  // secureApiRouter verifies credentials for endpoints
  var secureApiRouter = express.Router();
  apiRouter.use(secureApiRouter); //does this also use api?
  
  secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  });

  /*secureApiRouter.get('/songs', async (req, res) => {
    const songs = await DB.getSongs(req.query.songs);
    res.send(songs);
  });*/
  secureApiRouter.get('/playlist', async (req, res) => {
    const play = await DB.getPlaylists();
    res.send(play);
  });


  //submit song for votes
  secureApiRouter.post('/songs', async(_req, res) => {
    const {playlist, song} = _req.body; 
    await DB.addSongToPlaylist(playlist, song);
    //const songs = await DB.getSongs();
    res.send(song);
  });

  //add playlist to list
  secureApiRouter.post('/playlist', async(req, res) => 
  {
    try {
      const { playlist, email } = req.body;
      if (!email || !playlist) {
        throw new Error('Email or playlist data missing in request');
      }
      const newPlaylist = await DB.addPlaylist(req.body.playlist, req.body.email);
      res.json(newPlaylist);
    } catch (error) {
      console.error('Error adding playlist:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  


function setAuthCookie(res, authToken) 
{
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
}
//Next the parts for the actual services, probably used for getting votes first
//move this function to database.js
let votes = []
function countVotes(votes) 
{
    var yesVotes = 0;
    var noVotes = 0;
    for (const vote of votes)
    {
        if (vote === "No") {
          noVotes = noVotes + 1;
        }
        else
        {
          yesVotes = yesVotes + 1;
        }
    }
    return { yesVotes, noVotes };

}

secureApiRouter.get('/votes', (_req, res) => {
    const voteValues = votes.map(vote => vote.vote);
    const { yesVotes, noVotes } = countVotes(voteValues);
    res.json({ yesVotes, noVotes });
});

secureApiRouter.post('/votes', (req, res) => {
  votes = []; //for now, change for web socket
  const { vote } = req.body;

  if (!vote || (vote !== "Yes" && vote !== "No" && vote !== "Don't care")) {
    return res.status(400).json({ error: 'Invalid vote data' });
  }

  const newVote = { vote, ip: req.ip };

  votes.push(newVote);
  res.json(votes);
});

//info for search function, honestly if too complicated might skip this 
/*app.get('/api/search', async (req, res) => {
    const { query } = req.query; // Get search query from URL query parameter
    if (!query) {
      return res.status(400).json({ error: 'Missing search query' });
    }
  
    try {
      const results = await search(query); // Search for songs using Spotify API
      res.json(results); // Return search results as JSON
    } catch (error) {
      console.error('Error searching for songs:', error);
      res.status(500).json({ error: 'Failed to search for songs' });
    }
});*/

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

peerProxy(httpService);