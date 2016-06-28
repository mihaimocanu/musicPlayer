
//______________________VARIABLES DEFINITON______________________________
//general
var lGain_player = [];
var hGain_player = [];
var mGain_player = [];
var sum_player = [];
var lPass_player = [];
var hPass_player = [];
var pPass_player = [];
var volumeNodes = [];
var freqFilter_player = [];

var context_player = null;
var audioRecordNode = null;
var mediaElement_player = [];
var source_player = [];
var sourceNode_player = [];
var files_player = [];
var player_playlist = [];

var player0playlistId = null;
var player1playlistId = null;

var files0ToUpload = [];
var files1ToUpload = [];

var files0ToRemove = [];
var files1ToRemove = [];

var currentUploadedFileIndex = 0;

var audioRecorder;
//______________________END VARIABLES DEFINITON_______________________

//______________________PLAYLIST METHODS______________________________
//opens popup when "Load playlist" button is pressed and loads the data in it
function playlistLoadPopup() {
    //$.magnificPopup.open({
    //    items: {
    //        src: '#popup-form',
    //    },
    //    type: 'inline',
    //    preloader: false,
    //    focus: '#name',

    //    callbacks: {
    //        beforeOpen: function () {
    //            if ($(window).width() < 700) {
    //                this.st.focus = false;
    //            } else {
    //                this.st.focus = '#name';
    //            }
    //        }
    //    }
    //});
    ////bind close method for the pop-up
    //$(document).on('click', '.popup-modal-dismiss', function (e) {
    //    e.preventDefault();
    //    $.magnificPopup.close();
    //});
    $("#modalWindowContent").empty();

    //populate the pop-up with the playlists list
    $.ajax({
        type: "GET",
        url: "/Home/GetPlaylistList",
        success: function (result) {

            var htmlContent = "";

            htmlContent += "<div class=\"modal-header\">";
            htmlContent += "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";
            htmlContent += "    <h4 class=\"modal-title\" id=\"myModalLabel1\">Load Playlists</h4>";
            htmlContent += "</div>";
            htmlContent += "<div class=\"modal-body\">";

            if (result.length == 0) {
                htmlContent += "There are no saved playlists";
            }
            else {

                htmlContent += "<table>";
                    
                
                for (var i = 0; i < result.length; i++) {
                    htmlContent += "<tr>";
                    htmlContent += "<td class=\"cel1\">";
                    htmlContent += "<button type=\"button\" class=\"btn btn-info\" onclick=\"loadPlaylist('0','" + result[i].id + "')\" >1</button>";
                    htmlContent += "</td>";
                    htmlContent += "<td class=\"cel2\">";
                    htmlContent += "<button type=\"button\" class=\"btn btn-warning\" onclick=\"loadPlaylist('1','" + result[i].id + "')\" >2</button>";
                    htmlContent += "</td>";
                    htmlContent += "<td class=\"cel3\">" + result[i].name + "</td>";
                    htmlContent += "<td class=\"cel4\">";
                    htmlContent += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"deletePlaylist('" + result[i].id + "')\" > DELETE </button>";
                    htmlContent += "</td>";
                    htmlContent += "</tr>";
                    

                    //htmlContent += "<div class=\"playlist-description\" style=\"padding: 7px; border: solid; border-width: 2px;\">";
                    //htmlContent += "<div class=\"playlist-load-buttons\">";
                    //htmlContent += "Load to:";
                    //htmlContent += "<input type=\"button\" value=\"Playere 1\" onclick=\"loadPlaylist('0','" + result[i].id + "')\" />";
                    //htmlContent += "<input type=\"button\" value=\"Playere 2\" onclick=\"loadPlaylist('1','" + result[i].id + "')\" />";
                    //htmlContent += "</div>";
                    //htmlContent += "Name: " + result[i].name;
                    //htmlContent += "<div class=\"playlist-delete-button\">";
                    //htmlContent += "<input type=\"button\" value=\"Delete\" onclick=\"deletePlaylist('" + result[i].id + "')\" />";
                    //htmlContent += "</div>";
                    //htmlContent += "</div>";
                }
                htmlContent += "</table>";
            }
            $("#modalWindowContent").append(htmlContent);
            htmlContent += "</div>";
            $('#modalWindow').modal('show');
        },
        error: function (error) {
            //$.magnificPopup.close();
            $('#modalWindow').modal('hide');
            alert('Error while getting data: ' + error.statusText);
            console.log(error.responseText);
        }
    });
}

//get playlist songs 
function loadPlaylist(player, playlistId) {
    $.ajax({
        type: "GET",
        url: "/Home/GetPlaylistData",
        data: { playlistId: playlistId },
        success: function (result) {
            if (player == "0") {
                player0playlistId = playlistId;
            }
            else {
                player1playlistId = playlistId;
            }
            loadPlaylistData(player, result);
            $('#modalWindow').modal('hide');
            //$.magnificPopup.close();
        },
        error: function (error) {
            $('#modalWindow').modal('hide');
            //$.magnificPopup.close();
            alert('Error while getting data: ' + error.statusText);
            console.log(error.responseText);
        }
    });
}

//actualy loads the playlsit items to the players playlist
function loadPlaylistData(player, result) {
    player_playlist[player].remove();

    var playlistItems = [];
    for (var i = 0; i < result.length; i++) {
        playlistItems.push({
            title: (result[i].name.length > 50 ? (result[i].name.substring(0, 50) + "...") : result[i].name),
            name: result[i].name,
            mp3: result[i].path,
            id: result[i].id
        });
    }
    player_playlist[player].setPlaylist(playlistItems);
}

//open the popup when saving playlists and populates it
function playlistSavePopup(player) {
    //$.magnificPopup.open({
    //    items: {
    //        src: '#popup-form',
    //    },
    //    type: 'inline',
    //    preloader: false,
    //    focus: '#name',

    //    callbacks: {
    //        beforeOpen: function () {
    //            if ($(window).width() < 700) {
    //                this.st.focus = false;
    //            } else {
    //                this.st.focus = '#name';
    //            }
    //        }
    //    }
    //});
    ////bind close method for the pop-up
    //$(document).on('click', '.popup-modal-dismiss', function (e) {
    //    e.preventDefault();
    //    $.magnificPopup.close();
    //});

    //$('#modal2').modal('show');

    var htmlContent = "";
    $("#modalWindow2Content").empty();

    htmlContent += "<div class=\"modal-header\">";
    htmlContent += "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";
    htmlContent += "    <h4 class=\"modal-title\" id=\"myModalLabel1\">Save Playlists</h4>";
    htmlContent += "</div>";
    htmlContent += "<div class=\"modal-body\">";

    //if (result.length == 0) {
    //    htmlContent += "There are no saved playlists";
    //}

    if (player_playlist[player].playlist.length == 0) {
        htmlContent += "There are no items in the playlist";
        htmlContent += "</div>";
        $("#modalWindow2Content").append(htmlContent);
        $('#modal2').modal('show');
    }
    else {
        //get the playlists data and create the html needed to store them -> add the html to the needed place
        $.ajax({
            type: "GET",
            url: "/Home/GetPlaylistList",
            success: function (result) {

                htmlContent += "<div class=\"modal2Block initBlock\">";
                htmlContent += "<button type=\"button\" class=\"btn btn-success btn-lg btn-block btnActionSave\">SAVE</button>";
                htmlContent += "<button type=\"button\" class=\"btn btn-warning btn-lg btn-block btnActionUpdate\">UPDATE</button>";
                htmlContent += "<button type=\"button\" class=\"btn btn-default btn-lg btn-block\" data-dismiss=\"modal\">CANCEL</button>";
                htmlContent += "</div>";

                htmlContent += "<div class=\"modal2Block saveBlock\">";
                htmlContent += "<form class=\"form-horizontal\">";
                htmlContent += "<div class=\"form-group\">";
                htmlContent += "<label for=\"newPlaylistName\" class=\"col-sm-4 control-label\">Name</label>";
                htmlContent += "<div class=\"col-sm-8\">";
                htmlContent += "<input type=\"text\" class=\"form-control\" id=\"playlistName\" placeholder=\"Playlist name\">";
                htmlContent += "</div>";
                htmlContent += "</div>";
                htmlContent += "<div class=\"modal-footer\">";
                htmlContent += "<button type=\"button\" class=\"btn btn-default btnCancelSaving\"" +/* data-dismiss=\"modal\"*/ ">Cancel</button>";
                htmlContent += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"savePlaylist(" + player + ")\" >Save changes</button>";
                htmlContent += "</div>";
                htmlContent += "</form>";
                htmlContent += "</div>";
                htmlContent += "<div class=\"modal2Block updateBlock\">";
                htmlContent += "<form class=\"form-horizontal\">";
                htmlContent += "<div class=\"form-group\">";
                htmlContent += "<label for=\"existingPlaylistName\" class=\"col-sm-4 control-label\">Existing playlist</label>";
                htmlContent += "<div class=\"col-sm-8\">";
                htmlContent += "<select class=\"form-control\" id=\"playlist-select\">";
                htmlContent += "<option value=\"0\">Choose Existing Playlist</option>";
                for (var i = 0; i < result.length; i++) {
                    htmlContent += "<option value=\"" + result[i].id + "\">" + result[i].name + "</option>";
                }
                //htmlContent += "<option>Playlist name 2</option>";
                //htmlContent += "<option>Playlist name 3</option>";
                //htmlContent += "<option>Playlist name 4</option>";
                //htmlContent += "<option>Playlist name 5</option>";
                htmlContent += "</select>";
                
                htmlContent += "</div>";
                htmlContent += "</div>";
                htmlContent += "<div class=\"modal-footer\">";
                htmlContent += "<button type=\"button\" class=\"btn btn-default btnCancelSaving\"" +/* data-dismiss=\"modal\"*/ ">Cancel</button>";
                htmlContent += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"updatePlaylist(" + player + ")\">Update playlist</button>";
                htmlContent += "</div>";
                htmlContent += " </form>";
                htmlContent += "</div>";

                htmlContent += "</div>";
                
                $("#modalWindow2Content").append(htmlContent);

                $(".btnActionSave").on("click", function () {
                    $('.modal2Block').hide();
                    $('.modal-footer').show();
                    $('.saveBlock').show();
                });
                $(".btnActionUpdate").on("click", function () {
                    $('.modal2Block').hide();
                    $('.modal-footer').show();
                    $('.updateBlock').show();
                });
                $(".btnCancelSaving").on("click", function () {
                    $('.modal2Block').show();
                    $('.modal-footer').hide();
                    $('.updateBlock').hide();
                    $('.saveBlock').hide();
                });
                $("#modal").on('hidden.bs.modal', function () {
                    $(this).data('bs.modal', null);
                    $('#modal2 .saveBlock,#modal2 .updateBlock, #modal2  .modal-footer').hide();
                    $('.initBlock').show();
                });

                $('#modal2').modal('show');


                //var htmlContent = "";
                //htmlContent += "<div id=\"update-content\" ";
                //if (result.length == 0) {
                //    htmlContent += "style=\"display:none\"";
                //}
                //htmlContent += ">Overwrite existing playlist:";
                //htmlContent += "<select id=\"playlist-select\">";
                //htmlContent += "<option value=\"0\">Choose Existing Playlist</option>";
                //for (var i = 0; i < result.length; i++) {
                //    htmlContent += "<option value=\"" + result[i].id + "\">" + result[i].name + "</option>";
                //}

                //htmlContent += "</select>";
                //htmlContent += "<div>";
                //htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                //htmlContent += "<span>Update playlist</span>";
                //htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"updatePlaylist(" + player + ")\">";
                //htmlContent += "</div>";
                //htmlContent += "</div>";
                //htmlContent += "</div>";
                //htmlContent += "<div id=\"save-content\" ";
                //if (result.length > 0) {
                //    htmlContent += "style=\"display:none\"";
                //}
                //htmlContent += ">Name:";
                //htmlContent += "<input type=\"text\" id=\"playlistName\" style=\"color: #000000;\" />";
                //htmlContent += "<div>";
                //htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                //htmlContent += "<span>Save playlist</span>";
                //htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"savePlaylist(" + player + ")\">";
                //htmlContent += "</div>";
                //htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                //htmlContent += "<span>Cancel</span>";
                //htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"goTo('update');\">";
                //htmlContent += "</div>";
                //htmlContent += "</div>";
                //htmlContent += "</div>";

                //htmlContent += "<div id=\"option-button\" ";
                //if (result.length == 0) {
                //    htmlContent += "style=\"display:none\"";
                //}
                //htmlContent += ">";
                //htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                //htmlContent += "<span>Save New Playlist</span>";
                //htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"goTo('save');\">";
                //htmlContent += "</div>";
                //htmlContent += "</div>";

                //$("#popup-content").append(htmlContent);
            },
            error: function (error) {
                //$.magnificPopup.close();
                $('#modal2').modal('hide');
                alert('Error while getting data: ' + error.statusText);
                console.log(error.responseText);
            }
        });
    }

}

//navigation between save and update playlist functionality
function goTo(place) {
    if (place == 'save') {
        $("#update-content").css("display", "none");
        $("#option-button").css("display", "none");

        $("#save-content").css("display", "block");
    }
    else {
        $("#update-content").css("display", "block");
        $("#option-button").css("display", "block");

        $("#save-content").css("display", "none");
    }
}

//method that saves a new playlist
function savePlaylist(player) {
    if ($.trim($("#playlistName").val()).length === 0) {
        alert("The playlist must have a name!");
    }
    else {
        var files = $("#audio_file_player" + player).prop('files');
        if (window.FormData !== undefined) {

            $.ajax({
                type: "POST",
                url: "/Home/CreatePlaylist",
                data: { name: $("#playlistName").val() },
                success: function (result) {
                    //console.log(result);
                    if (player == "0") {
                        player0playlistId = result;
                    }
                    else {
                        player1playlistId = result;
                    }
                    //update existing files
                    $.each(player_playlist[player].playlist, function (i, item) {
                        if (item.id >= 0) {
                            //Copy the old file to the new playlist
                            $.ajax({
                                type: "POST",
                                url: "/Home/CopyPlaylistItem",
                                data: { playlistId: result, itemId: item.id },
                                success: function (result) {
                                },
                                error: function (error) {
                                    alert('Error while updating data: ' + error.statusText);
                                    console.log(error.responseText);
                                }
                            });
                        }
                    });

                    //upload the new ones
                    uploadRawFile(player, result);

                },
                error: function (error) {
                    alert('Error while creating the playlist: ' + error.statusText);
                    console.log(error.responseText);
                }
            });
        }
        else {
            alert("Youre browser doesn't support HTML5 file uploads! Please update your browser!");
        }
    }
}

//method that updates the playlist
function updatePlaylist(player) {
    if ($("#playlist-select").val() == "0") {
        alert("You must select a playlist first!");
    }
    else {
        var filesToRemove = null;
        var filesToUpload = null;
        var currentPlaylistId = null;
        if (player == "0") {
            filesToRemove = files0ToRemove;
            currentPlaylistId = player0playlistId;
        }
        else {
            filesToRemove = files1ToRemove;
            currentPlaylistId = player1playlistId;
        }
        if (currentPlaylistId == null)
        {
            currentPlaylistId = -1;
        }
        //copy the remaining items from the previous playlist
        $.ajax({
            type: "POST",
            url: "/Home/UpdatePlaylistFiles",
            data: {
                newPlaylistId: $("#playlist-select").val(),
                oldPlaylistId: currentPlaylistId,
                removedItemsList: filesToRemove
            },
            success: function (result) {
                if (player == "0") {
                    player0playlistId = $("#playlist-select").val().toString();
                    files0ToRemove = [];
                }
                else {
                    player1playlistId = $("#playlist-select").val().toString();
                    files1ToRemove = [];
                }
            },
            error: function (error) {
                alert('Error while removing unneeded items: ' + error.statusText);
                console.log(error.responseText);
            }
        });

        //upload added files
        uploadRawFile(player, $("#playlist-select").val());
    }
}

//method that adds the selected files to the webplayers playlist
function uploadFile(player) {
    var files;
    var uploadedFiles = $("#audio_file_player" + player).prop('files');

    var playlistItems = [];
    for (var i = 0; i < uploadedFiles.length; i++) {
        player_playlist[player].add({
            title: (uploadedFiles[i].name.length > 50 ? (uploadedFiles[i].name.substring(0, 50) + "...") : uploadedFiles[i].name),
            name: uploadedFiles[i].name,
            mp3: URL.createObjectURL(uploadedFiles[i]),
            id: "-1"
        });
    }
};

//deletes a playlist
function deletePlaylist(playlistId) {
    $.ajax({
        type: "POST",
        url: "/Home/DeletePlaylist",
        data: { playlistId: playlistId },
        success: function (result) {
            //if (player == "0") {
            //    player0playlistId = playlistId;
            //}
            //else {
            //    player1playlistId = playlistId;
            //}
            //loadPlaylistData(player, result);
            //$.magnificPopup.close();
            $('#modalWindow').modal('hide');
        },
        error: function (error) {
            $('#modalWindow').modal('hide');
            //$.magnificPopup.close();
            alert('Error while deleting data: ' + error.statusText);
            console.log(error.responseText);
        }
    });
}


//______________________END PLAYLIST METHODS__________________________

//______________________SOUND PROCESS_________________________________

//method called to inilialize the audio EQ nodes
function addEqualiser() {

    var gainDb = -40.0; // atenuation When it takes a positive value it is a real gain, when negative it is an attenuation. It is expressed in dB, has a default value of 0 and can take a value in a nominal range of -40 to 40.
    var bandSplit = [360, 3600];
    context_player = new AudioContext();

    for (var i = 0; i < 2; i++) {

        mediaElement_player.push(null);
        sourceNode_player.push(null);
        source_player.push(null);
        lGain_player.push(null);
        mGain_player.push(null);
        hGain_player.push(null);
        sum_player.push(null);
        volumeNodes.push(null);


        mediaElement_player[i] = document.getElementById('jp_audio_' + i);
        source_player[i] = context_player.createMediaElementSource(mediaElement_player[i]);

        initFrequencyQuality(i);

        // affects the ammount of treble in a sound - treble knob - atenuates the sounds below the 3600 frequencies
        var lBand_player = context_player.createBiquadFilter();
        lBand_player.type = "lowshelf";
        lBand_player.frequency.value = bandSplit[1];
        lBand_player.gain.value = gainDb;

        // affects the ammount of bass in a sound - bass knob - atenuates the sounds higher than 360 frequencies
        var hBand_player = context_player.createBiquadFilter();
        hBand_player.type = "highshelf";
        hBand_player.frequency.value = bandSplit[0];
        hBand_player.gain.value = gainDb;

        var hInvert_player = context_player.createGain();
        hInvert_player.gain.value = -1.0;

        //Subtract low and high frequencies (add invert) from the source for the mid frequencies
        var mBand_player = context_player.createGain();

        //or use picking
        //mBand_player = context_player.createBiquadFilter();
        //mBand_player.type = "peaking";
        //mBand_player.frequency.value = bandSplit[0];
        //mBand_player.gain.value = gainDb;

        var lInvert_player = context_player.createGain();
        lInvert_player.gain.value = -1.0;

        sourceNode_player[i].connect(lBand_player);
        sourceNode_player[i].connect(mBand_player);
        sourceNode_player[i].connect(hBand_player);

        hBand_player.connect(hInvert_player);
        lBand_player.connect(lInvert_player);

        hInvert_player.connect(mBand_player);
        lInvert_player.connect(mBand_player);


        lGain_player[i] = context_player.createGain();
        mGain_player[i] = context_player.createGain();
        hGain_player[i] = context_player.createGain();

        lBand_player.connect(lGain_player[i]);
        mBand_player.connect(mGain_player[i]);
        hBand_player.connect(hGain_player[i]);

        sum_player[i] = context_player.createGain();
        lGain_player[i].connect(sum_player[i]);
        mGain_player[i].connect(sum_player[i]);
        hGain_player[i].connect(sum_player[i]);

        lGain_player[i].gain.value = 1;
        mGain_player[i].gain.value = 1;
        hGain_player[i].gain.value = 1;

        volumeNodes[i] = context_player.createGain();
        sum_player[i].connect(volumeNodes[i]);
        volumeNodes[i].connect(context_player.destination);
    }

    //set  volume
    var x = 50 / 100;
    // Use an equal-power crossfading curve:
    var gain1 = Math.cos(x * 0.5 * Math.PI);
    var gain2 = Math.cos((1.0 - x) * 0.5 * Math.PI);
    volumeNodes[0].gain.value = gain1;
    volumeNodes[1].gain.value = gain2;

    //create audio Recording node
    audioRecordNode = context_player.createGain();
    volumeNodes[0].connect(audioRecordNode);
    volumeNodes[1].connect(audioRecordNode);
    audioRecorder = new Recorder(audioRecordNode);
}

//method called when one of the values of the gains are changed
function changeGain(string, type, player) {
    //alert(string);
    var value = parseFloat(string) / 25.0;
    switch (type) {
        case 'lowGain': lGain_player[player].gain.value = value; break;
        case 'midGain': mGain_player[player].gain.value = value; break;
        case 'highGain': hGain_player[player].gain.value = value; break;
    }
}

//called when add/remove lowPass filter
function addLowPassFilter(checked, player) {
    if (checked == true) {
        //UI deactivate other filters
        if ($("#invoice" + (parseInt(player) + 1) + "_2").is(':checked')) {
            $("#invoice" + (parseInt(player) + 1) + "_2").prop("checked", false);
            $("label[for='invoice" + (parseInt(player) + 1) + "_2']").removeClass("checked");
            addHighPassFilter(false, player);
        }

        if ($("#invoice" + (parseInt(player) + 1) + "_3").is(':checked')) {
            $("#invoice" + (parseInt(player) + 1) + "_3").prop("checked", false);
            $("label[for='invoice" + (parseInt(player) + 1) + "_3']").removeClass("checked");
            addPeakingFilter(false, player);
        }

        //add filter
        lPass_player[player] = context_player.createBiquadFilter();
        sum_player[player].connect(lPass_player[player]);
        lPass_player[player].connect(volumeNodes[player]);
        sum_player[player].disconnect(volumeNodes[player]);

        lPass_player[player].type = "lowpass";
        lPass_player[player].frequency.value = 640;
    }
    else {
        sum_player[player].connect(volumeNodes[player])
        sum_player[player].disconnect(lPass_player[player]);
    }
}

//called when add/remove highPass filter
function addHighPassFilter(checked, player) {
    if (checked == true) {
        //UI deactivate other filters
        if ($("#invoice" + (parseInt(player) + 1) + "_1").is(':checked')) {
            $("#invoice" + (parseInt(player) + 1) + "_1").prop("checked", false);
            $("label[for='invoice" + (parseInt(player) + 1) + "_1']").removeClass("checked");
            addLowPassFilter(false, player);
        }

        if ($("#invoice" + (parseInt(player) + 1) + "_3").is(':checked')) {
            $("#invoice" + (parseInt(player) + 1) + "_3").prop("checked", false);
            $("label[for='invoice" + (parseInt(player) + 1) + "_3']").removeClass("checked");
            addPeakingFilter(false, player);
        }

        //add filter
        hPass_player[player] = context_player.createBiquadFilter();
        sum_player[player].connect(hPass_player[player]);
        hPass_player[player].connect(volumeNodes[player]);
        sum_player[player].disconnect(volumeNodes[player]);

        hPass_player[player].type = "highpass";
        hPass_player[player].frequency.value = 640;
    }
    else {
        sum_player[player].connect(volumeNodes[player])
        sum_player[player].disconnect(hPass_player[player]);
    }
}

//called when add/remove peaking filter
function addPeakingFilter(checked, player) {
    if (checked == true) {
        //UI deactivate other filters
        if ($("#invoice" + (parseInt(player) + 1) + "_2").is(':checked')) {
            $("#invoice" + (parseInt(player) + 1) + "_2").prop("checked", false);
            $("label[for='invoice" + (parseInt(player) + 1) + "_2']").removeClass("checked");
            addHighPassFilter(false, player);
        }

        if ($("#invoice" + (parseInt(player) + 1) + "_1").is(':checked')) {
            $("#invoice" + (parseInt(player) + 1) + "_1").prop("checked", false);
            $("label[for='invoice" + (parseInt(player) + 1) + "_1']").removeClass("checked");
            addLowPassFilter(false, player);
        }

        //add filter
        pPass_player[player] = context_player.createBiquadFilter();
        sum_player[player].connect(pPass_player[player]);
        pPass_player[player].connect(volumeNodes[player]);
        sum_player[player].disconnect(volumeNodes[player]);

        pPass_player[player].type = "peaking";
        pPass_player[player].frequency.value = 440;
        pPass_player[player].Q.value = 2;
        pPass_player[player].gain.value = 15;
    }
    else {
        sum_player[player].connect(volumeNodes[player])
        sum_player[player].disconnect(pPass_player[player]);
    }
}

//called to inilialise frequancy change node
function initFrequencyQuality(player) {

    // Create the filter.
    freqFilter_player[player] = context_player.createBiquadFilter();
    //filter.type is defined as string type in the latest API. But this is defined as number type in old API.
    freqFilter_player[player].type = (typeof freqFilter_player[player].type === 'string') ? 'lowpass' : 0; // LOWPASS
    freqFilter_player[player].frequency.value = 5000;
    // Connect source to filter, filter to destination.
    sourceNode_player[player] = context_player.createGain();
    source_player[player].connect(freqFilter_player[player]);
    freqFilter_player[player].connect(sourceNode_player[player]);

}

//called when the frequencye value is changed
function changeFrequency(element, player) {
    var val = element.value / 100;
    // Clamp the frequency between the minimum value (40 Hz) and half of the
    // sampling rate.
    var minValue = 40;
    var maxValue = context_player.sampleRate / 2;
    // Logarithm (base 2) to compute how many octaves fall in the range.
    var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
    // Compute a multiplier from 0 to 1 based on an exponential scale.
    var multiplier = Math.pow(2, numberOfOctaves * (val - 1.0));
    // Get back to the frequency value between min and max.
    freqFilter_player[player].frequency.value = maxValue * multiplier;
};

//called when the quality value is changed
function changeQuality(element, player) {
    var val = element.value / 100;
    var QUAL_MUL = 30;
    freqFilter_player[player].Q.value = val * QUAL_MUL;
};

//called when the crossfade values are changed
function crossFade(element) {
    var x = parseInt(element.value) / parseInt(100);
    // Use an equal-power crossfading curve:
    var gain1 = Math.cos(x * 0.5 * Math.PI);
    var gain2 = Math.cos((1.0 - x) * 0.5 * Math.PI);
    volumeNodes[0].gain.value = gain1;
    volumeNodes[1].gain.value = gain2;
    //console.log(element.value);
}

//______________________END SOUND PROCESS_____________________________


//______________________RECORDING METHODS_____________________________

function record() {
    //
    $("#recordBtn").css("display", "none");
    $("#recordingLbl").text("Recording...");
    $("#stopBtn").css("display", "");
    $("#saveLink").addClass("btnDisabled");

    audioRecorder.clear();
    audioRecorder.record();
};

function stopRecording() {
    $("#recordBtn").css("display", "");
    $("#recordingLbl").text("Record");
    $("#stopBtn").css("display", "none");
    $("#saveLink").removeClass("btnDisabled");
    audioRecorder.stop();
    audioRecorder.getBuffers(gotBuffers);
};
//function saveAudio() {
//    audioRecorder.exportWAV(doneEncoding);
//    // could get mono instead by saying
//    // audioRecorder.exportMonoWAV( doneEncoding );
//};
function gotBuffers(buffers) {

    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    audioRecorder.exportWAV(doneEncoding);
};
function doneEncoding(blob) {
    Recorder.setupDownload(blob, "myRecording" + ".wav");
};

//______________________END RECORDING METHODS_________________________


//______________________HELPER METHODS________________________________
//uploades the new added files
function uploadRawFile(player, playlistId) {
    //recursive method, jums from the first file to the last one
    var file = null;
    if (player == "0") {
        if (currentUploadedFileIndex < files0ToUpload.length) {
            file = files0ToUpload[currentUploadedFileIndex];
        }
    }
    else {
        if (currentUploadedFileIndex < files1ToUpload.length) {
            file = files1ToUpload[currentUploadedFileIndex];
        }
    }
    if (file != null) {
        var data = new FormData();
        data.append(file.name, file);

        $.ajax({
            type: "POST",
            url: "/Home/UploadPlaylistItem?playlistId=" + playlistId,
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {

                for (var i = 0; i < player_playlist[player].playlist.length; i++) {
                    if (player_playlist[player].playlist[i].id == "-1" && player_playlist[player].playlist[i].name == file.name) {
                        player_playlist[player].playlist[i].id = result;
                    }
                }
                //go to next song
                currentUploadedFileIndex += 1;
                uploadRawFile(player, playlistId);
            },
            error: function (error) {
                alert('Error while creating the playlist: ' + error.statusText);
                console.log(error.responseText);
                currentUploadedFileIndex = 0;
                $('#modal2').modal('hide');
                //$.magnificPopup.close();
            }
        });
    }
    else {
        if (player == "0") {
            files0ToUpload = [];
        }
        else {
            files1ToUpload = [];
        }
        currentUploadedFileIndex = 0;
        $('#modal2').modal('hide');
        //$.magnificPopup.close();
        alert("Changes were saved succesfully");
    }
}

//bind method that gets called when there are new files selected to be uplaoded
$('#audio_file_player0').on("change", function (e) {
    files0ToUpload = e.target.files;
    uploadFile("0");
});
$('#audio_file_player1').on("change", function (e) {
    files1ToUpload = e.target.files;
    uploadFile("1");
});

//bind method that gets called when there the file selector button is clicked
$('#audio_file_player0').on("click", function (e) {

    $.ajax({
        type: "GET",
        url: "/Home/IsAuthenticated",
        async: false,
        success: function (result) {
            if (result == true && files0ToUpload.length > 0) {
                alert("The previous added files need to be saved into a playlist first.");
                e.preventDefault();
            }
            //console.log(result);
        },
        error: function (error) {
            console.log(error);
        }
    });
});
$('#audio_file_player1').on("click", function (e) {
    $.ajax({
        type: "GET",
        url: "/Home/IsAuthenticated",
        async: false,
        success: function (result) {
            if (result == true && files1ToUpload.length > 0) {
                alert("The previous added files need to be saved into a playlist first.");
                e.preventDefault();
            }
            //console.log(result);
        },
        error: function (error) {
            console.log(error);
         }
    });
});

// methods that are called when an file si removed(visual) from the playlist 
$('#jp_container_0 .jp-playlist').on('click', '.jp-playlist-item-remove', function () {
    // Determine song index if necessary
    var index = $(this).parents('li').index('.jp-playlist li');

    // Retrieve song information, if necessary
    var song = player_playlist[0].playlist[index];
    if (song.id == "-1") {
        //items added and not already saved remove from files0ToUpload
        files0ToUpload = $.grep(files0ToUpload, function (e) { return e.name != song.name; });
    }
    else {
        //old items - add to files0ToRemove
        files0ToRemove.push(song.id);
    }
});

$('#jp_container_1 .jp-playlist').on('click', '.jp-playlist-item-remove', function () {
    // Determine song index if necessary
    var index = $(this).parents('li').index('.jp-playlist li');

    // Retrieve song information, if necessary
    var song = player_playlist[1].playlist[index];
    if (song.id == "-1") {
        //items added and not already saved remove from files0ToUpload
        files1ToUpload = $.grep(files1ToUpload, function (e) { return e.name != song.name; });
    }
    else {
        //old items - add to files1ToRemove
        files1ToRemove.push(song.id);
    }

});

//______________________END HELPER METHODS____________________________



