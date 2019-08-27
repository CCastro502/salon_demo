$(document).ready(function() {
    var logInKey = sessionStorage.getItem("SalonDemo_IsLoggedIn");
    if (logInKey) {
        $.ajax("/admin/isLoggedIn", {
            type: "POST",
            data: { logInKey: logInKey }
        }).then(function(response) {
            if (response.success) {
                $("#admin").html(response.html);
                return;
            } else {
                window.location.href = window.location.origin;
            }
        }).catch(function (err) {
            console.log("err", err)
        })
    } else {
        $("#admin").html(
            `<div id='login_container'>
                <form id='admin_login'>
                    <label for='username'>
                    Username: <br />
                        <input type='text' id='username' name='username' />
                    </label>
                    <br />
                    <br />
                    <label for='password'>
                    Password: <br />
                        <input type='text' id='password' name='password' />
                    </label>
                    <br />
                    <br />
                    <input type='submit' />
                </form>
                <a id='register_user'>Register new Admin</a>
            </div>
            <div class="modal" tabindex="-1" role="dialog" id='register_modal'>
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title">Create New Admin</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <form id='admin_register'>
                            <label for='username'>
                            Username: <br />
                                <input type='text' id='register_username' name='register_username' />
                            </label>
                            <br />
                            <br />
                            <label for='password'>
                            Password: <br />
                                <input type='text' id='register_password' name='register_password' />
                            </label>
                            <br />
                            <br />
                            <input type='submit' />
                        </form>
                    </div>
                </div>
                </div>
            </div>`
        );
    };

    $('#register_user').on('click', function() {
        $('#register_modal').modal();
    });

    $('#admin_register').on('submit', function(event) {
        event.preventDefault();
        var newUser = {
            data: {
                username: $("#register_username").val(),
                password: $("#register_password").val()
            },
            isLoggingIn: 0
        }
        if (newUser.data.username && newUser.data.password) {
            $.ajax('/api/users/create', {
                type: "POST",
                data: newUser
            }).then(function(response) {
                if (response.success) {
                    logInKey = response.logInKey;
                    sessionStorage.setItem("SalonDemo_IsLoggedIn", logInKey);
                    alert("You've successfully registered, you now have admin priveledges :)");
                    $('#register_modal').modal('dispose');
                    window.location.reload();
                } else {
                    alert("You have picked an invalid username and/or password.")
                    window.location.reload();
                }
            });
        } else {
            alert("Unable to register user");
        }
    });

    $('#admin_login').on('submit', function(event) {
        event.preventDefault();
        var newUser = {
            data: {
                username: $("#username").val(),
                password: $("#password").val()
            },
            isLoggingIn: 1
        }
        if (newUser.data.username && newUser.data.password) {
            $.ajax('/api/users', {
                type: "POST",
                data: newUser
            }).then(function(response) {
                console.log("response", response);
                if (response.success) {
                    logInKey = response.logInKey;
                    sessionStorage.setItem("SalonDemo_IsLoggedIn", logInKey);
                    alert("You have logged in");
                    $('#register_modal').modal('dispose');
                    window.location.reload();
                } else {

                }
            });
        } else {
            alert("You did not enter a username and/or password");
        }
    });
});