const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const { buildSchema, assertInputType } = require('graphql');
const cors = require('cors');
var dal = require('./dal.js')
const typeDefs = require('./schema.js')



let port = process.env.PORT || 9001;


var resolvers = {
  Query: {
    async assignees(parent, args, context, info){
      let assignees = await dal.getAll("assignees")
      return assignees   
    },
    async tags(parent, args, context, info){
      let tags = await dal.getAll("tags")
      return tags   
    },
    async requesters(parent, args, context, info){
      let requesters = await dal.getAll("requesters")
      return requesters   
    },
    async priorities(parent, args, context, info){
      let priorities = await dal.getAll("priorities")
      return priorities   
    },
    async companies(parent, args, context, info){
      let companies = await dal.getAll("companies")
      return companies 
    },
    async assignee(parent, args, context, info){
      let assignee = await dal.getOne(args.label,"assignees")
      return assignees   
    },
    async tag(parent, args, context, info){
      let tag = await dal.getOne(args.label,"tags")
      return tag   
    },
    async requester(parent, args, context, info){
      let requester = await dal.getOne(args.label,"requesters")
      return requester  
    },
    async priority(parent, args, context, info){
      let priority = await dal.getOne(args.label,"priorities")
      return priority   
    },
    async company(parent, args, context, info){
      let company = await dal.getOne(args.label,"companies")
      return company 
    }
  },
  Mutation: {
    async createAssignee(parent, args, context, info){
      const {input} = args
      let account = await dal.createAssignee(input)
      return account
  },
  }
}



var server=null;
const startServer = async()=>{
  server  = new ApolloServer({ typeDefs, resolvers})  
  await server.start()
 
  const app = express();
  app.use(cors())
  app.use(express.static('public'));
  server.applyMiddleware({ app: app });
  app.listen({ port: port },()=>{
      console.log("listening on port:9001")
  })
}

startServer()
