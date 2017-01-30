// requires
var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require( 'pg' );
var connectionString = 'postgres://localhost:5432/oopsilionTodo';
// uses
app.use( express.static( 'public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// // spin up server
app.listen( 3000, function(){
  console.log( 'server up on 3000' );
}); // end server up

// routes
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
}); //end base

// create task
app.post( '/createTask', function( req, res ){
  console.log( 'createTask route hit:', req.body) ;
  // connect to db
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
      res.sendStatus( 500 );
    } // end Error
    else {
      console.log( 'db connect');
      // insert a new row to our table
      client.query( "INSERT INTO todos ( name, complete ) values ( $1, $2 )", [ req.body.taskName, false ] );
      // close connection to db
      done();
      // send back a success message
      res.sendStatus( 200 );
    } // end no error
  }); // end connect
}); //end createTask

// compelteTask
app.put( '/completeTask', function( req, res ){
  console.log( 'completeTask hit:', req.body );
  // connect to db
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
      res.sendStatus( 500 );
    } //end error
    else{
      // update the row of this id to have completed=true
      client.query( "UPDATE todos SET complete=true WHERE id=" + req.body.id );
      // close connection to db
      done();
      // send success
      res.sendStatus( 200 );
    } // end no error
  }); //end db connect

  res.send( 'quack' );
}); // end completeTask

// get tasks
app.get( '/getTasks', function( req, res ){
  console.log( 'in getTasks' );
  // array to hold my results
  var results = [];
  // connect to db
  pg.connect( connectionString, function( err, client, done ){
    if( err ){
      console.log( err );
      res.send( 500 );
    } //end Error
    else{
      // get rows from table
      var allRows = client.query( "SELECT * FROM todos ORDER BY complete ASC" );
      // go through each row & push that row into results
      allRows.on( 'row', function( row ){
        results.push( row );
      }); // end on row
      allRows.on( 'end', function(){
        // when @ end close connection to db
        done();
        // send results to client for display
        res.send( results );
      }); //end on end
    } // end no error
  }); //end connect
}); // end getTasks
