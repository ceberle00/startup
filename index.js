const express = require('express');
const app = express();

import Spotify from '@silent-killer/killer-spotify-searching'

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

//Next the parts for the actual services, probably used for getting votes first

app.get('/api/votes', (_req, res) => {
    const { yesVotes, noVotes } = countVotes(votes);
    res.send({ yesVotes, noVotes }); 
});


let votes = []
function countVotes(votes) 
{
    var yesVotes = 0;
    var noVotes = 0;
    for (const vote of votes)
    {
        if (vote === 'No') {
            noVotes++;
        }
        else 
        {
            yesVotes++;
        }
    }
    return { yesVotes, noVotes };

}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//info for search function, honestly if too complicated might skip this 
app.get('/api/song-suggestions', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        // Fetch song suggestions from silent-killer/killer-spotify-searching API
        const apiUrl = `https://silent-killer.herokuapp.com/spotify?q=${query}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Return the list of song suggestions
        res.json(data);
    } catch (error) {
        console.error('Error fetching song suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch song suggestions' });
    }
});