$( document ).ready( function(){
  $( '#createTaskButton' ).on( 'click', function(){
    console.log( 'createTaskButton on click' );
    // create an object with user input
    var objectToSend = {
      taskName: $( '#taskNameIn').val()
    }; // end objectToSend
    console.log( 'sending:', objectToSend);
    // send object to server
    $.ajax({
      type: 'POST',
      data: objectToSend,
      url: '/createTask',
      success: function( response ){
        // empty the input field
        $( '#taskNameIn').val('');
        console.log( 'back with:', response );
        // update display
        getTasks();
      } // end success
    }); // end ajax
  }); // end createTaskButton on click

  $( '#outputDiv' ).on( 'click', '.completeButton', function(){
    if( confirm( 'u sure?') ){
      var myId = $( this ).data( 'id' );
      console.log( 'completeButton on click:', myId );
      // send id to server in an object via ajax
      var objectToSend = {
        id: myId
      }; //end objectToSend
      $.ajax({
        type: 'PUT',
        data: objectToSend,
        url: '/completeTask',
        success: function( response ){
          console.log( 'back with:', response );
          // update display
          getTasks();
        } // end success
      }); //end ajax
    } //end confirm
  }); // end completeButton

  var getTasks = function(){
    console.log( 'in getTasks' );
    // ajax get request for existing tasks
    $.ajax({
      type: 'GET',
      url: '/getTasks',
      success: function( response ){
        console.log( 'back with:', response );
        // update DOM
        // empty outputDive
        $( '#outputDiv' ).html('');
        // loop through array
        for (var i = 0; i < response.length; i++) {
          // append each task to outputDiv
          // check if complete
          if( response[i].complete ){
            $( '#outputDiv' ).append( '<p><strong>' + response[i].name + '<strong></p>');
          } // end compelte
          else{
            $( '#outputDiv' ).append( '<p>' + response[i].name + ' <button class="completeButton" data-id="' + response[i].id + '">Complete</button><button class="deleteButton">Delete</button></p>');
          } // end not complete
        } // end for
      } // end success
    }); //end ajax
    // display on DOM
  }; // end getTasks

  // run getTasks on page load
  getTasks();
});
