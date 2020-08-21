# db-project

Project repo for CS2102 Intro to Database Management Systems.
Recommended node v14.8.0 for development, as this is the one used by production.

# Getting Started

## Prerequisites

Make sure you have `yarn`, `docker`, `docker-compose` and `make` installed.

Run `yarn install` to install dependencies for both front and back end.

### Front-end dev

The `web` folder is configured as a yarn workspace. So calling `yarn add`
inside the `web` folder will install only for the front-end.

Go inside the `web` folder, and `yarn start` the development server.

### Back-end dev

The backend API and database run on Docker containers. In the root folder,
run `make up`. It will spawn a Node server, a PostgreSQL server.

The container runs in detached mode, meaning the output will not be printed
to the current terminal. So to read the logs, run `make logs`.

The SQL server is available at port 5433, and the Express server runs on port 8000.

Use `make down` to stop the containers.

## Adding Dependencies

The *node-modules* folder for the backend server is in the root folder while the frontend utilises */web/node-modules*.

Dependencies for backend should be added using `yarn add {package-name} -W` in the **root folder**, 

dependencies for frontend should be added using `yarn add {package-name}` in the **/web folder**, 


## Deploy

It uses a different Dockerfile for deployment. The production container builds the React
application, and servers both the front and back end through a single Express server.

It (may) use Heroku's hosted SQL server instead of another container.
