var socket = io()
var adjacentSend = false
var adjacentReceive = false

if ($('#emailUser').val() != undefined) {
    socket.emit('userLogin', $('#emailUser').val())
}

socket.on('userOnline', (data) => {
    $('#socketUser').val(data)
})

$('#form-send').on('submit', (e) => {
    e.preventDefault()
    adjacentReceive = false
    if (adjacentSend) {
        $('.message').append(`<div class="contentSender ">${$('#user-input').val()}</div>`)
    } else {
        $('.message').append(`<div class="sender">${$('#nameUser').val()}</div>
                                <div class="contentSender ">${$('#user-input').val()}</div>`)
    }
    socket.emit('sendMessage', {
        message: $('#user-input').val(),
        socketUser: $('#socketUser').val(),
        userName: $('#nameUser').val()
    })
    adjacentSend = true
    $('#user-input').val('')
})
socket.on('receiveMessages', (data) => {
    adjacentSend = false
    if (adjacentReceive) {
        $('.message').append(`<div class="contentReceive ">${data.message}</div>`)
    } else {
        $('.message').append(`<div class="receive">admin</div>
                                <div class="contentReceive ">${data.message}</div>`)
    }
    $('#socketUser').val(data.socketUser)
    adjacentReceive = true
    console.log(data)
})