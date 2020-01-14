import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  let [data, setData] = useState();
  let [users, setUsers] = useState();
  useEffect(() => {
    axios.get("http://localhost:8000").then(res => {
      setData(res.data);
      console.log(res);
      console.log(data);
    });
  }, [setData]);
  useEffect(() => {
    axios.get("http://localhost:8000/api/users").then(res => {
      setUsers(res.data);
      console.log(res);
      console.log(data);
    });
  }, [setUsers]);
const deleteButton = (id) => {
  axios.delete(`http://localhost:8000/api/users/${id}`)
  .then(res => {
    console.log(res)
    setUsers(users.filter((item, i) => 
      item.id !== id
    ))
  })
  .catch(err => console.log(err))
}
  return (
    <div className="App">
      {data ? <h1>{data.message}</h1> : <h1></h1>}
      {users ? (
        <div>
          {users.map((user, index) => (
            <div>
              <h1>{user.name}</h1>
              <p>{user.bio}</p>
              <button onClick={() => {deleteButton(user.id)}}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <h1></h1>
      )}
    </div>
  );
}

export default App;
