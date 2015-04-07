// YOUR CODE HERE:
//
//

var App = function() {
  this.server = 'https://api.parse.com/1/classes/chatterbox';
  this.rooms = {};
  this.friends = {};
};

App.prototype.init = function() {
  var context = this;
  var $form = $('#send');
  $form.submit(function(event){
    context.handleSubmit();
    event.preventDefault();
  });
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
  var roomName = $('#roomNameText').val();
  this.addRoom(roomName);

  var messageObject = {};
  messageObject.username = $('#usernameText').val();
  messageObject.text = $('#message').val();
  $('#message').val("");
  messageObject.roomName = 'theWooRoom';

  if(messageObject.username.length > 0 && messageObject.text.length > 0) {
    this.send(messageObject);
  }
};

App.prototype.fetch = function () {
  $('#chats').children().remove();
  var context = this;
  $.ajax({
    url: this.server,
    type: 'GET',
    data: {order: "-createdAt"},
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

App.prototype.escape = function(text) {
 var textArray = text.split("");

 var replace = function(array, dangerItem, safeItem) {
   var index = array.indexOf(dangerItem);
   while(index !== -1) {
    array.splice(index,1,safeItem);
    index = array.indexOf(dangerItem);
   }
 };
 // & --> &amp;
 replace(textArray, '&', '&amp');
 // < --> &lt;
 replace(textArray, '<', '&lt');
 // > --> &gt;
 replace(textArray, '>', '&gt');
 // " --> &quot;
 replace(textArray, '"', '&quot');
 // ' --> &#x27;     &apos; not recommended because its not in the HTML spec (See: section 24.4.1) &apos; is in the XML and XHTML specs.
 replace(textArray, "'", '&#x27');
 // / --> &#x2F;
 replace(textArray, '/', '&#x2F');

 return textArray.join("");
};

App.prototype.addMessage = function (messageData) {
  //console.dir(messageData);
  var roomName = messageData.roomname;
  this.addRoom(roomName);
  if(roomName === $('#roomSelect').val()) {
    var context = this;
    var text = messageData.text;
    var createdAt = messageData.createdAt;
    var username = messageData.username;
    var $messageBlock = $("<div class='chat'></div>");
    text = this.escape(text);
    var $message = $("<p class='msgText'>" + text + "</p>");
    var $createdAt = $("<p class='timeStamp'>" + createdAt + "</p>");
    var $username = $("<p class='username'>" + username + "</p>");
    var $roomName = $("<p class='roomName'> Room: " + roomName + "</p>");


    if(this.friends.hasOwnProperty(username)) {
      $messageBlock.css("font-weight","Bold");
      $messageBlock.css('font-size',"24px");
    }


    $username.appendTo($messageBlock);
    $message.appendTo($messageBlock);
    $createdAt.appendTo($messageBlock);
    $roomName.appendTo($messageBlock);
    $('#chats').append($messageBlock);

    $username.on ("click", function(){
      context.addFriend(username);
    });
  }
};

App.prototype.addRoom = function(roomName) {
  if(!this.rooms.hasOwnProperty(roomName)) {
    this.rooms[roomName] = roomName;
    var $roomName = $("<option value="+roomName+">"+roomName+"</option>");
    $roomName.appendTo('#roomSelect');
  }
};

App.prototype.addFriend = function(friendName) {
  if(!this.friends.hasOwnProperty(friendName)) {
    this.friends[friendName] = friendName;

    $friendsList = $('.friendsList');
    $friendName = $("<li>" + friendName + "</li>");
    $friendsList.append($friendName);
  }
};

$(document).ready(function () {
var app = new App();
app.init();

setInterval(function(){
  app.fetch();
}, 5000);
});
