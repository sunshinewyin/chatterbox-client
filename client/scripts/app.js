// YOUR CODE HERE:
//
//

var App = function() {
  this.server = 'https://api.parse.com/1/classes/chatterbox';
  this.rooms = {};
  this.friends = {};
};

App.prototype.init = function() {

};

App.prototype.send = function(message) {
  $.ajax({
    // always use this url
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

App.prototype.handleSubmit = function() {
  var message =
  this.send(message);
};

App.prototype.fetch = function () {
  var context = this;
  $.ajax({
    url: this.server,
    type: 'GET',
    success: function(dataFromServer){
      for(var i = 0; i < dataFromServer.results.length; ++i) {
        context.addMessage(dataFromServer.results[i]);
      }
    }
  });
};

App.prototype.clearMessages = function() {
  $('#chats').children().remove();
};

App.prototype.addMessage = function (messageData) {
  var context = this;
  var text = messageData.text;
  var createdAt = messageData.createdAt;
  var username = messageData.username;
  var $messageBlock = $("<div class='message'></div>");
  var $message = $("<p>" + text + "</p>");
  var $createdAt = $("<p>" + createdAt + "</p>");
  var $username = $("<p class='username'>" + username + "</p>");

  $createdAt.appendTo($messageBlock);
  $message.appendTo($messageBlock);
  $username.appendTo($messageBlock);
  $('#chats').prepend($messageBlock);
  $username.on ("click", function(){
    context.addFriend(username);
  });
};

App.prototype.addRoom = function(roomName) {
  if(this.rooms.hasOwnProperty(roomName)) {
    return;
  }

  this.rooms[roomName] = roomName;
  var $roomName = $("<option value="+roomName+">"+roomName+"</option>");
  $roomName.appendTo('#roomSelect');
};

App.prototype.addFriend = function(friendName) {
  if(this.friends.hasOwnProperty(friendName)) {
    return;
  }

  this.friends[friendName] = friendName;

  $friendsList = $('.friendsList');
  $friendName = $("<li>" + friendName + "</li>");
  $friendsList.append($friendName);

};


var app = new App();
setInterval(function(){
  app.fetch();
}, 1000)
