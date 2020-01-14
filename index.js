// implement your API here
// import express from 'express'; // ES2015 module syntax
const express = require("express"); // CommonJS modules
const cors = require("cors"); // Cors

const Users = require("./data/db"); // our users database library

const server = express();

// middleware: teaches express new things
server.use(express.json()); // needed to parse JSON
server.use(cors());

// routes or endpoints

// GET to "/"
server.get("/", function(request, response) {
  response.send({ message: "My First Web API" });
});

// see a list of All Users
server.get("/api/users", (req, res) => {
  // read the data from the database (Users)
  Users.find() // return a promise
    .then(users => {
      console.log("Users", users);
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      // handle the error
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

//see a specific user by ID

server.get("/api/users/:id", (req, res) => {
    Users.findById(req.params.id)
    .then(user => {
        if(user) {
            res.status(200).json(user)

        }else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    })
    .catch(error => {
        cocnsole.log('Cannot GET', error)
        res.status(500).json({
            errorMessage: "Ther User information couldn't be retrived."
        })
    })
})

// create a User
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  console.log(req.body)
  console.log(name)
  console.log(bio)
  if (!name || !bio) {
    return res.status(400).json({
      error: "Name or Bio are missing for the user"
    });
  } else {
    Users.insert(req.body)
      .then(user => {
        res.status(201).json({
          message: `User ${name} with the bio ${bio} was added to the database`
        });
      })
      .catch(error => {
        console.log("Post error", error);
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
  // never trust the client, validate the data. for now we trust the data for the demo
});
//Update a User

server.put('/api/users/:id', (req, res) => {
    const {name, bio} = req.body
    if (!name || !bio) {
        res.status(400).json({
            error: "Name or Bio are missing for the user"
        })
    } else {
        Users.update(req.params.id, req.body)
        .then(user => {
            if(user) {
                res.status(200).json({
                    message: `user updated`
                })
            } else {
                res.status(404).json({
                    message: "The User with the specified ID does not exist."
                })
            }
        })
        .catch(error => {
            console.log(`PUT failed`, error)
            res.status(500).json({
                error: "Ther User Infromation couldn't be modified."
            })
        })
    }
})
// delete a User
server.delete('/api/users/:id', (req, res) => {
    Users.remove(req.params.id)
    .then(response => {
        if(response == 1) {
            Users.find()
            .then(users => {
                console.log(users)
                res.status(200).json({
                    success: true,
                    deleted: response
                })
            })
            .catch(error => {
                res.status(500).json({
                    success: false,
                    error
                })
            })
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "The user could not be removed",
            error
        })
    })
})

// update a user : extra exercise

const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));

// fork > clone > type: "npm i" in the project folder to get the dependencies.
// type: "npm i express" (no quotes) to install the express library
// add the "index.js" file with code the root folder
// to run the server type: "npm run server"
// make a GET request to localhost:8000 using Postman or Insomnia

// to solve the sqlite3 error just do npm i sqlite3
