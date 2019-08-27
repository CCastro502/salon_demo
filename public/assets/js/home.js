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
        $(".salon-calendar").hide();
        $(".schedule-type-container").css({ marginLeft: '42vw' });
        $("#salon-select-artist").hide();
    } else {
        $("#walk").removeClass("active");
        $("#book").addClass("active");
        $(".salon-calendar").show();
        $(".schedule-type-container").css({ marginLeft: '150px' });
        $("#salon-select-artist").show();
    }
});

$(".service-card").on('click', function() {
    $('.service-card.active').removeClass('active');
    $(`.service-card:eq( ${$(".service-card").index(this)} )`).addClass("active");
    $(".appt-specifics").html(
        `<p>Color: </p>
        <select id='salon-color-select'>
            <option>This</option>
            <option>That</option>
            <option>This</option>
            <option>That</option>
        </select>
        <p>Style</p>
        <select id='salon-style-select'>
            <option>This</option>
            <option>That</option>
            <option>This</option>
            <option>That</option>
        </select>
        <button type='submit'>Book Now!</button>`
    )
})

setActive(0);