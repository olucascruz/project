const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


const formattedHeaders = (header)=>{ 
    return header.map((column) => (
    {
    id: column,
    title: column,
    }
));
}


function createCsv(path, header, isDelete = false){
    console.log(header)
    const fileExists = fs.existsSync(path)
    const isAppend = fileExists && !isDelete
    const csvWriter = createCsvWriter({
        path: path, // Caminho do arquivo CSV de saída
        header:header,
        append: isAppend,
    }, );
    return csvWriter
}
/**
 * Lê um arquivo CSV e retorna os dados como uma lista de objetos
 * @param {string} path - Caminho para o arquivo CSV
 * @param {list<string>} header - Colunas na tabela
 * @param {Array<Object>} data - Linhas na tabela 
 * @returns {Promise<Array<Object>>} - Dados do CSV em formato de array de objetos
 */
function writeToCSV(path, header, data, rewrite = false){
    const headerObj = formattedHeaders(header);
    const csvWriter = createCsv(path, headerObj, rewrite);
    csvWriter
    .writeRecords(data)
    .then(() => console.log('CSV gravado com sucesso!'));
}


/**
 * Lê um arquivo CSV e retorna os dados como uma lista de objetos
 * @param {string} filePath - Caminho para o arquivo CSV
 * @returns {Promise<Array<Object>>} - Dados do CSV em formato de array de objetos
 */
function readCsv(filePath) { 
    if (!fs.existsSync(filePath)) return []
    
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => {
                console.log('Leitura do CSV concluída!');
                resolve(results);
            })
            .on('error', (err) => {
                console.error('Erro ao ler o CSV:', err);
                reject(err);
            });
    });    
}


async function registerUser(user, password) {
    const path = "db/login.csv"
    const columns = ['username', 'password']
    const data = [
        { username: user, password: password}
    ];


    writeToCSV(path, columns, data)
}

async function getUsers(){
    return await readCsv('db/login.csv');
}


async function checkIfUserExists(user, pass){
    const users = await getUsers()
    console.log('users') 
    console.log(users)
    let userExists = false
    users.forEach((el)=>{
            console.log(el)
            if(el.username == user && el.password == pass) 
                userExists = true
        })
        return userExists    
}


async function getTasks(){
    return await readCsv('db/task.csv');
}


function generateRandomId() {
    return Math.floor(100000 + Math.random() * 900000);
}


function createTask(username, task){
    let numTasks = 0;
    numTasks = generateRandomId();

    const path = 'db/task.csv';
    const columns = ['id', 'username', 'task'];
    const data = [
        {id:numTasks, username: username, task: task}
    ];

    writeToCSV(path, columns, data)
}


async function deleteFromCSV(filePath, idToDelete) {
    try {
        // Ler os dados do CSV
        const data = await readCsv(filePath);

        // Filtrar para excluir o item com o ID especificado
        const filteredData = data.filter(row => row.id !== String(idToDelete));

        // Reescrever o arquivo com os dados filtrados
        const headers = Object.keys(data[0] || {}); // Usa os headers do primeiro item
        await writeToCSV(filePath, headers, filteredData, rewrite=true);

        console.log(`Linha com ID ${idToDelete} removida com sucesso.`);
    } catch (error) {
        console.error('Erro ao deletar do CSV:', error);
    }
}


function deleteTask(id){
    deleteFromCSV('db/task.csv',id)
}


module.exports = {
    createCsv,
    writeToCSV,
    readCsv,
    checkIfUserExists,
    getTasks,
    createTask,
    deleteTask,
    registerUser
};