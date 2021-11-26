**Description:**

Attendance-service is an internal service. Only services can comunicate with this service. Service Authenticating will happend in top later (gateway or ingress).  
What it mainly does is:  
1.  Write and Read student `attendance` to databse
2.  Write and Read users `feedback` and `quick_feedback` to databse.

Accepts graphql *Queries* and *Mutations*. This is the only service which has direct connection to `Attendance Databse`. Any service wants to **write&read** to any *attendance*, *feedback* or *quick_feedback* to ***Attendance Database*** has to make API call to *Attendance* service.




## How to set up locally

1. Clone repository, Recommended using **ssh+clone** to skip authentication every time
2. `npm i`  to install required packages
3. `npm run test` to make sure all APIs work
4. `npm run dev` usefull while in development
5. `npm run build` builds the project 
6. `npm start` runs built project


## How to make PR

Project has `master` and `alpha` (dev) branches. `master` branch contains production ready code  
If there are any feature/bug_fixes need to be added. Start new branch onto `alpha`  
When feature/bug_fixes are ready to merge, make ***PR*** (Pull Request) targeting `alpha`

## How to make commit
We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)

Common usage **[type]: description**  
Most used commit types:  
1. **fix** - patches a bug in your codebase (this correlates with PATCH in semantic versioning)  
2. **feat** - introduces a new feature to the codebase (this correlates with MINOR in semantic versioning)  
3. also **chore, test, style, refactor**

## How to control versioning 

We follow [Semantic Versioning](https://semver.org/)

1. ***major*** version when you make incompatible API changes  
2. ***minor*** version when you add functionality in a backwards compatible manner  
3. ***patch*** version when you make backwards compatible bug fixes  

**npm version <update_types>** will upgrade version and make commit
