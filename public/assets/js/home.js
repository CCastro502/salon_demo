function setActive(dayOfWeek) {
    $('.salon-calendar-day.active').removeClass('active');
    $(`.salon-calendar-day:eq( ${dayOfWeek} )`).addClass("active");
}

$(".salon-calendar .salon-calendar-day").on('click', function () {
    setActive($(".salon-calendar .salon-calendar-day").index(this));
});

$(".schedule-type").on('click', function () {
    if ( $(".schedule-type").index(this) == 1 ) {
        $("#walk").addClass("active");
        $("#book").removeClass("active");
        $(".salon-calendar-container").hide();
        $(".schedule-type-container").css({ marginLeft: '42vw' });
        $("#salon-select-artist").hide();
    } else {
        $("#walk").removeClass("active");
        $("#book").addClass("active");
        $(".salon-calendar-container").show();
        $(".schedule-type-container").css({ marginLeft: '150px' });
        $("#salon-select-artist").show();
    }
});

setActive(0);