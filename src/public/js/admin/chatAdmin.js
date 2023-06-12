var socket = io()
var adjacentSend = false
var adjacentReceive = false
var arrsocket = []
if ($('#emailUser').val() != undefined) {
    socket.emit('userLogin', $('#emailUser').val())
}

socket.on('userOnline', (data) => {
    $('#socketUser').val(data)
})

$('#send-button').on('click', () => {
    adjacentReceive = false
    if (adjacentSend) {
        $(`.${$('#socketUser').val()}`).append(`<div class="contentSender ">${$('#user-input').val()}</div>`)
    } else {
        $(`.${$('#socketUser').val()}`).append(`<div class="sender">${$('#nameUser').val()}</div>
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

    if (arrsocket.includes(data.socketUser)) {
        if (adjacentReceive) {
            $(`.${data.socketUser}`).append(`<div class="contentReceive ">${data.message}</div>`)
        } else {
            $(`.${data.socketUser}`).append(`<div class="receive">${data.userName}</div>
                                <div class="contentReceive ">${data.message}</div>`)
        }

    } else {
        arrsocket.push(data.socketUser)
        $('.listUser').append(`<div class="nameUser" id="${data.socketUser}"> <h5>${data.userName} </h5> </div>`)
        $('.listMessage').append(` <div class="message ${data.socketUser}">
                                        <div class="receive">${data.userName}</div>
                                        <div class="contentReceive ">${data.message}</div>  
                                    </div> `)

        windowchat(data.socketUser)
        changeColor('50e076', data.socketUser)
    }

    adjacentReceive = true

})

function changeColor(data, id) {
    $('.nameUser').map(function () {
        if (id == $(this).attr('id'))
            $(this).css('background-color', data)
        else $(this).css('background-color', '#fff')
    })
}
function windowchat(sockChat) {
    $('.message').map(function () {
        $(this).hide()
    })
    $(`.${sockChat}`).show()
}

$(document).on('click', '.nameUser', function () {
    var socketid = $(this).attr('id')
    $('#socketUser').val(socketid)
    changeColor('50e076', socketid)
    windowchat(socketid)

})