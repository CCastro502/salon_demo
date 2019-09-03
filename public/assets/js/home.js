var count = 0;

function setActive(dayOfWeek) {
    $('.salon-calendar-day.active').removeClass('active');
    $(`.salon-calendar-day:eq( ${dayOfWeek} )`).addClass("active");
}

function calendarManager() {    
    
    if (count > 0) {
        $("#prev-week").css({ display: 'initial' });
    } else if (count === 0) {
        $("#prev-week").css({ display: 'none' })
    }
    if (count >= 5) {
        $("#next-week").css({ display: 'none' });
    } else if (count >= 0) {
        $("#next-week").css({ display: 'initial' });
    }

    $.ajax(`/highlandsranch/${count}`, {
        type: "GET"
    }).then(function(response) {
        var week = response.days;
        console.log("week", week);
        var newCalendar = "";
        for (i = 0; i < week.length; i++) {
            console.log("for loop");
            if (i === 0) {
                newCalendar += `<div class='salon-calendar-day active'>
                <h3>${week[i].monthName}</h3>
                <h3>${week[i].date}</h3>
                </div>`;
            } else {
                newCalendar += `<div class='salon-calendar-day'>
                <h3>${week[i].monthName}</h3>
                <h3>${week[i].date}</h3>
                </div>`;
            }
            
        }
        $(".salon-calendar").html(newCalendar);
    }).catch(function (err) {
        console.log("err", err);
    });

    
}

$(".salon-calendar").on('click', '.salon-calendar-day', function () {
    setActive($(".salon-calendar .salon-calendar-day").index(this));
});

$(".schedule-type").on('click', function () {
    if ( $(".schedule-type").index(this) == 1 ) {
        $("#walk").addClass("active");
        $("#book").removeClass("active");
        $(".salon-calendar-container").hide();
        $(".schedule-type-container").css({ marginLeft: '42vw' });
        $(".salon-schedule-bottom-box").find('div').first().hide();
    } else {
        $("#walk").removeClass("active");
        $("#book").addClass("active");
        $(".salon-calendar-container").show();
        $(".schedule-type-container").css({ marginLeft: '150px' });
        $(".salon-schedule-bottom-box").find('div').first().show();
    }
});

$(".salon-calendar-container a").on('click', function () {
    if ( $(".salon-calendar-container a").index(this) == 1 ) {
        count++;
    } else {
        count--;
    }
    calendarManager();
});

$('.salon-schedule-bottom-box').on('click', '.salon-schedule-bottom-row .add-service', function() {
    $(this).closest('.salon-schedule-bottom-row').after(
        `<div class='salon-schedule-bottom-row'>
            <div class='adj-service add-service'>+</div>
            <div class='adj-service del-service'>-</div>
            <select class='salon-select' value="0">
                <option value="0">Pedicure</option>
                <option value="1">Manicure</option>
                <option value="2">Gels</option>
                <option value="3">Shellac</option>
                <option value="4">Painting</option>
            </select>
            <select class='salon-select' value="0">
                <option value="0">Classic</option>
                <option value="1">Spa</option>
                <option value="2">French</option>
                <option value="3">Athletic</option>
                <option value="4">Stone</option>
            </select>
        </div>`
    );
});

$('.salon-schedule-bottom-box').on('click', '.salon-schedule-bottom-row .del-service', function() {
    $(this).closest('.salon-schedule-bottom-row').remove();
});

setActive(0);