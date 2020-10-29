# db-project

Project repo for CS2102 Intro to Database Management Systems.
Recommended node v14.8.0 for development, as this is the one used by production.

Application website resides [here](https://petpets.herokuapp.com/)

# Getting Started

## Prerequisites

Make sure you have `yarn`, `docker`, `docker-compose` installed.

Run `yarn install` to install dependencies for both front and back end.

### Front-end dev

The `web` folder is configured as a yarn workspace. So calling `yarn add`
inside the `web` folder will install only for the front-end.

Go inside the `web` folder, and `yarn start` the development server.

### Back-end dev

The backend API and database run on Docker containers. In the root folder,
run `yarn up`. It will spawn a Node server, a PostgreSQL server.

The container runs in detached mode, meaning the output will not be printed
to the current terminal. So to read the logs, run `yarn logs`.

The SQL server is available at port 5433, and the Express server runs on port 8000.

Use `yarn down` to stop the containers.

## Adding Dependencies

The *node-modules* folder for the backend server is in the root folder while the frontend utilises */web/node-modules*.

Dependencies for backend should be added using `yarn add {package-name} -W` in the **root folder**, 

dependencies for frontend should be added using `yarn add {package-name}` in the **/web folder**, 


## Deploy

It uses a different Dockerfile for deployment. The production container builds the React
application, and servers both the front and back end through a single Express server.


## Database Setup

Database reset is done after each time that server restarts. This is done automatically via
`yarn up`. 


## Database Connection

Check if PostgreSQL's docker container is running with `docker ps`.

Make sure that you have the PostgreSQL client `psql` installed.

Run `psql -h localhost -p 5433 -U postgres -d cs2102_project` to connect to the database, you are now in the `cs2102_project` database.

`\l` shows all the databases on the server.

`\c [DATABASE]` changes the current workspace to that database.

`\d` shows all the relations (tables) in the database.

`\i [file]` runs the specified SQL file



## Demo User Accounts

| email           | password | username  |
| --------------- | -------- | --------- |
| jan@gmail.com   | abcde    | jan       |
| admin@email.com | admin    | Bran Bong |



