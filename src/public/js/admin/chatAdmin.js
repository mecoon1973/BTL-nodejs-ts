var socket = io()
var adjacentSend = false
var adjacentReceive = false
var arrsocket = []
if ($('#emailUser').val() != undefined) {
    socket.emit('userLogin', $('#emailUser').val())
}

socket.on('checkReloadUserChat', (data) => {
    arrsocket.forEach(function (item) {
        if (item.id == data.idUser) {
            item.socketid = data.socketUser
        }
    })
})

$('#form-send').on('submit', (e) => {
    e.preventDefault()
    adjacentReceive = false
    if (adjacentSend) {
        $(`.${$('#idUserChat').val()}`).append(`<div class="contentSender ">${$('#user-input').val()}</div>`)
    } else {
        $(`.${$('#idUserChat').val()}`).append(`<div class="sender">admin</div>
                            <div class="contentSender ">${$('#user-input').val()}</div>`)
    }
    socket.emit('sendMessage', {
        message: $('#user-input').val(),
        socketUser: $('#socketUser').val(),
        userName: 'admin'
    })
    adjacentSend = true
    $('#user-input').val('')
})
socket.on('receiveMessages', (data) => {
    adjacentSend = false
    if (arrsocket.some((item) => {
        if (item.id === data.idUser) {
            if (item.socketid !== data.socketUser)
                item.socketid = data.socketUser
            return item.id === data.idUser
        }
        return false
    })) {
        if (adjacentReceive) {
            $(`.${data.idUser}`).append(`<div class="contentReceive ">${data.message}</div>`)
        } else {
            $(`.${data.idUser}`).append(`<div class="receive">${data.userName}</div>
                                <div class="contentReceive ">${data.message}</div>`)
        }

    } else {
        arrsocket.push({ id: data.idUser, socketid: data.socketUser })
        $('.listUser').append(`<div class="nameUser" id="${data.idUser}"> <h5>${data.userName} </h5> </div>`)
        $('.listMessage').append(` <div class="message ${data.idUser}">
                                        <div class="receive">${data.userName}</div>
                                        <div class="contentReceive ">${data.message}</div>  
                                    </div> `)

        windowchat(data.idUser)
        changeColor('50e076', data.idUser)
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
    var idUser = $(this).attr('id')
    arrsocket.forEach(function (item) {
        if (item.id == idUser) {
            console.log(item.socketid)
            $('#socketUser').val(item.socketid)
            $('#idUserChat').val(item.id)
        }
    })
    changeColor('50e076', idUser)
    windowchat(idUser)

})