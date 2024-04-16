const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const cookieParser = require('cookie-parser');

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

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

//this part mainly copied, hopefully fine lol
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.email)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await DB.createUser(req.body.email, req.body.password);
  
      setAuthCookie(res, user.token);
  
      res.send({
        id: user._id,
      });
    }
  });
  
  // GetAuth token for the provided credentials
  apiRouter.post('/auth/login', async (req, res) => {
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
  apiRouter.use(secureApiRouter);
  
  secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
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
        if (vote === 'No') {
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
    const { yesVotes, noVotes } = countVotes(votes);
    res.json({ yesVotes, noVotes });
});

secureApiRouter.post('/votes', (req, res) => {
    var vote =  { ...req.body, ip: req.ip };
    if (vote) {
        votes.push(vote);
        res.json({ message: 'Vote submitted successfully' });
    } else {
        res.status(400).json({ error: 'Invalid vote data' });
    }
});

//info for search function, honestly if too complicated might skip this 
app.get('/api/search', async (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});