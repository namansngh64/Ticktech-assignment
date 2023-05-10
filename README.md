# Ticktech-assignment

Assignment link - https://docs.google.com/document/d/1WBGBD-HF_QHKgYC38hb7-pteO7v6I7_sB8O68Us_NhM/edit

# This is a simple CRUD API using in-memory mongodb and a custom load-balancer (using nodejs 'cluster' api)

# First run ----- npm i ------ to install all the dependencies

# Commands :

1. Testing (Using mocha and chai) - npm test
2. Development - npm run start:dev
3. Production - npm run start:prod
4. Load Balancer(Multiple instances) - npm run start:multi

# Load Balancer
This will create multiple instances running on consecutive ports and the main port will re-route the incoming requests to different worker instances using round-robin method and the state of database will remain consistent between different workers!
eg. 
- On `localhost:4000/api` load balancer is listening for requests
- On `localhost:4001/api`, `localhost:4002/api`, `localhost:4003/api`, `localhost:4004/api` workers are listening for requests from load balancer


Note- Since in-memory database is used, restarting will cause data loss.
