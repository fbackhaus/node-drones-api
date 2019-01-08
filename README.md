Node Drones API
=====================

## Using this App

This app is built with Node.js, Express.js and MongoDB.

First, run:

```bash
$ npm install
```

Once it finished, make sure that Docker is running. Then, to run it locally do:

```bash
$ npm run build
```

Finally:

```bash
$ npm run production
```
The api listens on port 4001.

Return all drones:

```
GET /api/drones
```

Delete drone by id:

```
DELETE /api/drones/${id}
```


Create new drone:

```
POST /api/drone
{
	"x": 150,
	"y": 200,
	"quadrant": 2
}
```