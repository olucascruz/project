const http = require('http')
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { checkIfUserExists, createTask, getTasks, deleteTask, registerUser } = require('./csvHandler.js');


const server = http.createServer((req, res)=>{
    const SECRET_KEY = "wiusawndcaiuncuio"
    res.statusCode = 200;
    let filePath;
 

    let contentType = 'text/html'
    const routes = {
        '/':'index.html',
        '/todo':'todo.html'
    }
    if(req.method === 'GET'){
        
        if(routes[req.url]){
           filePath = path.join(`pages/${routes[req.url]}`)
        }
        else{
            let extname = path.extname(req.url);
            switch (extname) {
                case '.css':
                    contentType = 'text/css';
                    filePath = path.join(__dirname, req.url)

                    break;
                case '.js':
                    contentType = 'text/javascript';
                    filePath = path.join(__dirname, req.url)
                    break;
                
                default:
                    contentType = 'text/json';
                    break

            }
        }

        res.setHeader('Content-Type', contentType)
        if(filePath != undefined){
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                        res.write(data)
                        res.end()
                }
        })

        }else{
        if(req.url == '/task'){
            const token = req.headers['authorization']?.split(' ')[1];
            jwt.verify(token, SECRET_KEY, async (err, decoded) => {
                if (err) {
                    console.log(err)
                    res.writeHead(401, { 'Content-Type': 'text/plain' });
                    return res.end('Token inválido ou expirado');
                } else {
                    // Recuperando o username do token decodificado
                    const username = decoded.username;

                    let tasks = await getTasks()
                    console.log(tasks)

                    tasks = tasks.filter((t)=>{
                        return t.username == username
                    })
                    console.log(tasks)
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify(tasks));
                }
            });
        }
        }
    }
    
    if(req.method === 'POST'){
            let body = ''
            let parsedBody = ''
            req.on('data', (chunk)=>{
                body += chunk.toString()
            })

            req.on('end', ()=>{
                try {
                    // Parse do body assumindo JSON
                    parsedBody = JSON.parse(body);
                    console.log('Dados recebidos:', parsedBody);
                } catch (err) {
                    // Lidar com erro no parsing
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Erro no formato do body!');
                }
            console.log(req.url)
            if(req.url == '/login'){
                let IsLoginOk = false;
                    try{
                    IsLoginOk = checkIfUserExists(parsedBody.username, parsedBody.password);
                    }catch(err){
                        console.log(err);
                    }
                    IsLoginOk.then((IsOk)=>{
                        console.log(`After function ${IsOk}`);
                        if(IsOk){
                            const token = jwt.sign(
                                { username: parsedBody.username }, 
                                SECRET_KEY, 
                                { expiresIn: '1h' }
                            );

                            res.writeHead(200, { 'Content-Type': 'application/json'});

                            res.end(JSON.stringify({ token }));
                        }
                        else{
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Login incorreto!' }));
                        }
                    })
            } 

            else if(req.url =='/register'){
                registerUser(parsedBody.username, parsedBody.password)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Usuário criado'}));
            }

            else if(req.url == '/task'){
                const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'
                console.log(req.headers['authorization'])
                jwt.verify(token, SECRET_KEY, (err, decoded) => {
                    if (err) {
                        console.log(err)
                        res.writeHead(401, { 'Content-Type': 'text/plain' });
                        return res.end('Token inválido ou expirado');
                    } else {
                        // Recuperando o username do token decodificado
                        const username = decoded.username;
                        console.log(decoded)
                        console.log('Username:', username); // Aqui está o username enviado no token
                        createTask(username, parsedBody.task)
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Acesso permitido', username }));
                    }
                });
            }   
            })
    }
    if(req.method === 'DELETE'){
        console.log(req.url)
        
        if(req.url.startsWith('/task')){
            const id = req.url.split('/')[2]
            deleteTask(id)
        }
    }
    
    
})

const PORT = 3000;
server.listen(PORT, ()=>{
    console.log('Servidor rodando em: http://localhost:3000')
})