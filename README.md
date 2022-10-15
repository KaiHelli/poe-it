# Poe-it

This repository holds our [CS4750 Database Systems](https://www.cs.virginia.edu/~up3f/cs4750/index.html) Project developed during Fall 2022. Poe-it is a social network for poetry. Poets can publish their poems in a public feed. Other users can then rate the poem, which affects its placement in the feed. No underperforming poems will be tolerated. Consequently, if a poem is rated too low, it will be deleted and thus kicked out of the feed. 

## How to run

There are two options to run the frontend and the backend concurrently in a Docker container by now. Either a local MySQL container can be used, for which the basic database schema and its values will be imported or an instance of the Google Cloud SQL service can be used. For this instead of a local MySQL container, the Google Cloud SQL Auth Proxy will be started in a Docker container. 

- `docker-compose --profile local up -V --build` will run the app with the local SQL database.
- `docker-compose --profile cloud up -V --build` will run the app with the Google Cloud SQL instance.

## Dependencies

- **`@poe-it`** - The overall project.
  - `concurrently` - Used to run the frontend and backend concurrently during development.
- **`@poe-it/ui`** - The frontend ui-code of the project.
- **`@poe-it/api`** - The backend api-code of the project based on `node.js`.
  - `express.js` - Used to ease the development in `node.js`.
  - `express-session` - Used to create sessions and session-cookies.
  - `express-mysql-session` - Used to store the session data in a MySQL database.
  - `express-validator` - Used to validate the input from users.
  - `cors` - Needed, since the API is called from different locations.
  - `mysql2-promise` - Used for the interaction with the MySQL database.
  - `argon2` - Used for secure hashing of passwords with salt and pepper.

## Authors:

- Kai Helli \<[dpd3zd@virginia.edu](mailto:dpd3zd@virginia.edu)\>
- Daniel Endean \<[dpe7pye@virginia.edu](mailto:dpe7pye@virginia.edu)\>
- Cole Rogers \<[cbr9yef@virginia.edu](mailto:cbr9yef@virginia.edu)\>
- Gideon French \<[grf3suu@virginia.edu](mailto:grf3suu@virginia.edu)\>

## Acknowledgements:

- Monorepo setup using npm workspaces: [Sitepen](https://www.sitepen.com/blog/the-basics-of-a-monorepo-where-projects-go-to-meet)
- Dockerfile using multiple npm workspaces while preserving the cache: [Post 1](https://stackoverflow.com/a/63142468), [Post 2](https://stackoverflow.com/a/66137816)
- Using anchors and aliases in YAML: [Blog](https://medium.com/@kinghuang/docker-compose-anchors-aliases-extensions-a1e4105d70bd)
