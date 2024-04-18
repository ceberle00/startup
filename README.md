# Description deliverable

## Elevator Pitch

Have you ever been about to go on a roadtrip with your friends, and you just finished making the perfect playlist for the trip when one of your friends adds the entire Hamilton soundtrack to it? Or a really niche mongolian throat singing song that doesn't fit the vibes at all? This application (name pending) allows for a group of people to vote on which songs are added to a playlist. One person will propose a song, and the group will vote on if it should be added or not. If it gets 50% or more of the votes, it'll be added to a playlist, preventing just one person from ruining the playlist with their weird taste.

## Design

![image](pagesIdea.jpeg)

![image](playlistFrame.jpeg)

## Key features

- Secure login over HTTPS
- Ability to make friends and communicate with them 
- Can make and store playlists (lists of songs)
- Ability for friends to propose an addition to a playlist
- Ability for people to vote on an addition for a song
- People can see proposed songs, voting results, and changes to playlists in real time

## Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Three HTML pages. One for login, one for voting, one for looking at and generating playlist. Hyperlinks to choice artifact.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast. - **Mostly done, will update later to add stuff that needs javascript to work**
- **JavaScript** - Provides login, allows users to propose new songs, applying votes, display other users votes, see users playlists, backend endpoint calls.
- **Service** - Backend service with endpoints for:
  - login
  - submitting votes
  - retrieving vote status
  - friend requests
- **DB/Login** - Store users, votes, and playlists in database. Register and login users. Credentials securely stored in database. Can't vote unless authenticated and a friend of the user.
- **WebSocket** - See the results of votes in real time and being able to see the playlist change in real time, also obtains info for all songs available on Spotify
- **React** - Application ported to use the React web framework.

## HTML Deliverable:

For this deliverable I built out the structure of my application using HTML.

- HTML pages - Seven HTML page, including the login page, the home, the page for creating a playlist, voting on songs, the song voting results, and a page for adding friends
- Links - The login page automatically links to the main page. The main page links to the page that has your already created playlists, where to add friends, and how to create new playlists. On these pages there are links to suggesting a new song and a link to the page for voting on the song
- Text - There's a value description of the app on the home page, and voting has a text saying what song they're voting to add to what playlist
- Images - I mainly just included the spotify logo, but I might get rid of that because idk copyright law
- DB/Login - Input box and submit button for login. The voting choices are data submitted by the users
- WebSocket - The count of voting results represent the tally of realtime votes, and maybe they will take song info from a list of available songs on spotify

## CSS Deliverable:

For this deliverable I properly styled the application into its final appearance.

- Header, footer, and main content body
- Made the background color consisent and hopefully it doesn't clash
- Navigation elements - I tried to make all the buttons similar colors and shapes, although it's still a bit obvious it's a link
- Responsive to window resizing - sort of? Some of the parts work as they're supposed to but others will take more time to get right
- Application elements - Used good contrast and whitespace, tried to put the buttons all in the same place and make the buttons stand out
- Application text content - Consistent font
- Application images - Made them surround the title

## Javascript Deliverable:

For this deliverable I added the code to make the functions work.

- Made the lists changeable, so that we can add to them and it updates the html pages as well 
- The information taken in one html page now moves to another one, so once we update a playlist it appears that way later
- Local storage stores the username, password, voting results, friends, playlists, and songs, which can be accessed at any time
- Made it so it takes in the votes (although for now it's just one) and uses it to determine whether a song should be added to a playlist
- Made the playlists in the form of a map, with a string pointing to a list of strings

## Service Deliverable
- Got service working for getting and sorting votes
- Can display votes for each category, although that will wait until the service works with multiple people
## Login Deliverable
- made it so you can login if the account exists or create a new account if it doesn't
- logging out doesn't reset your data, still have the same playlists
- error will appear if you try to login without creating an account or create an account with the same user/password as already exists
- tried to make it so playlists are user specific? It seemed to work sometimes but otherwise not

## Websocket Deliverable
- wasn't able to influence the search bar to suggest things
- Got it so you can see votes in real time and those votes will change the playlists for everyone
- there's a bit of a weird situation where 