# API-Node-Mongo-Passport
A simple Node.js API. Users are created and stored in a local database using Mongo, and they are authenticated using Passport and Passport-LocalAPIKey.

This application is a simple "TODO" list API, and users interact with the API using API keys. 

Users sign up with a simple form using [Passport](http://passportjs.org/) with a [Passport-Local](https://github.com/jaredhanson/passport-local) strategy to store username/passwords in a MongoDB via [Mongoose](https://github.com/Automattic/mongoose). Passwords are encrypted using [BCrypt](https://github.com/ncb000gt/node.bcrypt.js). API Keys are auto generated using [Hat](https://github.com/substack/node-hat). API Keys are authenticated using a [Passport-LocalAPIKey](https://github.com/cholalabs/passport-localapikey) strategy, which is also stored in the MongoDB.

There is also a lock-out period for a large number of failed login attempts. This is configued in the User model (both time and number of attempts are configurable).

Once users have logged in they will be presented with their dashboard. The dashboard displays their API Key which they can then use to interact with the TODO API.

###Credit where credit is due:

Password authentication was influenced heavily by [dev/smash's Password authentication with Mongoose and bcrypt](http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt).

TODO API heavily influenced by [Adrian Mejia's Creating RESTful APIs With NodeJS and MongoDB](http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/)
