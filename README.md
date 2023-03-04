# Building API (Natours API using Express)

1 . We add package.json by writing the command npm init and fill the configuration that we want .
2 . npm i express to install Express and this will add the node modules to the folder .

```
const express = require("express");
const app = express();
const port = 3000;

//the callback function will be called when the server starts listening.
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

```

### We create a Route

Routing means basically how an application responds to a certain client request , so to a certain url but also the http method which is used for that URL.

app.get("/", (req, res) => {
res.status(200).json({ message: "Hello from the Server!", status: "OK" });
});

app.post("/", (req, res) => {
res.status(200).send("This is a POST request");
});

### API's and Restful API Designs

API's on a higher level.- Introduction to REST Architecture which is the most used architectur today.
API stands for Application Programming Interface and on a very high level,it's basically a piece of software that can be used by another piece of software in order to allow applications to talk to each other.

REST, which stands for Representational States Transfer,is basically a way of building web APIs in a logical way, making them easy to consume because remember, we build an API for ourselves or for others to consume, okay? We want to make the process of actually using the API as smooth as possible for the user.

1 . First, we need to separate our API into logical resources. These resources should then be exposed, which means to be made available using structured, resource-based URLs.

2 . To perform different actions on data like reading or creating or deleting data, the API should use the right HTP methods and not the URL.

3 . Now, the data that we actually send back to the client or that we received from the client should usually use the JSON data format, where some formatting standard applied to it.

4 . Finally, another important principle of REST APIs is that they must be stateless.

### Starting our API : Handling GET Requests

```
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {

  res.status(200).json({
    status: "success",
    data: {
      tours: tours, //in ES6 if we have the same name then we dont need to write tours:tours , tours only would be fine
    },
  });
});

```

Formatted the data here using JSEND Data Specification .Wrapping the tours data into Envelope and sending status code.

```
{
    status: "success",
    data: {
      tours
    },
}
```

We can send the number of tours using tours.length as tours data is array of objects.

### Handling POST Requests
