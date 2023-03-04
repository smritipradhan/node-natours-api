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

### 1. We create a Route

Routing means basically how an application responds to a certain client request , so to a certain url but also the http method which is used for that URL.

app.get("/", (req, res) => {
res.status(200).json({ message: "Hello from the Server!", status: "OK" });
});

app.post("/", (req, res) => {
res.status(200).send("This is a POST request");
});

### 2. API's and Restful API Designs

API's on a higher level.- Introduction to REST Architecture which is the most used architectur today.
API stands for Application Programming Interface and on a very high level,it's basically a piece of software that can be used by another piece of software in order to allow applications to talk to each other.

REST, which stands for Representational States Transfer,is basically a way of building web APIs in a logical way, making them easy to consume because remember, we build an API for ourselves or for others to consume, okay? We want to make the process of actually using the API as smooth as possible for the user.

1 . First, we need to separate our API into logical resources. These resources should then be exposed, which means to be made available using structured, resource-based URLs.

2 . To perform different actions on data like reading or creating or deleting data, the API should use the right HTP methods and not the URL.

3 . Now, the data that we actually send back to the client or that we received from the client should usually use the JSON data format, where some formatting standard applied to it.

4 . Finally, another important principle of REST APIs is that they must be stateless.

### 3. Starting our API : Handling GET Requests

```
const express = require("express");
const fs = require("fs");
const app = express();

const port = 3000;

//top level code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//the callback function will be called when the server starts listening.
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
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

### 4. Handling POST Requests

In the post request we will add new tours information. The data will be sent from the client to the server. All the information about the request will be inside the request . Express does not put the body data on the request so in order to have that dta available we need to use middleware.

```
app.use(express.json());
```

This express.json is a middleware a function that can modify the incoming data .Middleware before it stands between the request and the response.

```

app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);
  res.send("Hello from the server side ");
});

```

We open the POSTMAN and select POST method and in the body section we chose raw and in JSON format.

OUTPUT:
{ name: 'Varkala', duration: 10, difficulty: 'medium' }

We have our POST call all setup and we have access to the body.So we will want to persist this data into out JSON file. We are going to modify the json file which is our fictional database for some time .
First thing figure out is the id of the object and whenever we add an object we never specify the id of the object.So we need to configure it in the server side.Here we take the id of the last object and add 1 to it.

201 - stands for created
200 - stands for okay

```
app.post("/api/v1/tours", (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  console.log(newTourId);
  const newTour = Object.assign({ id: newTourId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).send({
        tours: newTour,
      });
    }
  );
});

```

Data sent from Client to Server in POSTMAN
{
"name": "Varkala",
"duration":10 ,
"difficulty":"medium"
}

Output in POSTMAN
{
"tours": {
"id": 9,
"name": "Varkala",
"duration": 10,
"difficulty": "medium"
}
}

The JSON file also got modified.

### 5. Responding to URL Parameters

Based on the id we want the tours data corresponding to the id provided in the URL. Here we can access the id in the req.params object.

```
app.get("/api/v1/tours/:id", (req, res) => {
  console.log(req.params);
  res.status(200).json({
    status: "success",
  });
});
```

OUTPUT In Terminal

```
{ id: '4' }
```

OUTPUT IN Postman

```
{
    "status": "success"
}
```

Now we will hit the API and get the data of the Particular id

```
app.get("/api/v1/tours/:id", (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick

  const tour = tours.find((element) => element.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "failure",
      message: "Invalid id Found !!",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

```

OUTPUT IN POSTMAN

```
{
    "status": "success",
    "data": {
        "tour": {
            "id": 3,
            "name": "The City Wanderer",
            "duration": 9,
            "maxGroupSize": 20,
            "difficulty": "easy",
            "ratingsAverage": 4.6,
            "ratingsQuantity": 54,

         ..
         ..
         ..
}
```

### HANDLING PATCH Requests
