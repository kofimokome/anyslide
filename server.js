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
var Cryptr = require('cryptr');
app.use(express.static('./dist/anyslide'));
//var redis = require('redis');
app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname, '/dist/anyslide/index.html'));
});
server.listen(process.env.PORT || 8890, function () {
  console.log('listening on', server.address().port);
});

/* Setting up server variables */
const cryptr = new Cryptr('anyslide');
var presentations = []; //stores all presentations.
var presentation_devices = []; // stores all devices connected to a presentation.p

var collaborations = []; // stores all collaboration objects
var collaborators = []; // stores all members invited to a collaboration

var users = []; // keeps track of all registered users.
presentation_id = 1;

function Device(server_id) {
  this.device_id = server_id;
}

function Presentation(presentation_id, owner_id, device_id, password) {
  this.presentation_id = presentation_id;
  this.owner_id = owner_id;
  this.device_id = device_id;
  this.password = password;
}

function Collaborator(collaboration_id, user_id) {
  this.collaboration_id = collaboration_id;
  this.user_id = user_id;  // user object
  this.slide_id = 0;
}

function Collaboration(collaboration_id, owner_id) {
  this.collaboration_id = collaboration_id;
  this.collaborators = [];
  this.messages = [];
  this.owner_id = owner_id;
}

function User(user_id, device, username) {
  this.user_id = user_id;
  this.devices = device;
  this.username = username
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

users.push(new User(0, 'bug')); //todo: address why the first index is not accessed by find_user();
presentations.push(new Presentation(0, 0, 0, 0, null));
collaborations.push(new Collaboration(0, 0));
collaborators.push(new Collaborator(0, 0));

/* @return: integer */
function find_user(id) {
  let found = false;
  let index = 0;
  for (let i = 1; i < users.length; i++) {
    if (users[i].user_id == id) {
      index = i;
      found = true;
    }
  }
  return found ? index : found;
}

/* Searches for a given user from his/her server id
* @return: user_index
*/
function findDeviceUser(device_id) {
  let found = false;
  let index = 0;
  for (let i = 1; i < users.length; i++) {
    for (let j = 0; j < users[i].devices.length; j++) {
      if (users[i].devices[j].device_id == device_id) {
        index = i;
        found = true;
      }
    }
  }
  return found ? index : found;
}

function presentation_exist(presentation_id) {
  for (var i = 1; i < presentations.length; i++) {
    if (presentations[i].presentation_id == presentation_id) {
      return i;
    }
  }
  return false;
}

function is_device_allowed(device_id, type_id, type) {
  var user = findDeviceUser(device_id);
  switch (type) {
    case "present":
      for (var i = 0; i < presentations.length; i++) {
        if (presentations[i].owner_id == users[user].user_id) {
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

var connected = 0;
/* Events to listen to and emit */
io.on('connection', function (socket) {
  logData("New Client Connected: " + socket.id);

  /** usee fill data
   * socket.join("chat" + chat_room.id);
   * result.push(chat_room_details);
   * io.to(socket.id).emit('update_me', result);
   *socket.broadcast.to("chat" + chat_rooms[room].id).emit('newMessage', message);
   * */

  function get_presentations() {
    let presentation_ids = [];
    for (var i = 1; i < presentations.length; i++) {
      if (presentations[i].owner_id == users[findDeviceUser(socket.id)].user_id) {
        let presentation = {
          link: presentations[i].presentation_id,
          id: cryptr.decrypt(presentations[i].presentation_id)
        };
        presentation_ids.push(presentation);
      }
    }

    //console.log(presentation_ids);
    return presentation_ids;
  }

  /* User Related Functions */
  // Emitted when a user logs in
  socket.on('register_user', function (user_id, username) {
    if (find_user(user_id)) {
      let user_index = find_user(user_id);
      let device = new Device(socket.id);
      users[user_index].devices.push(device);

      logData("Another new device: " + socket.id + " assigned to " + username);
    } else {
      let device = [];
      device.push(new Device(socket.id));

      let user = new User(user_id, device, username);
      users.push(user);

      //logData(user_id + " has been registered ");

      logData("A new device: " + socket.id + " assigned to " + username);
      //console.log(users);
    }
  });

  socket.on('create_presentation', function (presentation_id, password) {
    if (findDeviceUser(socket.id)) {
      const cryptr_presentation_id = cryptr.encrypt(presentation_id);
      if (presentation_exist(presentation_id)) {
        let result = {status: false, message: "presentation already exists"};
        io.to(socket.id).emit('joinPresentation', result);
      } else {
        let user_index = findDeviceUser(socket.id);
        let presentation = new Presentation(cryptr_presentation_id, users[user_index].user_id, socket.id, password);
        presentations.push(presentation);
        //console.log(presentation);
        let result = {status: true, id: cryptr_presentation_id};
        // socket.join("presentation" + cryptr_presentation_id);
        socket.emit('joinPresentation', result);
        logData(users[user_index].username + " created presentation " + cryptr_presentation_id);

        let presentation_ids = get_presentations();
        for (let j = 0; j < users[user_index].devices.length; j++) {
          io.to(users[user_index].devices[j].device_id).emit('presentations', presentation_ids);
        }
      }

    } else {
      let result = {status: false, message: "user not yet registered. Please refresh this page and try again"};
      io.to(socket.id).emit('joinPresentation', result);
    }
  });

  socket.on('join_presentation', function (presentation_id, password) {
    if (presentation_exist(presentation_id)) {
      let presentation_index = presentation_exist(presentation_id);
      if (password == presentations[presentation_index].password) {
        let result = {status: true, id: cryptr.decrypt(presentation_id)};
        socket.join("presentation" + presentation_id);
        io.to(socket.id).emit('joinPresentation', result);
        if (findDeviceUser(socket.id)) {
          logData("Device: " + users[findDeviceUser(socket.id)].username + " joined presentation " + presentation_id);
        } else {
          logData("Device: " + socket.id + " joined presentation" + presentation_id);
        }
      } else {
        console.log(presentations[presentation_index]);
        let result = {status: false, message: "Presentation password is not correct"};
        io.to(socket.id).emit('joinPresentation', result);
      }

    } else {
      let result = {status: false, message: "Presentation does not exist"};
      io.to(socket.id).emit('joinPresentation', result);
    }
  });

  socket.on('testing', function (data) {
    logData("testing got " + data);
  });
  socket.on('test_present', function (indexh, indexv, indexf) {
    let position = {indexh: indexh, indexv: indexv, indexf: indexf};
    logData("received " + indexh + " " + indexv + " " + indexf);
    io.emit("testpresent", position);

  });

  socket.on('update_presentation', function (presentation_id, indexh, indexv, indexf) {
    if (is_device_allowed(socket.id, presentation_id, "present")) {
      let next = {indexh: indexh, indexv: indexv, indexf: indexf};
      logData("received " + indexh + " " + indexv + " " + indexf);
      socket.broadcast.to("presentation" + presentation_id).emit('update_slide', next);
    } else {
      logData("refues");
    }
  });

  socket.on('get_presentations', function (user_id) {
    io.to(socket.id).emit('presentations', get_presentations());
  });

  socket.on('join_collaboration', function (collaboration_id, user_id) {
    let collaborator = new Collaborator(collaboration_id, user_id);
    collaborators.push(collaborator);
    socket.join("collaboration" + collaboration_id);

    logData("Device: " + users[findDeviceUser(socket.id)].username + " joined collaboration " + collaboration_id);

  });

  socket.on('leave_collaboration', function (collaboration_id, user_id) {
    for (let i = 0; i < collaborators.length; i++) {
      if (collaboration_id == collaborators[i].collaboration_id && user_id == collaborators[i].user_id) {
        collaborators.splice(i, 1);
      }
    }
    socket.broadcast.to("collaboration" + collaboration_id).emit('leaveCollaboration', user_id);
  });

  socket.on('is_slide_free', function (collaboration_id, user_id, slide_id) {
    let is_slide_free = false;
    for (let i = 0; i < collaborators.length; i++) {
      if (collaboration_id == collaborators[i].collaboration_id && slide_id == collaborators[i].slide_id) {
        // return occupied
        is_slide_free = true;
        let data = {
          collaboration_id: collaboration_id,
          status: false,
          username: users[find_user(collaborators[i].user_id)].username,
          user_id: collaborators[i].user_id,
        };
        io.to(socket.id).emit('isSlideFree', data);
      }
    }

    if (!is_slide_free) {
      for (let i = 0; i < collaborators.length; i++) {
        if (collaboration_id == collaborators[i].collaboration_id && user_id == collaborators[i].user_id) {
          // return occupied
          collaborators[i].slide_id = slide_id;
          let data = {
            collaboration_id: collaboration_id,
            status: true,
          };
          io.to(socket.id).emit('isSlideFree', data);
        }
      }
    }
  });

  socket.on('update_slide_content', function (collaboration_id, slide_id, slide_content) {
    let data = {
      id: slide_id,
      content: slide_content,
    };
    socket.broadcast.to("collaboration" + collaboration_id).emit('updateSlideContent', data);
  });

  socket.on('delete_slide', function (collaboration_id, slide_id) {
    socket.broadcast.to("collaboration" + collaboration_id).emit('deleteSlide', slide_id);
  });

  socket.on('create_slide', function (collaboration_id, slide_id, creator_id) {
    let data = {
      creator_id: creator_id,
      slide_id: slide_id,
    };
    socket.broadcast.to("collaboration" + collaboration_id).emit('createSlide', data);
  });

  socket.on('disconnect', function () {
    // delete and notify users if user was on a presentation
    let user_index = findDeviceUser(socket.id);
    if (user_index) {
      for (let i = 0; i < presentations.length; i++) {
        if ((users[user_index].user_id == presentations[i].owner_id) && (socket.id == presentations[i].device_id)) {
          logData("presentation " + presentations[i].presentation_id + " has been deleted");
          io.to(socket.id).emit('presentation' + presentations[i].presentation_id).emit("leavePresentation");
          presentations.splice(i, 1);
        }
      }
      let presentation_ids = get_presentations();
      for (let j = 0; j < users[user_index].devices.length; j++) {
        io.to(users[user_index].devices[j].device_id).emit('presentations', presentation_ids);
      }

      for (let i = 0; i < users[user_index].devices.length; i++) {
        if (users[user_index].devices[i].device_id == socket.id) {
          users[user_index].devices.splice(i, 1);
          logData("device " + socket.id + " has been removed from " + users[user_index].username);
        }
      }

      for (let i = 0; i < collaborators.length; i++) {
        if (users[user_index].user_id == collaborators[i].user_id) {
          collaborators.splice(i, 1);
        }
      }
    } else {
      //myArray.splice(0, 1)
      logData("Client Disconnected: " + socket.id);
    }
  });

});
