
# Project Submission Files

* [ER Diagram](docs/report/er_diagram.png)
* [Project Report](docs/report/main.pdf)
* [Demo](docs/demo-video.mp4)

# Petpets

This is the project repository for CS2102 Introduction to Database Management Systems
at NUS.
Node v14.8.0 is recommended for development, as this is the one used by the production
Docker container.

Visit the deployed version of the full-stack app [here](https://petpets.herokuapp.com/).

# Getting Started

## Prerequisites

Make sure you have `yarn`, `docker`, `docker-compose` installed. 
Run `yarn` to install dependencies for both front and back end.
As the project is configured into Yarn workspaces, they share the
same `yarn.lock` file in the root folder.

### Front-end development

Go inside the `web` folder, and `yarn start` the development server.

### Back-end development

The backend Express API and the PostgreSQL database run on Docker containers. In the root folder,
run `yarn up`. It will spawn a Node server and a PostgreSQL server.

The containers run in detached mode, meaning the output will not be printed
to the current terminal. In order to read the logs, run `yarn logs`.

The SQL server exposes port `5433` (instead of the default `5432` port), 
and the Express server exposes port `8000`.

Use `yarn down` to stop the containers.

## Adding Dependencies

The `node-modules` folder for the backend server is in the root folder while the frontend utilises `/web/node-modules`.

The dependencies for backend should be added using `yarn add {package-name} -W` in the **root folder**, 

and the dependencies for frontend should be added using `yarn add {package-name}` in the **`/web` folder**, 

## Deploy

It uses a different Dockerfile for deployment (`Dockerfile.prod`). The Production container builds the React
application, and serves both the front- and back-end through a single Express server.


## Database Setup

Database resets automatically each time when `yarn up` is executed.


## Database Connection

You can check whether the PostgreSQL Docker container is running with `docker ps`.

Make sure that you have the PostgreSQL client `psql` installed.

Run `psql -h localhost -p 5433 -U postgres -d cs2102_project` to connect to the database, you are now in the `cs2102_project` database.

* `\l` shows all the databases on the server.

* `\c [DATABASE]` changes the current workspace to that database.

* `\d` shows all the relations (tables) in the database.

* `\i [file]` runs the specified SQL file



## Demo User Accounts

| email           | password | username  |
| --------------- | -------- | --------- |
| jan@gmail.com   | abcde    | jan       |
| p@gmail.com     | abcde    | p         |
| admin@email.com | admin    | Bran Bong |

You can view more generated user accounts [here](docs/accounts.md)



