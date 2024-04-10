const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
//Next the parts for the actual services, probably used for getting votes first

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

apiRouter.get('/votes', (_req, res) => {
    const { yesVotes, noVotes } = countVotes(votes);
    res.json({ yesVotes, noVotes });
});

apiRouter.post('/votes', (req, res) => {
    var { vote } = req.body;
    if (vote) {
        votes.push(vote);
        res.json({ message: 'Vote submitted successfully' });
    } else {
        res.status(400).json({ error: 'Invalid vote data' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//info for search function, honestly if too complicated might skip this 
/*app.get('/api/song-suggestions', async (req, res) => {
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
});*/