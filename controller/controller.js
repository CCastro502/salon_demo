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
                `<div id='admin-nav'>
                    <div class='admin-nav-item active' id='nav-shifts'>
                        <h3>Shifts</h3>
                    </div>
                    <div class='admin-nav-item' id='nav-employees'>
                        <h3>Employees</h3>
                    </div>
                </div>
                <div id='maintain-shifts'>
                    <p id='add-shifts'>Add Shifts</p>
                </div>`
            });
        } else {
            console.log("No success");
            res.json({
                success: 0,
            });
        }
    })

    app.get("/", function (req, res) {
        res.render("index")
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

    })

    // app.get("/highlandsranch/:num", function (req, res) {
    //     const lastDayThisMonth = parseInt(moment().endOf('month').format('DD'));
    //     const lastDayNextMonth = parseInt(moment(`${year} ${parseInt(monthNum) + 1 >= 10 ? parseInt(monthNum) + 1: `0${parseInt(monthNum) + 1}`}`, 'YYYY MM').endOf('month').format('DD'));
        
    //     for (i = 0; i < 7; i++) {

    //     }
    // })

    app.get("/admin", function (req, res) {
        res.render("admin");
    })
}