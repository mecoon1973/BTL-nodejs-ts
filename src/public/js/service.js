$("#textSearch").on('blur', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/service/findHotel',
        method: 'POST',
        data: {
            city: $('#textSearch').val()
        },
        xhrFields: {
            withCredentials: true
        },
        processData: true,
        success: function (data) {
            console.log(data)
            if (data.message) {
                $('#textSearch').val(data.message)
            }

        }
    });
});


const decreaseButton1 = document.querySelector('.buttonG1')
const increaseButton1 = document.querySelector('.buttonT1')
const decreaseButton2 = document.querySelector('.buttonG2')
const increaseButton2 = document.querySelector('.buttonT2')
const decreaseButton3 = document.querySelector('.buttonG3')
const increaseButton3 = document.querySelector('.buttonT3')
const counterNumber1 = document.querySelector('.optionCounterNumber1')
const counterNumber2 = document.querySelector('.optionCounterNumber2')
const counterNumber3 = document.querySelector('.optionCounterNumber3')
const headerSearchTextUser = document.querySelector('.headerSearchTextUser')
const options = document.querySelector('.options')

var count1 = 1
var count2 = 0
var count3 = 1
$('#countPerson').val(count1)
$('#countChilden').val(count2)
$('#countRoom').val(count3)
decreaseButton1.addEventListener('click', () => {
    if (count1 == 1) {
        return
    }
    count1--
    counterNumber1.textContent = count1
    $('#countPerson').val(count1)
    headerSearchTextUser.textContent = count1 + " người lớn · " + count2 + " trẻ con · " + count3 + " phòng"

})

increaseButton1.addEventListener('click', () => {
    count1++
    counterNumber1.textContent = count1
    $('#countPerson').val(count1)
    headerSearchTextUser.textContent = count1 + " người lớn · " + count2 + " trẻ con · " + count3 + " phòng"
})

decreaseButton2.addEventListener('click', () => {
    if (count2 == 0) {
        return
    }
    count2--
    counterNumber2.textContent = count2
    $('#countChilden').val(count2)
    headerSearchTextUser.textContent = count1 + " người lớn · " + count2 + " trẻ con · " + count3 + " phòng"

})

increaseButton2.addEventListener('click', () => {
    count2++
    counterNumber2.textContent = count2
    $('#countChilden').val(count2)
    headerSearchTextUser.textContent = count1 + " người lớn · " + count2 + " trẻ con · " + count3 + " phòng"
})

decreaseButton3.addEventListener('click', () => {
    if (count3 == 1) {
        return
    }
    count3--
    counterNumber3.textContent = count3
    $('#countRoom').val(count3)
    headerSearchTextUser.textContent = count1 + " người lớn · " + count2 + " trẻ con · " + count3 + " phòng"

})

increaseButton3.addEventListener('click', () => {
    count3++
    counterNumber3.textContent = count3
    $('#countRoom').val(count3)
    headerSearchTextUser.textContent = count1 + " người lớn · " + count2 + " trẻ con · " + count3 + " phòng"
})



const dateBegin = document.querySelector('#dateBegin');
const dateEnd = document.querySelector('#dateEnd');
dateBegin.addEventListener('input', (event) => {
    dateEnd.min = event.target.value;
});


var closeWindow = true
headerSearchTextUser.addEventListener('click', () => {
    if (closeWindow) {
        options.style.display = "block";
        closeWindow = false
    }
    else {
        options.style.display = "none";
        closeWindow = true
    }
})