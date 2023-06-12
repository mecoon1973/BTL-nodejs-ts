$(document).on('submit', '#bookingHotels', function (e) {
    e.preventDefault();
    var form = $(this);
    var idRoom = form.find('.idRoom').val();
    var countPerson = $('#countPerson').val();
    var countChilden = $('#countChilden').val();
    var countRoom = $('#countRoom').val();
    var dateBegin = $('#dateBegin').val();
    var dateEnd = $('#dateEnd').val();

    $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: {
            countPerson: countPerson,
            countChilden: countChilden,
            countRoom: countRoom,
            dateBegin: dateBegin,
            dateEnd: dateEnd,
            idRoom: idRoom
        },
        xhrFields: {
            withCredentials: true
        },
        processData: true,
        success: function (data) {
            if (data.url) {
                window.location.href = data.url;
            }
        },
    });
});