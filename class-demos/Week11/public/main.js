window.onload = () =>{
    const socket = io();

    const form = document.getElementryById('form')
    const input = document.getElementById('input')

    form.addEventListener('submit', (event)=>{
        event.preventDefault()
        socket.emit('silly note', input.value);

        input.value = '' //removes the input text after submission 
    })

    socket.on('server sent data', (dataFromServer)=>{
        const item = document.createElement('p')
        item.textContent = dataFromServer
        const messages = document.getElementById('all-messages');
        messages.appendChild(item)
    });
}