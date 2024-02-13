import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";

const client = new PrismaClient();

//typeDefs로 스키마 정의
const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int!, year: Int!): Movie
  }
`;

//resolvers로 데이터에 접근
const resolvers = {
  //query
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_, { id }) => client.movie.findUnique({ where: { id } }),
  },
  //add, update, delete
  Mutation: {
    createMovie: (_, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (_, { id }) => client.movie.delete({ where: { id } }),
    updateMovie: (_, { id, year }) =>
      client.movie.update({ where: { id }, data: { year } }),
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server
  .listen()
  .then(() => console.log("Server is running on http://localhost:4000/"));
