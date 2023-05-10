# Ticktech-assignment

# This is a simple CRUD API using in-memory mongodb and a custom load-balancer (using nodejs 'cluster' api)

# First run ----- npm i ------ to install all the dependencies

# Commands :

1. Testing (Using mocha and chai) - npm test
2. Development - npm run start:dev
3. Production - npm run start:prod
4. Load Balancer(Multiple instances) - npm run start:multi

# Load Balancer
This will create multiple instances running on consecutive ports and the main port will re-route the incoming requests to different worker instances using round-robin method and the state of database will remain consistent between different workers!

Note- Since in-memory database is used, restarting will cause data loss.
