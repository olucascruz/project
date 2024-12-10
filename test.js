const { createCsv, writeToCSV, readCsv } = require('./csvHandler.js');


// const path = "db/login.csv"
// const columns = ['username', 'password']
// const data = [
//     { username: "user123", password: 'senha123'}
// ];


// writeToCSV(path, columns, data)

const path = 'db/task.csv';
const columns = ['username', 'task']
const data = [
    { username: '', task: ''}
];

writeToCSV(path, columns, data)

async function getUsers(){
    return await readCsv('db/login.csv');
}

const users = getUsers();
let userExists = false;

users.then((v)=>{
    v.forEach((el)=>{
        console.log(el)
        if(el.username == 'user123' && el.password == 'senha123') 
            userExists = true
    })
    console.log(userExists)
})