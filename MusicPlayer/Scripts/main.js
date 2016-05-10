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


var audioRecorder;

//addEqualiser();

function playlistLoadPopup()
{
    //alert("here");
    $.magnificPopup.open({
        items: {
            src: '#popup-form',
        },
        type: 'inline',
        preloader: false,
        focus: '#name',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function () {
                if ($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#name';
                }
            }
        }
    });
    $(document).on('click', '.popup-modal-dismiss', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });
    $("#popup-content").empty();
    $("#popup-content").append("<p>Load</p>");
}



function playlistSavePopup(player) {
    //alert("here");
    $.magnificPopup.open({
        items: {
            src: '#popup-form',
        },
        type: 'inline',
        preloader: false,
        focus: '#name',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function () {
                if ($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#name';
                }
            }
        }
    });
    $(document).on('click', '.popup-modal-dismiss', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });

    $("#popup-content").empty();
    if (player_playlist[player].playlist.length == 0) {
        var htmlContent = "";
        htmlContent += "<div> There are no items in the playlist</div>";
        $("#popup-content").append(htmlContent);
    }
    else {

        $.ajax({
            type: "GET",
            url: "/Home/GetPlaylistList",
            success: function (result) {

                var htmlContent = "";
                htmlContent += "<div id=\"update-content\" ";
                if (result.length == 0) {
                    htmlContent += "style=\"display:none\"";
                }
                htmlContent += ">Overwrite existing playlist:";
                htmlContent += "<select id=\"playlist-select\">";
                htmlContent += "<option value=\"0\">Choose Existing Playlist</option>";
                for (var i = 0; i < result.length; i++) {
                    htmlContent += "<option value=\"" + result[i].id + "\">" + result[i].name + "</option>";
                }

                htmlContent += "</select>";
                htmlContent += "<div>";
                htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                htmlContent += "<span>Update playlist</span>";
                htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"updatePlaylist("+player+")\">";
                htmlContent += "</div>";
                htmlContent += "</div>";
                htmlContent += "</div>";
                htmlContent += "<div id=\"save-content\" ";
                if (result.length > 0) {
                    htmlContent += "style=\"display:none\"";
                }
                htmlContent += ">Name:";
                htmlContent += "<input type=\"text\" id=\"playlistName\" style=\"color: #000000;\" />";
                htmlContent += "<div>";
                htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                htmlContent += "<span>Save playlist</span>";
                htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"savePlaylist(" + player + ")\">";
                htmlContent += "</div>";
                htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                htmlContent += "<span>Cancel</span>";
                htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"goTo('update');\">";
                htmlContent += "</div>";
                htmlContent += "</div>";
                htmlContent += "</div>";

                htmlContent += "<div id=\"option-button\" ";
                if (result.length == 0) {
                    htmlContent += "style=\"display:none\"";
                }
                htmlContent += ">";
                htmlContent += "<div class=\"fakeFileBtn btn-chooseFile btnD btnD-acute\" style=\"margin-top: 10px;\">";
                htmlContent += "<span>Save New Playlist</span>";
                htmlContent += "<input type=\"button\" hidefocus=\"true\" class=\"gradient\" style=\"outline: none; cursor:default;\" onclick=\"goTo('save');\">";
                htmlContent += "</div>";
                htmlContent += "</div>";

                $("#popup-content").append(htmlContent);
            },
            error: function (error) {
                $.magnificPopup.close();
                alert('Error while getting data: ' + error.statusText);
                console.log(error.responseText);
            }
        });
    }
    
}

function goTo(place)
{
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

function savePlaylist(player)
{
    if ($.trim($("#playlistName").val()).length === 0) {
        alert("The playlist must have a name!");
    }
    else {

        var playlistItems = [];
        for (var i = 0; i < player_playlist[player].playlist.length; i++) {
            var item = {
                name: player_playlist[player].playlist[i].title,
                path: player_playlist[player].playlist[i].mp3
            }
            playlistItems.push(item);
        }
        console.log(playlistItems);

        $.ajax({
            type: "POST",
            url: "/Home/SavePlaylist",
            data: {
                name: $("#playlistName").val(),
                itemsList: playlistItems
            },
            success: function (result) {
                console.log(result);
                $.magnificPopup.close();
            },
            error: function (error) {
                alert('Error while saving the playlist: ' + error.statusText);
                console.log(error.responseText);
            }
        });
    }
}

function updatePlaylist(player) {
    if ($("#playlist-select").val() == "0") {
        alert("You must select a playlist first!");
    }
    else {
        var playlistItems = [];
        for (var i = 0; i < player_playlist[player].playlist.length; i++) {
            var item = {
                name: player_playlist[player].playlist[i].title,
                path: player_playlist[player].playlist[i].mp3
            }
            playlistItems.push(item);
        }
        console.log(playlistItems);
        $.ajax({
            type: "POST",
            url: "/Home/UpdatePlaylist",
            data: {
                id: $("#playlist-select").val(),
                itemsList: playlistItems
            },
            success: function (result) {
                console.log(result);
                $.magnificPopup.close();
            },
            error: function (error) {
                alert('Error while saving the playlist: ' + error.statusText);
                console.log(error.responseText);
            }
        });
    }
}

$("#audio_file_player0").on("change", function () { uploadFile("0"); });
$("#audio_file_player1").on("change", function () { uploadFile("1"); });
function uploadFile(player) {
    var files;
    var uploadedFiles = $("#audio_file_player" + player).prop('files');
    player_playlist[player].remove();

    var playlistItems = [];
    for (var i = 0; i < uploadedFiles.length; i++) {
        playlistItems.push({
            title: (uploadedFiles[i].name.length > 50 ? (uploadedFiles[i].name.substring(0, 50) + "...") : uploadedFiles[i].name),
            mp3: URL.createObjectURL(uploadedFiles[i]),
        });
    }
    player_playlist[player].setPlaylist(playlistItems);

    player_playlist[player].select(0);
    player_playlist[player].play(0);
    $("#songTitle" + player).html(player_playlist[player].playlist[0].title);

};

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

    //set volume
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

function changeGain(string, type, player) {
    //alert(string);
    var value = parseFloat(string) / 25.0;
    switch (type) {
        case 'lowGain': lGain_player[player].gain.value = value; break;
        case 'midGain': mGain_player[player].gain.value = value; break;
        case 'highGain': hGain_player[player].gain.value = value; break;
    }
}

function addLowPassFilter(checked, player) {
    if (checked == true) {
        //UI deactivate other filters
        if ($("#invoice"+(parseInt(player)+1)+"_2").is(':checked'))
        {
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

function changeQuality(element, player) {
    var val = element.value / 100;
    var QUAL_MUL = 30;
    freqFilter_player[player].Q.value = val * QUAL_MUL;
};


function record() {
    //
    $("#recordBtn").prop("disabled", true);
    $("#saveLink").css("display", "none");
    $("#stopBtn").prop("disabled", false);

    audioRecorder.clear();
    audioRecorder.record();
};

function stopRecording() {
    $("#recordBtn").prop("disabled", false);
    $("#saveLink").css("display", "block");
    $("#stopBtn").prop("disabled", true);
    audioRecorder.stop();
    audioRecorder.getBuffers(gotBuffers);
};
function saveAudio() {
    audioRecorder.exportWAV(doneEncoding);
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
};
function gotBuffers(buffers) {

    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    audioRecorder.exportWAV(doneEncoding);
};
function doneEncoding(blob) {
    Recorder.setupDownload(blob, "myRecording" + ".wav");
};

function crossFade(element) {
    var x = parseInt(element.value) / parseInt(100);
    // Use an equal-power crossfading curve:
    var gain1 = Math.cos(x * 0.5 * Math.PI);
    var gain2 = Math.cos((1.0 - x) * 0.5 * Math.PI);
    volumeNodes[0].gain.value = gain1;
    volumeNodes[1].gain.value = gain2;
    //console.log(element.value);
}