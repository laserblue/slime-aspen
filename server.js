// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
/*
db.serialize(() => {
  db.run(
    "Create TABLE Authors (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT)"
  );
  console.log("New table Authors created!");
});
*/
// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE GreatIdeas (id INTEGER PRIMARY KEY AUTOINCREMENT, greatIdea TEXT)"
    );
    console.log("New table Great Ideas of the Western World created!");
    
    db.serialize(() => {
      db.run(
        'INSERT INTO GreatIdeas (greatIdea) VALUES ("Angel"), ("Animal"), ("Aristocracy")'
      );
    });
  } else { 
    console.log('The sqlite.db Database exists and the Database "GreatIdeas" is ready to go!');

    db.each("SELECT * from GreatIdeas", (err, row) => {
      if (row) {
        console.log(`record: ${row.id}, ${row.greatIdea}`);
      }
    });
   }
});

/*
      // insert default authors
    db.serialize(() => {
      db.run(
        'INSERT INTO Authors (author) VALUES ("Plato"), ("Aristotle"), ("Homer")'
      );
    });
  } else {
    console.log('Database "Authors" ready to go!');

    db.each("SELECT * from Authors", (err, row) => {
      if (row) {
        console.log(`record: ${row.author}`);
      }
    });
  }

});
*/

/*
db.serialize(() => {
  db.run(
    'INSERT INTO Authors (author) VALUES ("Mahan"), ("Walker"), ("Hemingway")'
  );
  console.log("New Author rows inserted!");
});
*/
/*
db.serialize(() => {
  db.run(
    "Create TABLE GreatIdeas (id INTEGER PRIMARY KEY AUTOINCREMENT, greatIdea TEXT)"
  );
  console.log("New table GreatIdeas created!");
});
*/

/* Did some sqlite3 prompt use on console but don't know how to connect to :memory: ./.data/sqlite.db
.help
.header ON
.mode column
.quit

don't seem to work 
.database - just main but no filename for Dreams, /app/comment_section.db
.table
.show
.schema
.dump



// ALTER TABLE Authors
// ADD COLUMN written_work TEXT

// INSERT INTO Authors

//UPDATE
//DELETE
//SELECT 
//WHERE
//LIKE
*/
/*
db.serialize(() => {
  db.run(
  "UPDATE Authors SET written_work='The Illiad' WHERE author='Homer' ")
});
*/


// print all records from Table Dreams to console
db.serialize(() => {
  db.each("SELECT * from Dreams", (err, row) => {
      if (row) {
        console.log(`Dreams record: ${row.id}, ${row.dream}`); // not appearing in log ? 
      }
    });
   }
);

/* 
db.serialize(() => {
  db.run("DELETE FROM Dreams WHERE row.id=252", (err, row) => {
      console.log(`record 252 deleted`)
    });
   }
);
*/ 


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the greatIdeas in the database
app.get("/getGreatIdeas", (request, response) => {
  db.all("SELECT * from GreatIdeas", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});


// endpoint to get all the authors in the database
app.get("/getAuthors", (request, response) => {
  db.all("SELECT * from Authors", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a greatIdea to the database
app.post("/addGreatIdea", (request, response) => {
  console.log(`add to greatIdeas ${request.body}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedGreatIdea = cleanseString(request.body.greatIdea);
    db.run(`INSERT INTO GreatIdeas (greatIdea) VALUES (?)`, cleansedGreatIdea, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// endpoint to add an author to the database
app.post("/addAuthor", (request, response) => {
  console.log(`add to authors ${request.body}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedAuthor = cleanseString(request.body.author);
    db.run(`INSERT INTO Authors (author) VALUES (?)`, cleansedAuthor, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});


// endpoint to clear dreams from the database
app.get("/clearGreatIdeas", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from GreatIdeas",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM GreatIdeas WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});


// endpoint to clear authors from the database
app.get("/clearAuthors", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from Authors",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM Authors WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});



// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});