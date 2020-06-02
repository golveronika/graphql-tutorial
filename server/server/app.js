const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')

const app = express();

const schema = require('../schema/schema')

//--------------------
const PORT = 3005;

mongoose.connect('mongodb+srv://veronika:JE3tgN7AAofrztQ7@cluster0-hhmk4.mongodb.net/graphql-tutorial?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.on('open', () => console.log(`Connection to DB!`))

// graphqlHTTP - Это пакет, который позволяет нашему экспресс серверу использовать GraphQL API 
// middleware на определенном роуте

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));


app.listen(PORT, err => {
  err ? console.log(err) : console.log('Server started!');
});
