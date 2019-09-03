var db = require("../models");
var Sequelize = require('sequelize');
var moment = require('moment');
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var [year, monthNum, monthName, dayNum, dayName] = moment().format("YYYY MM MMM DD dddd").split(" ");
monthNum = parseInt(monthNum);
dayNum = parseInt(dayNum);
var logInKey = `${alphabet[monthNum - 1]}${monthNum}${alphabet[Math.abs(dayNum - monthNum - 13)]}${alphabet[monthNum]}-/${monthNum + 27}${alphabet[Math.abs(dayNum - 6)]}\-`;

module.exports = function (app) {
    app.post("/api/users", function (req, res) {
        if (req.body.isLoggingIn) {
            console.log("User is logging in");
            db.Users.findAll({ where: { username: req.body.data.username }})
            .then(function (result) {
                console.log(result);
                res.json({
                    success: 1,
                    logInKey: logInKey
                });
            }).catch(function (err) {
                res.json({ success: 0 });
            })
        } else {
            console.log("User is registering");
            db.Users.create({
                username: req.body.data.username,
                password: req.body.data.password
            }).then(function (result) {
                res.json({ 
                    success: 1,
                    logInKey: logInKey
                });
            }).catch(function (err) {
                res.json({ success: 0 });
            });
        }
        
    });

    app.post("/admin/isLoggedIn", function (req, res) {
        if (logInKey === req.body.logInKey) {
            res.json({
                success: 1,
                html: 
                `<div class='admin-nav'>
                    <h1 class='admin-nav-items active'>Shifts</h1>
                    <h1 class='admin-nav-items'>Employees</h1>
                </div>
                <div id='maintain'>
                    <p id='add-shifts'>Add Shifts</p>
                    <div class='admin-employee-calendar'></div>
                </div>
                <div class="modal" tabindex="-1" role="dialog" id='add_employee_modal'>
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Add New Employee</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <label for='employee_name'>
                                Name: <br />
                                    <input type='text' id='employee_name' name='employee_name' />
                                </label>
                                <br />
                                <br />
                                <label for='employee_location'>
                                Location: <br />
                                    <select id='employee_location' name='employee_location'>
                                        <option value='highlandsranch'>Highlands Ranch</option>
                                    </select>
                                </label>
                                <br />
                                <br />
                                <button type='submit' id='add_employee'>Hello</button>
                            </div>
                        </div>
                    </div>
                </div>`
            });
        } else {
            console.log("No success");
            res.json({
                success: 0,
            });
        }
    });

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/highlandsranch", function (req, res) {
        const lastDay = parseInt(moment().endOf('month').format('DD'));
        
        function getWeek() {
            var thisWeek = [];
            var thisDate;
            var nextMonth;

            if ( dayNum  + 7 > lastDay ) {
                nextMonth = moment(`${year} ${parseInt(monthNum) + 1 >= 10 ? parseInt(monthNum) + 1: `0${parseInt(monthNum) + 1}`}`, 'YYYY MM').format('MMM');
            }
            
            for (i = 0; i < 7; i++) {
                thisDate = parseInt(dayNum) + i;
                
                if ( thisDate > lastDay ) {
                    thisWeek = [
                        ...thisWeek, {
                            monthName: nextMonth,
                            date: thisDate - lastDay
                        }
                    ];
                } else {
                    thisWeek = [
                        ...thisWeek, 
                        {
                            monthName: monthName,
                            date: thisDate
                        }
                    ];
                }
            }

            return thisWeek;
        }

        res.render("highlandsranch", {
            days: getWeek()
        });

    });

    app.get("/highlandsranch/services", function (req, res) {
        res.render("services");
    })

    app.get("/highlandsranch/about", function (req, res) {
        res.render("about");
    })


    app.get("/highlandsranch/:num", function (req, res) {
        const lastDayThisMonth = parseInt(moment().endOf('month').format('DD'));
        const lastDayNextMonth = parseInt(moment(`${year} ${monthNum + 1 >= 10 ? monthNum + 1: `0${monthNum + 1}`}`, 'YYYY MM').endOf('month').format('DD'));
        
        
        function getWeek() {
            var lowerLimit = dayNum + (parseInt(req.params.num) * 7);
            var upperLimit = dayNum + 7 + (parseInt(req.params.num) * 7);
            var thisWeek = [];

            for (i = 0; i < 7; i++) {
                if (lowerLimit + i > lastDayThisMonth + lastDayNextMonth) {
                    thisWeek = [...thisWeek, {
                        monthName: moment(`${year} ${monthNum + 2 >= 10 ? monthNum + 2: `0${monthNum + 2}`}`, 'YYYY MM').format('MMM'),
                        date: (lowerLimit + i) - (lastDayThisMonth + lastDayNextMonth)
                    }]
                } else if (lowerLimit + i > lastDayThisMonth ) {
                    thisWeek = [...thisWeek, {
                        monthName: moment(`${year} ${monthNum + 1 >= 10 ? monthNum + 1: `0${monthNum + 1}`}`, 'YYYY MM').format('MMM'),
                        date: (lowerLimit + i) - (lastDayThisMonth)
                    }]
                } else {
                    thisWeek = [...thisWeek, {
                        monthName: monthName,
                        date: lowerLimit + i
                    }]
                }
            }

            return thisWeek;
        }

        res.json({ days: getWeek() });
    });

    app.get("/admin", function (req, res) {
        res.render("admin");
    });
}