# Poe-it

This repository holds our [CS4750 Database Systems](https://www.cs.virginia.edu/~up3f/cs4750/index.html) Project developed during Fall 2022. Poe-it is a social network for poetry. Poets can publish their poems in a public feed. Other users can then rate the poem, which affects its placement in the feed. No underperforming poems will be tolerated. Consequently, if a poem is rated too low, it will be deleted and thus kicked out of the feed. 

## How to run

There are two options to run the frontend and the backend concurrently in a Docker container by now:

- `docker-compose --profile local up -V --build` 
  - This will start a local MySQL container alongside the Poe-it application, for which the basic database schema and its values will be imported.

- `docker-compose --profile cloud up -V --build`
  - For this instead of a local MySQL container, the Google Cloud SQL Auth Proxy will be started in a Docker container alongside the Poe-it Application.


    A file named `secrets.env` is required in the project
    root directory with the format:
````
        DB_HOST='db_hostname'
        DB_PORT='db_portnumber'
        DB_USER='api'
        DB_PASS='PASSWORD_FOR_DB' # same as MYSQL_API_PASSWORD
        DB_NAME='PoeItDB'
        PASSWORD_PEPPER='PEPPER_VALUE'
        SESSION_SECRET='express_session_key'
        MYSQL_ROOT_PASSWORD='a_password'
        MYSQL_API_PASSWORD='PASSWORD_FOR_DB'
        APP_ADMIN_PASSWORD='yet_another_password'
        APP_ADMIN_HASH='argon2_hash_of_APP_ADMIN_PASSWORD'
        # Note hash must be with PASSWORD_PEPPER
        # Set NODE_ENV to either 'development' or 'production'
        NODE_ENV='development' # or 'production'
  ````      


The frontend will currently be served at [http://localhost:4200/](http://localhost:4200/) while the backend is available at [http://localhost:8080/](http://localhost:8080/).

## Dependencies

### Global dependencies

Installed with `npm install -g <package>`

- **`@angular/cli`** - Angular developer tools. **NOTE:** Node 18 not supported, since it is not an LTS version. 

### Project dependencies

- **`@poe-it`** - The overall project.
  - `npm-run-all` - Used to run the frontend and backend concurrently during development.
- **`@poe-it/ui`** - The frontend ui-code of the project.
  - `ng-validate-equal` Used to validate that two form inputs are equal.
- **`@poe-it/api`** - The backend api-code of the project based on `node.js`.
  - `express.js` - Used to ease the development in `node.js`.
  - `express-session` - Used to create sessions and session-cookies.
  - `express-mysql-session` - Used to store the session data in a MySQL database.
  - `express-validator` - Used to validate the input from users.
  - `cors` - Needed, since the API is called from different locations.
  - `mysql2-promise` - Used for the interaction with the MySQL database.
  - `argon2` - Used for secure hashing of passwords with salt and pepper.
  - `apidoc` - Used to document the features of the api.
  - `nodemon` - Used to automatically restart the node server on file change.

### Installing new dependencies:

- Global dependency: `npm install -W <package>`
- Workspace dependency: `npm install <package> -w @poe-it/<api / ui>`

## Documentation:

The documentation for the api is automatically generated from the comments in the source code using `apidoc`. They will be served at: [http://localhost:8080/docs](http://localhost:8080/docs)

## Known issues:

- If the MySQL container does not start up and prints the following log entry:

  `[Server] --initialize specified but the data directory has files in it. Aborting.`

  Run `docker volume prune` to reclaim disk space.

## Authors:	

- Kai Helli \<[dpd3zd@virginia.edu](mailto:dpd3zd@virginia.edu)\>
- Daniel Endean \<[dpe7pye@virginia.edu](mailto:dpe7pye@virginia.edu)\>
- Cole Rogers \<[cbr9yef@virginia.edu](mailto:cbr9yef@virginia.edu)\>
- Gideon French \<[grf3suu@virginia.edu](mailto:grf3suu@virginia.edu)\>

## Acknowledgements:

- Monorepo setup using npm workspaces: [Sitepen](https://www.sitepen.com/blog/the-basics-of-a-monorepo-where-projects-go-to-meet)
- Dockerfile using multiple npm workspaces while preserving the cache: [Post 1](https://stackoverflow.com/a/63142468), [Post 2](https://stackoverflow.com/a/66137816)
- Using anchors and aliases in YAML: [Blog](https://medium.com/@kinghuang/docker-compose-anchors-aliases-extensions-a1e4105d70bd)
