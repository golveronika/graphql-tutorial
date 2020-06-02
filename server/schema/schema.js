var  graphql  = require('graphql');

const  { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const Movies = require('../models/movie')
const Directors = require('../models/director')

// const movies = [
//     {id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1'},
//     {id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2'},
//     {id: 3, name: 'V for vendetta', genre: 'Triller', directorId: '3'},
//     {id: 4, name: 'Snach', genre: 'Comedy', directorId: '4'},
//     {id: 5, name: 'Hello', genre: 'Triller', directorId: '1'},
//     {id: 6, name: 'Film Film', genre: 'Crime', directorId: '1'},
//     {id: 7, name: 'Fuck', genre: 'Comedy', directorId: '4'},
// ]

// const directors = [
//     {id: '1', name: 'Quentin Tarantino', age: 55},
//     {id: '2', name: 'Michael Radford',age: 72},
//     {id: 3, name: 'James McTeigue', age: 51},
//     {id: 4, name: 'Guy Ritchie', age: 50},
// ]


// Схема
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id == parent.id)
                return Directors.findById(parent.directorId)
            }
        }
        
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        movies: {
            type: new GraphQLList(MovieType), // передаем тип - схема фильмов
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId == parent.id)
                return Movies.find({directorId: parent.id})

            }
        }
    })
})

//  Мутапция добавление режисера в БД 
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age,
                })
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                directorId: {type: GraphQLID}
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    age: args.age,
                    directorId: args.directorId,
                })
                return movie.save()
            }
        }
    }
}) 

// Корневой запрос чтобы получить данные 
// В нем описываем подзапросы (movie)
// resolve - метод( какие данные мы будем получать)
const Query = new GraphQLObjectType ({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // return movies.find(movie => movie.id == args.id)
                return Movies.findById(args.id)
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // return directors.find(director => director.id == args.id)
                return Directors.findById(args.id)

            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies
                return Movies.find({})
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors
                return Directors.find({})
            }
        }
    }

})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})

/*
{
  movie(id: "2") {
    id
    name
    genre
  }
}


// С переменными 

query($id: String) {
    movie(id: $id) {
        id
        name
        genre
  }
}

{
    "id": "3"
}

query ($id: ID) {
  movie(id: $id) {
    id
    name
    genre
    director {
      name
      age
    }
  }
}

query {
  movies {
    name
    genre
  }
}

query {
  directors {
    name
    movies {
      name
    }
  }
}




mutation($name: String, $age: Int) {
  addDirector(name: $name, age: $age) {
    name
    age
  }
}

{
  "name": "John",
  "age": 67
}

*/