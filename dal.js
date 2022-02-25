const { MongoClient } = require('mongodb');
let db = null
async function connect(){
  // Get MongoDB info
    const uri = process.env.MONGO_URL;
    const client = new MongoClient(uri);
    try {
        await client.connect()
        listDatabases(client)
        db = client.db("integration")
    } catch (e) {
        console.error(e)
    } 
}
connect()

async function listDatabases(client){
  const databaseList = await client.db().admin().listDatabases();
  console.log("databases:",databaseList.databases)
}

function getAll(query){
  return new Promise((resolve,reject)=>{
    console.log(`get ALL running in ${query}`)
    const all = db.collection(`${query}`)
      .find({})
      .toArray(function(err,docs){
        console.log("docs:",docs)
        err ? reject(err) : resolve(docs)
      })
  })
}

function getOne(label, query){
  return new Promise((resolve,reject)=>{
    console.log(`get ONE running in ${query}`)
    console.log("label",label)
    const one = db.collection(`${query}`)
      .findOne({label : {$eq:label}},function(err,doc){
        console.log("found", doc)
        if(doc){
            err ? reject(err) : resolve(doc)
        }else{
            doc = {name:`Account doesn't exist!`}
            err ? reject(err) : resolve(doc)
        }   
      })
  })
}
function createAssignee(input){
  return new Promise((resolve,reject)=>{
    const collection = db.collection('assignees')
  })
}

module.exports = {getAll, getOne, createAssignee}