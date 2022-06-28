**Description:**

Attendance-service is an internal service. Only services can comunicate with this service. Service Authenticating will happend in top later (gateway or ingress).  
What it mainly does is:

1.  Write and Read student `attendance` to databse
2.  Write and Read users `feedback` and `quick_feedback` to databse.
3.  Read attendance information from `redis` and send it to CMS service
4.  Schedule attendances.

Accepts graphql _Queries_ and _Mutations_. This is the only service which has direct connection to `Attendance Databse`. Any service wants to **write&read** to any _attendance_, _feedback_ or _quick_feedback_ to **_Attendance Database_** has to make API call to _Attendance_ service.

## How to set up locally

1. Clone repository, Recommended using **ssh+clone** to skip authentication every time
2. Install `postgress` and `redis`, installing them on docker recommended.  
Create docker network `docker network create local-dev`.  
To install postgres run `docker run --network local-dev -e POSTGRES_PASSWORD=kidsloop -e POSTGRES_USER=postgres -p 5432:5432 -d postgres`.  
To install redis run `docker run --rm --name=redis --network local-dev -p 6379:6379 -d redis`
3. `npm i` to install required packages
4. `npm run test` to make sure all APIs work
5. `npm run dev` usefull while in development
6. `npm run build` builds the project
7. `npm start` runs built project

## Run the service in a docker container

Build the container:

```shell
docker build -t kl-attendance .
```

Run it with a local database also running in docker named `kl_postgres` on the default `bridge` network or a custom `kidsloop` network:

```shell
docker run --rm -it \
  --name kl_attendance \
  --net kidsloop \
  --env-file .env \
  --env PORT=8080 \
  --env POSTGRES_DATABASE_URL=postgres://user:password@kl_postgres:5432/attendance_db  \
  -p 8082:8080 \
  kl-attendance
```

You can also connect to remote databases that you have mapped onto your localhost by passing `host.docker.internal` instead of localhost in your database url:

```shell
docker run --rm -it \
  --name kl_attendance \
  --net kidsloop \
  --env-file .env \
  --env PORT=8080 \
  --env POSTGRES_DATABASE_URL=postgres://user:password@host.docker.internal:5432/attendance_db  \
  -p 8082:8080 \
  kl-attendance
```

## How to make PR

Start new branch off `master`  
When feature/bug_fixes are ready to merge, make \*\*\_PR*\*\* (Pull Request) targeting `master`

## How to make commit

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)

Common usage **[type]: description**  
Most used commit types:

1. **fix** - patches a bug in your codebase (this correlates with PATCH in semantic versioning)
2. **feat** - introduces a new feature to the codebase (this correlates with MINOR in semantic versioning)
3. also **chore, test, style, refactor**

## How to control versioning

We follow [Semantic Versioning](https://semver.org/)

1. **_major_** version when you make incompatible API changes
2. **_minor_** version when you add functionality in a backwards compatible manner
3. **_patch_** version when you make backwards compatible bug fixes

**npm version <update_types>** will upgrade version and make commit
