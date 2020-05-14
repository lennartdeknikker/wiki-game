# Wikipedia European Countries Game
The main goal of this game is to get to a given destination as fast as possible. All players in the same room get the same destination and the same starting page. They will then have to click on page links and find a way to that destination. The player that gets there the fastest wins. The game will then end for all players, but they can restart to keep playing.

## Contents
- [Wikipedia European Countries Game](#wikipedia-european-countries-game)
  - [Contents](#contents)
  - [Concept](#concept)
  - [Installation](#installation)
  - [Database](#database)
  - [Features](#features)
    - [Current features](#current-features)
    - [Future features](#future-features)
  - [Data Lifecycle](#data-lifecycle)
  - [API](#api)
  - [Sockets & Events](#sockets--events)
    - [Users and rooms](#users-and-rooms)
      - [Room objects](#room-objects)
      - [User objects](#user-objects)
    - [Client to server events](#client-to-server-events)
      - [Connect](#connect)
      - [join](#join)
      - [ready](#ready)
      - [start game](#start-game)
      - [wiki link clicked](#wiki-link-clicked)
      - [disconnect](#disconnect)
    - [Server to client events](#server-to-client-events)
      - [change in users](#change-in-users)
      - [game started](#game-started)
      - [another user clicked a link](#another-user-clicked-a-link)
      - [game end](#game-end)

## Concept
This game was inspired by the fact that it's impossible to travel right now due to the current Corona pandemic. By playing this game you can travel to different European countries by clicking page links. You will start at a random page and every time you find a way to get to your destination, the route and amount of clicks to get there will be saved in the database, so it's possible to map those and create a visualisation showing digital travel routes. At this stage, the results are just shown as raw data in a table.

## Installation

To work on this project,
1. First clone this repository with git clone `https://github.com/lennartdeknikker/wiki-game.git`.
2. Install the necessary dependencies with `npm install`
3. Use `npm run dev` to start nodemon and view changes in the browser.

By default the application can be previewed at [localhost:3000](http://localhost:3000/). To change that port value, just add a `PORT` variable to your `.env` file.

## Database
This application saves the results to a mongo database. It can be used without saving results, but it's possible to connect your own database.
1. Create a `.env` file in the root folder.
2. Add a variable called `MONGO_URL` as shown below:
```
MONGO_URL=mongodb+srv://<username>:<password>@<database>.mongodb.net/database?retryWrites=true&w=majority        
```

##  Features
### Current features
- [x] Multiple rooms
- [x] Single player mode
- [x] Dropdown showing which rooms are in play and the amount of players in there
- [x] a waiting room to wait for all players to get ready
- [x] wikipedia page embed
- [x] random European Country selection for destinations
- [x] Tracking the amount of clicks for all players
- [x] Showing player's paths in breadcrumbs, so they can go back.
- [x] Saving the average amount of clicks for each country to a database.
- [x] A leaderboard showing the average amount of clicks it takes to get to each country.

### Future features
- [ ] A timer so more players can finish before the game ends
- [ ] A more graphic visualisation of the results
- [ ] Keeping track of scores when multiple games are played by the same contestants.
- [ ] 'Hard mode' providing a random page for the destination as well.
- [ ] Keeping track of how many clicks it takes people to get to destinations and based on that save and move pages to a category of difficulty.


## Data Lifecycle
![life cycle diagram](wiki-assets/data-lifecycle.png)

## API
This application uses the [wikipedia API](https://www.mediawiki.org/wiki/API:Main_page). This API provides the server with a random page link for a wikipedia page. First off, the destination page would also be random, but later on I found out in most cases it's too hard to get to the more specific kinds of wikipedia pages.

Another change I made was to only provide the players with links for the destination and starting point and fetch the actual page content client side. This seemed a good idea since the Wikipedia API would not allow me to do a lot of requests per second. Although their documentation says it allows for up to 200 requests per second I would get errors when doing multiple requests right after each other.

## Sockets & Events
This application uses [Socket.io](https://socket.io/) to handle all the different events and synchronize user actions and server events. This way player actions can effect the game for all players directly. Below all custom events that handle the logic for this game (also shown in the [Data Lifecycle Diagram](#data-lifecycle)) are explained.

### Users and rooms
#### Room objects
For each room, an object is created with the properties shown below. This room object will be pushed to the `AvailableRooms` array, saved on the server in `states.js`. The available rooms can then be requested in all other .js files.

```js
{
  roomName: roomName,
  userTotal: 0,
  users: [],
  startLink: '',
  destination: {
      name: '',
      link: ''
  },
  status: 'waiting for players',
  winner: {}
}
```

#### User objects
Whenever a user joins, a new object is created for this user with the properties you see below. This user object is then pushed to the users array for that room.

```js
{
  username: username,
  id: id,
  finished: false,
  clicks: 0,
  admin: isAdmin,
  ready: false
}
```

### Client to server events
#### Connect
First new users need to establish a connection. This is handled automatically by socket.io when their script is called by the client.

After a user is connected, the server will listen to events fired by all connected clients.
#### join
When a join event is fired by a client, which happens whenever a user joins or creates a room, the server checks if the room the client is asking for already exists. If it does, the server will link the client to that room so all events targeted on that room will reach that user. If it doesn't a new room will be created before all that and the user will be saved as the admin for that room.

For each new user, a user object will be created as shown above, which will then be added to that room.

#### ready
Whenever a user clicks on the ready button, the `ready` property for that user is changed to `true` or `false`

#### start game
When the `start game` event is fired, the server checks again if all users are ready, obtains a random starting point from the Wikipedia API and a destination from `destinations.json`. These are saved in the room state object and a `game started` event is fired to all clients connected to that room.

This event can only be triggered by the admin user.

#### wiki link clicked
Every time a user clicks a link, this event is triggered. The server checks if the clicked link is equal to the destination link. If that is the case, the `game end` event is fired and the game ends for all clients and the winner is shown.

Next to firing the `game end` event, the average amount of clicks it takes for users to get to that destination and the amount of times the game has been played for that specific destination is obtained from the database. The new average amount is calculated and then updated in the database.

If the clicked link is not equal to the destination, the clicks variable for that user increments and a `a user clicked` event is fired to update the progress for all players on the clients.

#### disconnect
Whenever a user disconnects, the server checks if there's any users left and if that user was the admin. If the latter is the case, a new player is assigned the admin role. If there's noone left, the room is deleted.


### Server to client events
#### change in users
#### game started
#### another user clicked a link
#### game end