# Building API (Natours API using Express)

1 . We add package.json by writing the command npm init and fill the configuration that we want .
2 . npm i express to install Express and this will add the node modules to the folder .

app.js

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

app.js

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

app.js

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

<img width="1440" alt="Screenshot 2023-03-04 at 8 20 53 PM" src="https://user-images.githubusercontent.com/47382260/222911119-f2bb63d2-6e9b-4250-8e0d-f15aa4bbf769.png">

### 4. Handling POST Requests

In the post request we will add new tours information. The data will be sent from the client to the server. All the information about the request will be inside the request . Express does not put the body data on the request so in order to have that dta available we need to use middleware.

app.js

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

#<img width="1440" alt="Screenshot 2023-03-04 at 8 20 21 PM" src="https://user-images.githubusercontent.com/47382260/222910993-bd99bd57-2840-4f29-bc75-3b9b90ae96c1.png">

## 5. Responding to URL Parameters

Based on the id we want the tours data corresponding to the id provided in the URL. Here we can access the id in the req.params object.

app.js

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

<img width="1440" alt="Screenshot 2023-03-04 at 8 19 50 PM" src="https://user-images.githubusercontent.com/47382260/222910890-4f5c4e5f-75f2-4c6a-aff9-8f08a062f22f.png">

Now we will hit the API and get the data of the Particular id

app.js

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

There are two methods that are used to update the Data . PUT and PATCH methods. PUT method updates the entire object whereas PATCH method updates only the properties that are needed to change.Here we will send a dummy response .

```
//HANDLING PATCH Requests for one tour based on the id

app.patch("/api/v1/tours/:id", (req, res) => {
  //dummy code which wont change the JSON data as the JSON data is static. Will work with the Database in future
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick

  if (id < tours.length) {
    return res.status(200).json({
      status: "success",
      data: {
        tour: `<Here will be the Updated Tour Data>`,
      },
    });
  }
});

```

<img width="1440" alt="Screenshot 2023-03-04 at 9 25 43 PM" src="https://user-images.githubusercontent.com/47382260/222915956-5230dd31-867a-458e-b80f-b817fe3ce850.png">

### HANDLING DELETE Request

```
//HANDLING DELETE Requests for one tour based on the id

app.delete("/api/v1/tours/:id", (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
  if (id < tours.length) {
    return res.status(204).json({
      status: "success",
      data: null, //In the Delete method we dont send any data and the status code is 204 which show the data got deleted
    });
  }
});


```

<img width="1440" alt="Screenshot 2023-03-04 at 9 25 20 PM" src="https://user-images.githubusercontent.com/47382260/222915939-ab4777a4-be24-4698-8f81-4f6224c37553.png">

### Refactoring our Code

```

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const createNewTours = (req, res) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).send({
        status: "sucess",
        tours: newTour,
      });
    }
  );
};

const getTourById = (req, res) => {
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
};

const deleteTour = (req, res) => {
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick
  if (id < tours.length) {
    return res.status(204).json({
      status: "success",
      data: null, //In the Delete method we dont send any data and the status code is 204 which show the data got deleted
    });
  }
};

const updateTour = (req, res) => {
  //dummy code which wont change the JSON data as the JSON data is static. Will work with the Database in future
  let { id } = req.params;
  id = id * 1; //the id is a string so converting it to a number using a simple trick

  if (id < tours.length) {
    return res.status(200).json({
      status: "success",
      data: {
        tour: `<Here will be the Updated Tour Data>`,
      },
    });
  }
};

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createNewTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.delete("/api/v1/tours/:id", deleteTour);
// app.patch("/api/v1/tours/:id", updateTour);

app.route("/api/v1/tours").get(getAllTours).post(createNewTours);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .delete(deleteTour)
  .patch(updateTour);

```

### Middlewares

Our req,res object goes through the middlewares.All the middlewares has access to the req,res,next. We need to use next() to call the next middleware otherwise the execution will stuck.The end middleware is the Route handler.We dont call next() instead we send the responside to the client.To write middleware we use app.use() .

```
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
```

The order of the middleware matters a lot because if we write a middleware after a certain route than it wont get executed as the request response cycle for that route has already been ended.
Here in this code we added a requestTime property to the req object and we can access this property and also send back in the response object.

```
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    requestTime: req.requestTime,
    data: {
      tours: tours,
    },
  });
};
```

<img width="1440" alt="Screenshot 2023-03-05 at 11 38 01 AM" src="https://user-images.githubusercontent.com/47382260/222944573-c8b09670-f83a-4c1d-9534-156b5536e87b.png">

### Third Party Middleware

morgan - help us to see request data into out console.

```
const morgan = require("morgan");
..
app.use(morgan("dev"));

```

OUTPUT In terminal

```
GET /api/v1/tours 200 3.505 ms - 8807
```

### Defining the User Routes

```
app.route("/api/v1/users").get(getAllUsers).post(updateAllUsers);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .delete(deleteUser)
  .patch(updateUser);

```

For now we just define a dummy function which is not defined at the moment for all the Routes

```
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
```

### Creating and Mounting Multiple Routes

We will be using a middleware.We difine tourRouter and userRouter and mount a Router on a Route.Basically we mount tourRouter on "/api/v1/tours" .

```
const tourRouter = express.Router();
app.use("/api/v1/tours", tourRouter);

const userRouter = express.Router();
app.use("/api/v1/users", userRouter);

// 3) Tours ROUTES
tourRouter.route("/").get(getAllTours).post(createNewTours);
tourRouter.route("/:id").get(getTourById).delete(deleteTour).patch(updateTour);

// 4) User Routes
userRouter.route("/").get(getAllUsers).post(updateAllUsers);
userRouter.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

```

### Better File Stucture

We separated the controllers in a different folder called controllers and in the controllers there are two file which are tourController.js and userControllers.js .

userControllers.js

```
exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
..
..
..

```

userRoutes.js

```
const {
  getAllUsers,
  updateAllUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("./../controllers/userControllers");

```

server.js

```
const app = require("./app");

const port = 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

```
