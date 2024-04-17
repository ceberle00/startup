//might just do everything in here lol
//next issue, need to pass in playlist info to be able to look at songs
//SERVICE PART?
//MAINPAGE AND ADDPLAY HTML FILES
var playlists = new Map();
async function loginUser() {
  loginOrCreate(`/api/auth/login`);
}

async function createUser() {
  loginOrCreate(`/api/auth/create`);
}
async function loginOrCreate(endpoint) {
  const userName = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const response = await fetch(endpoint, {
    method: 'post',
    body: JSON.stringify({ email: userName, password: password }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  //issue with creating new account specifically
  if (response.ok) {
    localStorage.setItem('userName', userName);
    window.location.href = 'mainpage.html';
  } else {
    const body = await response.json();
    const modalEl = document.querySelector('#msgModal');
    modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
    const msgModal = new bootstrap.Modal(modalEl, {});
    msgModal.show();
  }
}
async function getUser(email) {
  let scores = [];
  // See if we have a user with the given email.
  const response = await fetch(`/api/user/${email}`);
  if (response.status === 200) {
    return response.json();
  }

  return null;
}
//not sure if using logout
function logout() {
  localStorage.removeItem('userName');
  fetch(`/api/auth/logout`, {
    method: 'delete',
  }).then(() => (window.location.href = '/'));
}

async function addToList() 
{
  //console.log("in add to list");
  //const email = localStorage.getItem('userName');
  const response = await fetch(`/api/playlist`, {
      method: 'get',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8'
      }
  });
  console.log(response);
  //console.log('Response status:', response.status);
  //console.log('Response status text:', response.statusText);
  //console.log(response);
  if (response.ok) {
    const play = await response.json();
    var myList = document.getElementById('playlistNames');

    //can I do this on this? idk
    play.forEach(playlist => {
      var listItem = document.createElement('li');
      console.log(playlist.title);
      listItem.textContent = playlist.title;
      myList.appendChild(listItem);
    });
  }
  else {
  }
  
}
async function createPlaylist(value) 
{
  console.log("Creating playlist:", value);
  const email = localStorage.getItem('userName');
  try {
    const response = await fetch(`/api/playlist?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

    const playlist = await response.json();
    console.log("Existing playlists:", playlist);

    const playlistExists = playlist.some(item => item.title === value);
    if (!playlistExists) {
      console.log("Playlist does not exist, creating...");
      console.log(email);
      console.log(value);
      const addResponse = await fetch(`/api/playlist`, {
        method: 'POST',
        body: JSON.stringify({ email: email, playlist: value }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      console.log("after??");
      console.log('addResponse:', addResponse);
      if (!addResponse.ok) {
        throw new Error(`Failed to add playlist (${addResponse.status} ${addResponse.statusText})`);
      }
      const contentType = addResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log(":(");
        throw new Error('Unexpected response content type');
      }
      console.log(contentType);
      const responseBody = await addResponse.text();
      console.log(":)");
      //const responseData = await addResponse.json();
      console.log(responseBody);
      console.log(":(");
      
    } else {
      console.log("Playlist already exists.");
    }
  } catch (error) {
    console.error('Error creating playlist:', error);
  }
}
async function getTitle() {
    const value = document.getElementById('playlistTitle').value;
    console.log(value);
    
    try {
      await createPlaylist(value); // Wait for createPlaylist to complete
      // Other synchronous code that depends on createPlaylist results
      // Redirect or perform additional actions here
      window.location.href = "mainpage.html";
    } catch (error) {
      console.error('Error in getTitle:', error);
      // Handle or log errors as needed
    }
}
// PLAYLIST.HTML: Need to make the list and header change depending on what is clicked
async function getQueryParam(param) 
{
  const playlist = await fetch(`/api/playlist`, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
});
  const urlParams = new URLSearchParams(window.location.search);
  var newHead = urlParams.get(param);
  console.log(playlist);
  if (newHead) {
    document.getElementById('header').textContent = newHead;
  }
  playlists = await playlist.json();
  console.log(playlists);
  const play = playlists.find(p => p.title === newHead);
  if (play) {
    const myList = document.getElementById('songNames');

    // Loop through each song in the playlist and create list items
    play.songs.forEach(song => {
      const listItem = document.createElement('li');
      const titleNode = document.createTextNode(song);
      listItem.appendChild(titleNode);
      myList.appendChild(listItem);
    }); 
    //probably right 
  }
}

//ADDSONG.HTML
/*
need to make it so search feature works that should be done using services, at least takes text and moves
to the next page

then we need the playlist options to be from the playlists already made

then move to voting should pass in the info from the search service

*/

async function fillPlaylists() 
{
  const response = await fetch(`/api/playlist`, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    }
  });
  if (response.ok) {
    const play = await response.json();
    var myList = document.getElementById('select');

    //can I do this on this? idk
    play.forEach(playlist => {
      var listItem = document.createElement('option');
      console.log(playlist.title);
      listItem.textContent = playlist.title;
      myList.appendChild(listItem.cloneNode(true));
    });
  }
  /*var myPlaylistOptions = document.getElementById('select');
  var playlistTitles = JSON.parse(localStorage.getItem("PlaylistTitles")) || [];
  //for each create a new option?
  playlistTitles.forEach(function(title) 
  {
    var optionItem = document.createElement('option');
    var titleNode = document.createTextNode(title);
    optionItem.appendChild(titleNode);
    myPlaylistOptions.appendChild(optionItem.cloneNode(true));
  });*/
}

//hopefully works 
function getSongSearch() 
{
  var getSong = document.getElementById('search').value;
  var playListName = document.getElementById('select').value; //hopefully right
  localStorage.setItem("PotentialSong", JSON.stringify(getSong));
  localStorage.setItem("playlistAdded", playListName);
  window.location.href = "voting.html";
}

//VOTING.HTML

function fillVoting() 
{
  document.getElementById("question").innerHTML = "Should the song " + localStorage.getItem("PotentialSong") + " be added to the playlist " + localStorage.getItem("playlistAdded") + "?";
}

async function addVotes() 
{
  try {
    var votingResults = document.querySelector('input[name="varRadio"]:checked').value;
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ vote: votingResults })
    });
    const newResponse = await fetch('/api/votes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const { yesVotes, noVotes } = await newResponse.json(); 

    //localStorage.setItem('yesVotes', JSON.stringify(yesVotes));
    //localStorage.setItem('noVotes', JSON.stringify(noVotes));
    getVotes(yesVotes, noVotes); // Update voting results display after submitting vote
  }
  catch (error) {
    console.error('Error submitting vote:', error);
  }
}
async function getVotes(yesVotes, noVotes) 
{
  
  const playName = localStorage.getItem("playlistAdded");
  const song = localStorage.getItem("PotentialSong");
  if (yesVotes > noVotes) 
  {
    const shouldAdd = "Yes";
    console.log("before addSong?");
    //const play = playlist.find(p => p.title === playName); //this is getting the playlist :), maybe don't need?
    const addSong = await fetch('/api/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ playlist : playName, song : song })
    });
    const message = JSON.stringify({ type: 'vote', song, shouldAdd });
    //console.log("before send message");
    sendMessageToWebSocketServer(message);
  }
  else 
  {
    const shouldAdd = "No";
    const message = JSON.stringify({ type: 'vote', song, shouldAdd });
    sendMessageToWebSocketServer(message);
  }
  //window.location.href = "mainpage.html";
}
let socket;

function sendMessageToWebSocketServer(message) {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const socketUrl = `${protocol}://${window.location.host}/ws`;
   // WebSocket server address
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(socketUrl);
    console.log(message);
    socket.onopen = function () {
      socket.send(message);
    };

    socket.onmessage = function (event) {
      console.log("in onmessage");
      const data = JSON.parse(event.data);
      if (data.type === 'voteUpdate') {
        console.log(data);
        console.log(data.yesVotes);
        updateVoteDisplay(data.yesVotes, data.noVotes);
      }
    };
    socket.onerror = function (error) {
      console.error('WebSocket error:', error);
    };
  }
}
/*function sendMessageToWebSocketServer(message) {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  //const socket = new WebSocket('ws://localhost:3000'); // Replace 'your-server-url' with your WebSocket server URL
  console.log("after creating websocket");
  socket.onopen = () => {
    const receivedMessage = JSON.parse(message);
    const { song, shouldAdd } = receivedMessage;
    console.log('Received vote message - Song:', song, 'Should Add:', shouldAdd);
    socket.send(message); // Send message to WebSocket server
    //onst {song, vote} = JSON.parse(message);
    updateVoteDisplay(song, shouldAdd);
  };
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Handle error if needed
  };
}*/
function updateVoteDisplay(yesVotes, noVotes) {
  const voteList = document.getElementById('voteList');
  voteList.innerHTML = `Yes Votes: ${yesVotes}, No Votes: ${noVotes}`;
}
//FRIEND REQUESTS

function loadFriends() {
  var friends = JSON.parse(localStorage.getItem("friendList")) || [];

  friends.forEach(function (friendName) {
    var listItem = document.createElement('li');
    var titleNode = document.createTextNode(friendName);
    listItem.appendChild(titleNode);
    document.getElementById("friends").appendChild(listItem);
  });
}
function friend() 
{
  var getUser = document.getElementById('Username').value;

  var listItem = document.createElement('li');
  var titleNode = document.createTextNode(getUser);
  listItem.appendChild(titleNode);

  document.getElementById('friends').appendChild(listItem);
  document.getElementById('Username').value = '';

  var friends = JSON.parse(localStorage.getItem("friendList")) || [];
  if (!Array.isArray(friends)) {
    friends = [];
  }
  friends.push(getUser); // Add the new friend to the list
  localStorage.setItem("friendList", JSON.stringify(friends));

}
