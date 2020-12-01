
const MongoClient = require('mongodb').MongoClient;
let _db = 'digitalmanipur'
// #VWq4R8%DP$Nkh+
const uri = "mongodb+srv://dm_user1:ZPYuuH2RCnIqPw1c@cluster0mumbai-9savz.mongodb.net/"+_db+"?retryWrites=true&w=majority";
console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true });
const mongoConnect = (callback) => {
    MongoClient.connect(uri)
    .then( client => {
        console.log('DB connected');
        // _db = client.db(_db);
        callback();
    })
    .catch(e=> {
        console.log(e);
    });
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found';
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });