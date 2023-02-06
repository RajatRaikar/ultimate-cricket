const lokijs = require("lokijs");

const DB_NAME = "db.json";
const DB_PATH = 'data';

const db = new lokijs(`${DB_PATH}/${DB_NAME}`, { autosave: true, persistenceMethod: 'fs' });




const test = async () => {

//     const a = db.loadDatabase({}, () => {
//         // resolve(db.getCollection('users'));
//         var users = db.getCollection("users");
//         users.insert({
//             name: 'Odin-',
//             age: 50,
//             address: 'Asgard'
//         });      });
   
//     // var users = db.getCollection("users")
// console.log(a, '---');
db.deleteDatabase()
}

// users.insert({
//     name: 'Odin-1',
//     age: 50,
//     address: 'Asgard'
// });


//   const b =db.getCollection('users');
// console.log(b);

test()