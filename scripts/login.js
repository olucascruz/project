const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form')
const responseMessage = document.getElementById('response-message')

const loginDiv = document.getElementById('login-content');
const registerDiv = document.getElementById('register-content')

const linkLogin = document.getElementById('link-login')
const linkRegister = document.getElementById('link-register')



function switchForm(){
    if (!loginDiv.classList.contains('hidden')) {
        linkLogin.classList.add('hidden');
        loginDiv.classList.add('hidden');  // Adiciona a classe 'hidden'
    } else {
        loginDiv.classList.remove('hidden');
        linkLogin.classList.remove('hidden');
       }
    if (!registerDiv.classList.contains('hidden')) {
        registerDiv.classList.add('hidden');  // Adiciona a classe 'hidden'
        linkRegister.classList.add('hidden');  

    } else {
        registerDiv.classList.remove('hidden');  // Remove a classe 'hidden'
        linkRegister.classList.remove('hidden');

    }
}


linkRegister.addEventListener('click', switchForm);
linkLogin.addEventListener('click', switchForm);


registerForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const formData = new FormData(registerForm); // Coleta os dados do formulário
    const data = Object.fromEntries(formData.entries()); // Transforma em objeto

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            switchForm()
        }
    }catch(err){
        console.log(err)
    }

})

loginForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const formData = new FormData(loginForm); // Coleta os dados do formulário
    const data = Object.fromEntries(formData.entries()); // Transforma em objeto

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.log(response)
            throw new Error('Erro ao enviar o formulário');
        }

        const result = await response.json(); // Supondo que o servidor retorna JSON
        let token = result.token;
    
        if(token){
            window.location.href = '/todo';
        }
        localStorage.setItem('jwt', token);
        responseMessage.textContent = `Resposta do servidor: OK`;
    } catch (error) {
        responseMessage.textContent = `Erro: ${error.message}`;
    }

})

