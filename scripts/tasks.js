const taskForm = document.getElementById('task-form')
const ulTasks = document.getElementById('tasks-list')
let tasks = null

function addEventToDeleteButton(){
    const deleteButtons = document.querySelectorAll('.delete-button')
    if(!deleteButtons){
        console.log("no delete buttons")
        return
    } 
    deleteButtons.forEach((deleteButton)=>{
        deleteButton.addEventListener('click',async ()=>{
            const token = localStorage.getItem('jwt');
            const deleteId = deleteButton.id.split('-')[2]
            tasks = tasks.filter((task)=>{return task.id != deleteId})
            writeListTasks(tasks)

            const response = await fetch(`/task/${deleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`},
            });
        })

    })
}
async function getTasks(){
        const token = localStorage.getItem('jwt');
        
        const response = await fetch('/task', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`},
        });

        console.log(response)
        if (!response.ok) {
            console.log("entrou no nao ok")
            window.location.href = '/';
            throw new Error('Erro ao enviar o formulário');
        }
        console.log('TASKS')
        tasks = await response.json()
        writeListTasks(tasks)
}

function writeListTasks(tasks){
    const uniqueTasks = tasks.filter((task, index, self) =>
        index === self.findIndex((t) => t.id === task.id)
    );

    ulTasks.innerHTML = '';
    uniqueTasks.forEach((task) => {
        const li = document.createElement('li'); 
        const p = document.createElement('p')
        const button = document.createElement('button')
        p.textContent = task.task;
        button.textContent = "o"
        ulTasks.appendChild(li);
        li.appendChild(p)
        li.appendChild(button) 

        button.classList.add('delete-button')
        button.id = `delete-button-${task.id}`
    });
    addEventToDeleteButton();
}






async function createTask(e){
    e.preventDefault();
    
    const formData = new FormData(taskForm); // Coleta os dados do formulário
    const data = Object.fromEntries(formData.entries()); // Transforma em objeto
    const token = localStorage.getItem('jwt');
    
    const response = await fetch('/task', {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    
    getTasks();
}


taskForm.addEventListener('submit',(e)=>createTask(e))
getTasks()
