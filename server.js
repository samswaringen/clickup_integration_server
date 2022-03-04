const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const { buildSchema, assertInputType } = require('graphql');
const cors = require('cors');
var dal = require('./dal.js')
const typeDefs = require('./schema.js')
const jwt = require('jsonwebtoken')
var bodyParser = require("body-parser")
var jsonParser = bodyParser.json()



let port = process.env.PORT || 9001;

const accessSecret = process.env.ACCESS_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

const authenticateJWT = (req, res, next) => {
  console.log("headers:", req.headers)
  let authHeader = req.headers.authorization.split(" ")[1]
  if (authHeader) {
      jwt.verify(authHeader, accessSecret, (err, username, role)=>  {
          if(err){
              console.log("error", err)
               return res.sendStatus(403)
          }
          req.username = username;
          req.role = role
          next();
      });
  } else {
      res.sendStatus(401);
  }
}

const getRole = (token)=>{
  let userRole;
  jwt.verify(token, accessSecret, (err, role)=>  {
      if(err){
          console.log("error", err)
           return res.sendStatus(403)
      }
      userRole = role
  })
  return userRole
}



var resolvers = {
  Query: {
    async assignees(parent, args, context, info){
      if(context.user.role === "user"){
        let assignees = await dal.getAll("assignees")
        return assignees 
      }else{
        return
      }
    },
    async tags(parent, args, context, info){
      if(context.user.role === "user"){
        let tags = await dal.getAll("tags")
        return tags 
      }else {
        return
      }  
    },
    async requesters(parent, args, context, info){
      if(context.user.role === "user"){
        let requesters = await dal.getAll("requesters")
        return requesters   
      }else {
        return
      }
    },
    async priorities(parent, args, context, info){
      if(context.user.role === "user"){
        let priorities = await dal.getAll("priorities")
        return priorities   
      }else {
        return
      }
    },
    async companies(parent, args, context, info){
      if(context.user.role === "user"){
        let companies = await dal.getAll("companies")
        return companies 
      }else{
        return
      }
    },
    async assignee(parent, args, context, info){
      if(context.user.role === "user"){
        let assignee = await dal.getOne(args.label,"assignees")
        return assignees   
      }else {
        return
      }
    },
    async tag(parent, args, context, info){
      if(context.user.role === "user"){
        let tag = await dal.getOne(args.label,"tags")
        return tag   
      }else {
        return
      }
    },
    async requester(parent, args, context, info){
      if(context.user.role === "user"){
        let requester = await dal.getOne(args.label,"requesters")
        return requester  
      }else {
        return
      }
    },
    async priority(parent, args, context, info){
      if(context.user.role === "user"){
        let priority = await dal.getOne(args.label,"priorities")
        return priority   
      }else {
        return
      }
    },
    async company(parent, args, context, info){
      if(context.user.role === "user"){
        let company = await dal.getOne(args.label,"companies")
        return company 
      }else {
        return
      }
    }
  },
  Mutation: {
    async createAssignee(parent, args, context, info){
      if(context.user.role === "user"){
        const {input} = args
        let account = await dal.createAssignee(input)
        return account
      }else {
        return
      }
  },
  }
}



var server=null;
const startServer = async()=>{
  server  = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => {
      let token = req.headers.authorization.split(" ")[1]
      let user = getRole(token)
      return {user}
    }
  })  
  await server.start()
   const allowedOrigins = ['https://d3h0owdjgzys62.cloudfront.net']
  let options =  {
    origin: allowedOrigins
  }
  const app = express();
  app.use(cors(options))
  app.use(express.static('public'));
  server.applyMiddleware({ app: app, authenticateJWT });
  app.listen({ port: port },()=>{
      console.log("listening on port:9001")
  })

  app.post('/login', jsonParser, async (req, res) => {
    const { apiKey } = req.body;
    let key = process.env.API_KEY
    // generate an access token
    if(apiKey === key){
      const accessToken = jwt.sign({ role: "user" }, accessSecret, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ role: "user" }, refreshSecret);
      res.json({
          accessToken,
          refreshToken
      });
    }else{
      res.send("No permission to access!")
    }
  });

}

startServer()
