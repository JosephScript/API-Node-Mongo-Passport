# API-Node-Mongo-Passport
A simple Node.js API. Users are created and stored in a local database using Mongo, and they are authenticated using Passport and Passport-LocalAPIKey.

This application is a simple "TODO" list API. Users interact with the API using API keys. Users sign up with a simple form using Passport to store local username/passwords. Passwords are encrypted using BCrypt. API Keys are auto generated using Hat.

There is also a lock-out period for a large number of failed login attempts. This is configued in the User model (both time and number of attempts are configurable).

Once users have logged in they will be presented with their dashboard. The dashboard displays their API Key which they can then use to interact with the TODO API.
