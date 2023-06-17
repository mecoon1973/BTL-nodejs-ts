$("#city").on('blur', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/service/findHotel',
        method: 'POST',
        data: {
            city: $('#city').val()
        },
        xhrFields: {
            withCredentials: true
        },
        processData: true,
        success: function (data) {
            console.log(data)
            if (data.message) {
                $('#city').val(data.message)
            }

        }
    });
});


$('#Search').on('click', function (e) {
    e.preventDefault();
    var city = $('#city').val();
    var valMin = $('#valMin').val();
    var valMax = $('#valMax').val();

    $.ajax({
        url: '/service/findhotelcost' ,
        method: 'POST',
        data: {
            city: city, 
            valMin: valMin, 
            valMax: valMax
        },
        xhrFields: {
            withCredentials: true
        },
        processData: true,
        success: function (data) {
            $('.listResult').html(stringHotelDOM(data.hotel))
        },
    });
});

function stringHotelDOM(data){
    let strHotelDom = ''
    data.forEach(function(element) {
        strHotelDom += `
        <div class="searchItem">
                        <img src="${element.imgHotel}" alt="" class="siImg" />
                        <div class="siDesc">
                            <h1 class="siTitle">${element.nameHotel}</h1>
                            <span class="siDistance">${element.Address}</span>
                            <span class="siTaxiOp">${element.typeOf}</span>
                        </div>
                        <div class="siDetails">
                            <div class="siDetailTexts">
                                <span
                                    class="siPrice"
                                >${element.moneyForOneNight}đ</span>
                                <form

                                    action="/service/detailHotel/${element.id}"
                                    method="get"
                                    id="bookingHotels"
                                >
                                    <input
                                        type="hidden"
                                        value="${element.id}"
                                        class="idRoom"
                                    />
                                    <button
                                        class="siDetailButton"
                                        type="submit"
                                    >
                                            Xem chi tiết
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
        `
      })
    
    return strHotelDom
}