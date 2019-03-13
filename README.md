# Code Walkthrough – Comments API

This is the code from a Mastery Monday episode about using [Bob Martin's Clean Architecture model](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) to build a Micro Service in Node.js.

Watch the episode below:

## Prerequisites
* [Git](https://git-scm.com/downloads)
* [Node JS](https://nodejs.org/en/)
* [Mongo DB](https://www.mongodb.com)
* [Azure Content Moderator account (free)](https://contentmoderator.cognitive.microsoft.com)

## Getting started

#### 1. Clone the repo and install dependencies
```bash
git clone 
cd comments-api
npm i
```

#### 2. Modify the .env file
Add your database details and your Content Moderator API key to the `.env` file.

#### 3. Startup your MongoDB
Usually this is just: `mongod` on the command line.

#### 4. Start the server
```bash
npm start
```