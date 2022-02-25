const { gql } = require('apollo-server');

const typeDefs = gql`
  type assignee {
    value: Int
    label: String
  }
  type requester{
    value: String
    label: String
  }
  type tag{
    value: String
  }
  type priority{
    value: String
    label: String
    level : Int
  }
  type company{
    label: String
    value: Float
  }
  type Query{
    assignee(label: String!): assignee
    assignees : [assignee]
    requester(label: String!) : requester
    requesters : [requester]
    tag(label: String!) : tag
    tags : [tag]
    priority(label: String!) : priority
    priorities : [priority]
    company(label: String!) : company
    companies : [company]
  }
  input assigneeInput {
    value: Int
    label: String
  }
  input requesterInput{
    value: Int
    label: String
  }
  input tagInput{
    value: Int
    label: String
  }
  input priorityInput{
    value: Int
    label: String
    level : Int
  }
  type Mutation{
    createAssignee(input: assigneeInput) : assignee
  }

`

module.exports =  typeDefs;