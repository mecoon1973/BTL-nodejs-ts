$("#resetForm").on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        method: $(this).attr('method'),
        data: { username: $('.Username').val() },
        xhrFields: {
            withCredentials: true
        },
        processData: true,
        success: function (data) {
            console.log(data)
            var error = document.querySelectorAll(".error-text");
            for (var i = 0; i < error.length; i++) {
                error[i].innerHTML = "";
            }
            if (data.message) {
                $('.password_err').text(data.message)
            }
            else if (data.url) {
                window.location.href = data.url;
            }
        }
    });
});