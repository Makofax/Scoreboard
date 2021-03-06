function generatePlayers(players, playerScore, playerAvatar) {
    //checks if player exisists, if not skip generating player
    for (let index = 8; index <= players.length; index++) {
        if (players[index] == " ") { continue; }
        $(".player-container >:nth-last-child(2)").clone().attr({
            id: `player ${index +1}`,
            class: `players def-player${index +1}`
        }).insertBefore($(".player-container").find(">:last-child"));
        $(`.player-container > [id='player ${index +1}'] `).children('div.edit').attr("id", `edit ${index +1}`);
    }
    for (var i = 0; i < players.length; i++) {
        $(`.def-player${i+1} > .avatar`).html(`<i class="fa fa-user" style="font-size:25px;color:rgb(${playerAvatar[i][0]}, ${playerAvatar[i][1]}, ${playerAvatar[i][2]})"></i>`);
        $(`.def-player${i+1} > .name`).html(players[i]);
        $(`.def-player${i+1} > .score`).html(playerScore[i]);
    }

}

function removePlayers(players, playerScore, playerAvatar) {
    //removes empty players if they dont exist
    $('.player-container > .players').each(function() {
        if ($(this).children(`div.name`).is(':empty') || $(this).children(`div.name`).text() == " ") {
            $(this).children(`div.name`).parent().remove();

        }
    });
    //removes player entierly by clicking the corresponding remove button
    $(".player-container").on('click', '.remove-button', function() {
        var value = ($(this).attr("id").split(" ")[1] * 1) - 1;
        $(`.def-player${value+1}`).remove();
        var index = players.indexOf(players[value]);
        if (index !== -1) {
            players[index] = "";
            playerScore[index] = "";
            playerAvatar[index] = "";
        }
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('player-score', JSON.stringify(playerScore));
        localStorage.setItem('player-avatar', JSON.stringify(playerAvatar));
    });

}
//funciton for using the colorwheel
function colorPicker() {
    var cw = Raphael.colorwheel($("#color-wheel .colorwheel")[0], 150),
        onchange_el = $("#color-wheel .onchange"),
        ondrag_el = $("#color-wheel .ondrag");
    cw.color("#00F");
    $("#RGBcolor").css('color', `rgb(${cw.color().r},${cw.color().g},${cw.color().b})`);

    function start() { ondrag_el.show() }

    function stop() { ondrag_el.hide() }

    cw.ondrag(start, stop);
    cw.onchange(function(color) {
        var colors = [parseInt(color.r), parseInt(color.g), parseInt(color.b)]
        onchange_el.css("background", color.hex).text("RGB:" + colors.join(", "))
        $("#RGBcolor").css('color', "rgb(" + colors.join(", ") + ")");
    })

}

$(document).ready(function() {
    //resets admin toggle
    $('input[type="checkbox"]').prop('checked', false);

    //default players that are generated
    var defaultPlayerNameArr = ["Jack", "David", "John", "Michael", "Robert", "William", "Joseph", "Charles"];
    var players = localStorage.getItem('players'),
        playerScore = localStorage.getItem('player-score'),
        playerAvatar = localStorage.getItem('player-avatar');

    //checks if array exists, if not creates new one
    var players = (players) ? JSON.parse(players) : Array(8).fill().map((v, i) => defaultPlayerNameArr[i]),
        playerScore = (playerScore) ? JSON.parse(playerScore) : Array(8).fill().map((v, i) => 1 + Math.floor(Math.random() * 20)),
        playerAvatar = (playerAvatar) ? JSON.parse(playerAvatar) : Array(8).fill(null).map(() => Array(3).fill().map((v, i) => 1 + Math.floor(Math.random() * 255)));
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('player-score', JSON.stringify(playerScore));
    localStorage.setItem('player-avatar', JSON.stringify(playerAvatar));
    generatePlayers(players, playerScore, playerAvatar);

    removePlayers(players, playerScore, playerAvatar);

    var clicked;
    var boolToggle = true;
    //sorts player by points
    $(".player-container").on('click', '.player-score', function() {
        boolToggle = !boolToggle;

        //compares each element and sorts based on points
        var numericalOrderedDivs = $(".players").sort(function(a, b) {
            var a = $(a).find(".score").text(),
                b = $(b).find(".score").text(),
                inEquality = boolToggle ? (a.localeCompare(b, false, { numeric: true })) : (b.localeCompare(a, false, { numeric: true }));
            return inEquality;
        });

        //generates ascending or descending icon
        boolToggle ? $(".player-score").html('Score<i class="fa fa-sort-desc"></i>') : $(".player-score").html('Score<i class="fa fa-sort-asc"></i>')
        $(".player-name").html('<div class="lable-name">Name</div>');

        //insert sorted elements after header
        var Firstchild = $(".player-container").find(">:first-child")
        $(".player-container  ").html(numericalOrderedDivs);
        Firstchild.insertBefore(numericalOrderedDivs[0]);

        //insert back add button
        !$('input[type="checkbox"]:checkbox:checked').length > 0 ?
            $(".player-container").append('<div class="add"><button type="button" class="add-button btn btn-sm btn-info" style="font-size:15px;display: none;">Add <i class="fa fa-pencil-square" ></i></button>') :
            $(".player-container").append('<div class="add"><button type="button" class="add-button btn btn-sm btn-info" style="font-size:15px;">Add <i class="fa fa-pencil-square" ></i></button>');

    });
    //sorts player by name
    $(".player-container").on('click', '.player-name', function() {
        boolToggle = !boolToggle;

        //compares each element and sorts based on points
        var alphabeticallyOrderedDivs = $(".players").sort(function(a, b) {
            var a = $(a).find(".name").text(),
                b = $(b).find(".name").text(),
                inEquality = boolToggle ? (a.localeCompare(b, false)) : (b.localeCompare(a, false));
            return inEquality;
        });

        //generates ascending or descending icon
        boolToggle ? $(".player-name").html('<div class="lable-name">Name</div><i class="fa fa-sort-desc"></i>') : $(".player-name").html('<div class="lable-name">Name</div><i class="fa fa-sort-asc"></i>')
        $(".player-score").html("Score");

        //insert sorted elements after header
        var Firstchild = $(".player-container").find(">:first-child")
        $(".player-container  ").html(alphabeticallyOrderedDivs);
        Firstchild.insertBefore(alphabeticallyOrderedDivs[0]);
        //insert back add button
        !$('input[type="checkbox"]:checkbox:checked').length > 0 ?
            $(".player-container").append('<div class="add"><button type="button" class="add-button btn btn-sm btn-info" style="font-size:15px;display: none;">Add <i class="fa fa-pencil-square" ></i></button>') :
            $(".player-container").append('<div class="add"><button type="button" class="add-button btn btn-sm btn-info" style="font-size:15px;">Add <i class="fa fa-pencil-square" ></i></button>');


    });
    //add and remove button show if you are admin
    $('.admin').click(function() {
        $(".remove , .edit , .add-button").toggle(this.checked);
    });

    $(".player-container").on('click', '.add-button', function() {

        var name = $("#name");
        var points = $("#points");
        var colorWheel = $("#RGBcolor");
        clicked = $(this).attr("id");
        var lastChild = players.length;

        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: "auto",
            width: "auto",
            modal: true,
            create: function() {
                //validation of the input fields
                $("#form-dialog").validate({
                    rules: {
                        name: {
                            required: true,
                            lettersonly: true,
                            maxlength: 12 //max length for name
                        },
                        points: {
                            required: true,
                            nowhitespace: true,
                            digits: true,
                            maxlength: 4 //max length for points
                        }
                    },
                    messages: {
                        name: {
                            required: "name is required",
                            lettersonly: "only Letters allowed",
                            maxlength: "too many characters"
                        },
                        points: {
                            required: "point is required",
                            nowhitespace: "no spaces allowed",
                            digits: "only numbers allowed",
                            maxlength: "too many characters"
                        }
                    }
                });
            },
            buttons: {
                "Confirm": function() {
                    if ($("#form-dialog").valid()) {
                        colorInRGB = colorWheel.css("color").split(/\D/).filter(v => v != ''); //split into numbers then remove empty array items
                        nameToUppercase = name.val().charAt(0).toUpperCase() + name.val().slice(1) //first letter to uppercase

                        players.push(nameToUppercase);
                        playerScore.push(points.val());
                        playerAvatar.push(colorInRGB);

                        //generates new player with given information
                        var newPlayer = $('<div class="players def-player8" id="player 8 "><div class="avatar"><i class="fa fa-user" style="font-size:25px;color:rgb(189, 17, 12)"></i></div><div class="name">Charles</div><div class="score">14</div><div class="edit remove-button " id="edit 8" "><button type="button" class="btn btn-sm btn-info" style="font-size:10px">Remove <i class="fa fa-times-circle"></i></button></div></div>');
                        newPlayer.attr({ id: `player ${lastChild+1}`, class: `players def-player${lastChild+1}` }).insertBefore($(".player-container").find(">:last-child"));
                        $(`[id='player ${lastChild+1}'] > .name`).html(nameToUppercase)
                        $(`[id='player ${lastChild+1}'] > .score`).html(points.val())
                        $(`[id='player ${lastChild+1}'] > .avatar`).html(`<i class="fa fa-user" style="font-size:25px;color:rgb(${colorInRGB[0]}, ${colorInRGB[1]}, ${colorInRGB[2]})"></i>`)
                        $(`[id='player ${lastChild+1}'] > .edit`).attr("id", `edit ${lastChild +1}`);
                        localStorage.setItem('players', JSON.stringify(players));
                        localStorage.setItem('player-score', JSON.stringify(playerScore));
                        localStorage.setItem('player-avatar', JSON.stringify(playerAvatar));


                        dialog.dialog("close");
                    }
                },
                Cancel: function() { dialog.dialog("close"); }
            },
            close: function() {
                $('.colorwheel > ').remove();
                form[0].reset();
            }
        });
        form = dialog.find("form").on("submit", function(event) {
            event.preventDefault();
            dialog.dialog("close");
        });
        colorPicker();
        dialog.dialog("open");


    });
});