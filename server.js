/*
*  @package: anyslide
*  @version: 1.0.0
*/

/* Initialising The Server */


var express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
app.use(express.static('./dist/anyslide'));
//var redis = require('redis');
app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname, '/dist/anyslide/index.html'));
});
server.listen(process.env.PORT || 8890, function () {
  console.log('listening on', server.address().port);
});

/* Setting up server variables */
var presentations = []; //stores all presentations.
var presentation_devices = []; // stores all devices connected to a presentation.p

var collaborations = []; // stores all collaboration objects
var collaborators = []; // stores all members invited to a collaboration

var users = []; // keeps track of all registered users.

function Device(server_id) {
  this.device_id = server_id;
}

function Presentation(presentation_id, owner_id) {
  this.presentation_id = presentation_id;
  this.owner_id = owner_id
}

function Collaborator(collaboration_id, user_id) {
  this.collaboration_id = collaboration_id;
  this.user_id = user_id;  // user object
}

function Collaboration(collaboration_id, owner_id) {
  this.collaboration_id = collaboration_id;
  this.collaborators = [];
  this.messages = [];
  this.owner_id = owner_id;
}

function User(user_id, device) {
  this.user_id = user_id;
  this.devices = device;
}

function Message(collaboration_id, user_id, message) {
  this.user_id = user_id;
  this.collaboration_id = collaboration_id;
  this.message = message;
}

function join_presentation(device, presentation_id) {
  /*presentations.forEach(function (presentation) {
    if(presentation.id)
  });*/

  for (var i = 0; i < presentations.length; i++) {
    if (presentations[i].presentation_id == presentation_id) {
      presentations[i].devices.push(device);
    }
  }
}

// Stores the credentials for our administrator

/* Setting up server functions */

//

function find_user(id) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].user_id == id) {
      return i;
    }
  }
  return false;
}

// Searches for a given user from his/her server id
function findDeviceUser(device_id) {
  for (let i = 1; i < users.length; i++) {
    for (let j = 0; j < users[i].devices.length; j++) {
      if (users[i].devices[j].device_id === device_id) {
        return users[i];
      }
    }
  }
  return false;
}

function presentation_exist(presentation_id) {
  for (var i = 0; i < presentations.length; i++) {
    if (presentations[i].presentation_id == presentation_id) {
      return true;
    }
  }
  return false;
}

function is_device_allowed(device_id, type_id, type) {
  var user = findDeviceUser(device_id);
  switch (type) {
    case "present":
      for (var i = 0; i < presentations.length; i++) {
        if (presentations[i].owner_id == user.user_id) {
          return true;
        }
      }
      break;
    case "collaborate":
      break;
  }
  return false;
}

// Logs Data to the admin panel and to the console
function logData(message) {
  let d = new Date();
  let time = '[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '] ';
  console.log(time + message);
  let logs = {
    log: time + message
  };
  io.emit('admin', logs);
}


/* Events to listen to and emit */
io.on('connection', function (socket) {
  logData("New Client Connected: " + socket.id);

  /** usee fill data
   * socket.join("chat" + chat_room.id);
   * result.push(chat_room_details);
   * io.to(socket.id).emit('update_me', result);
   *socket.broadcast.to("chat" + chat_rooms[room].id).emit('newMessage', message);
   * */

  /* User Related Functions */
  // Emitted when a user logs in
  socket.on('register_user', function (user_id) {
    if (find_user(user_id)) {
      let user_index = find_user(id);
      let device = new Device(socket.id);
      users[user_index].devices.push(device);

      logData("New device: " + socket.id + " assigned to " + user_id);
    } else {
      let device = [];
      device.push(new Device(socket.id));

      let user = new User(socket.id, user_id, device);
      users.push(user);

      logData(user_id + " has been registered ");

      logData("New device: " + socket.id + " assigned to " + user_id);
    }
  });

  socket.on('create_presentation', function (presentation_id, owner_id) {
    if (presentation_exist(presentation_id)) {
      socket.join("presentation" + presentation_id);
      let result = {status: true};
      io.to(socket.id).emit('joinPresentation', result);
      logData("Device: " + socket.id + " joined presentation" + presentation_id);

    }
    else if (find_user(owner_id)) {
      let presentation = new Presentation(presentation_id, owner_id);
      let result = {status: true};
      socket.join("presentation" + presentation_id);
      io.to(socket.id).emit('joinPresentation', result);
      logData("user " + owner_id + " created presentation " + presentation_id);
    }
  });

  socket.on('join_presentation', function (presentation_id) {
    if (presentation_exist(presentation_id)) {
      let result = {status: true};
      socket.join("presentation" + presentation_id);
      io.to(socket.id).emit('joinPresentation', result);
      logData("Device: " + socket.id + " joined presentation" + presentation_id);

    } else {
      let result = {status: false};
      io.to(socket.id).emit('joinPresentation', result);
    }
  });

  socket.on('update_presentation', function (presentation_id, next) {
    if (is_device_allowed(socket.id, presentation_id, "present")) {
      socket.broadcast.to("presentation" + presentation_id).emit('update_slide', next);
    }
  });

  socket.on('disconnect', function () {
    // do somehting
    logData("Client Disconnected: " + socket.id);
  });

});
