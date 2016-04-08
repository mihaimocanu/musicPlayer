// Define some variables used to remember state.
var playlistId, channelId;
var playlistResults = null;

// After the API loads, call a function to enable the playlist creation form.
function handleAPILoaded() {
    enableForm();
}

// Enable the form for creating a playlist.
function enableForm() {
    //$('#playlist-button').attr('disabled', false);
    $('#pageBody').css('display', 'block');
    getPlaylists();
}

//======================== PLAYLIST OPERATIONS =======================================

//Get user playslists
function getPlaylists(pageName)
{
    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    $.ajax({
        url: "/Home/GetPlaylistsData",
        type: 'GET',
        data: { id:'20'},
        error: function (e) {
            alert("Error: " + e);
        },
        success: function (data) {
            if (pageName == "Search") {
                playlistResults = data;
                $("#searchText").prop("disabled", false);
            }
            else {
                var playlists = data;
                //display names
                for (var i = 0; i < playlists.length; i++) {
                    var liContent = "<li>"
                    //display section
                    liContent += "<div id=\"playlistDisplay_" + playlists[i].playlistData.Id + "\">" + "<label id=\"displayTitle_" + playlists[i].playlistData.Id + "\">" + playlists[i].playlistData.Snippet.Title + "</label>";
                    liContent += "<button onclick=\"getPlaylistItems('" + playlists[i].playlistData.Id + "')\">See playlist content</button>";
                    liContent += "<button onclick=\"updatePlaylist('" + playlists[i].playlistData.Id + "')\">Update Playlist</button>";
                    liContent += "<button onclick=\"deletePlaylist('" + playlists[i].playlistData.Id + "')\">Delete Playlist</button></div>";

                    ////edit section
                    liContent += "<div id=\"playlistEdit_" + playlists[i].playlistData.Id + "\" style=\"display:none\"><input id=\"editTitle_" + playlists[i].playlistData.Id + "\" value='" + playlists[i].playlistData.Snippet.Title + "' type=\"text\" />";
                    liContent += "<select id=\"playlistType_" + playlists[i].playlistData.Id + "\"><option value=\"public\" " + (playlists[i].playlistData.Status.PrivacyStatus === 'public' ? "selected" : "") + " >Public</option><option value=\"private\" " + (playlists[i].playlistData.Status.PrivacyStatus != 'public' ? "selected" : "") + " >Private</option></select>";
                    liContent += "<button onclick=\"saveUpdate('" + playlists[i].playlistData.Id + "')\">Save</button>";
                    liContent += "<button onclick=\"cancelUpdate('" + playlists[i].playlistData.Id + "','" + playlists[i].playlistData.Status.PrivacyStatus + "')\">Cancel</button></div>";

                    liContent += "</li>";
                    $("#existingPlaylists").append(liContent);
                }
            }
        }
    });

    //USE REQUESTS MADE DIRECTLY TO THE YOUTUBE API 

    //var request = gapi.client.youtube.channels.list({
    //    mine: true,
    //    part: 'contentDetails'
    //});
    //request.execute(function (response) {
    //    var channelId = response.result.items[0].id;
    //    //get playlists
    //    var request2 = gapi.client.youtube.playlists.list({ 
    //        part: 'snippet,status',
    //        channelId:channelId
    //    });
    //    request2.execute(function (response) {
    //        var playlists = response.result.items;
    //        //display names
    //        for (var i = 0; i < playlists.length; i++)
    //        {
    //            var liContent="<li>"
    //            //display section
    //            liContent += "<div id=\"playlistDisplay_" + playlists[i].id + "\">" + "<label id=\"displayTitle_" + playlists[i].id + "\">" + playlists[i].snippet.title + "</label>";
    //            liContent += "<button onclick=\"updatePlaylist('" + playlists[i].id + "')\">Update Playlist</button>";
    //            liContent += "<button onclick=\"deletePlaylist('" + playlists[i].id + "')\">Delete Playlist</button></div>";

    //            ////edit section
    //            liContent += "<div id=\"playlistEdit_" + playlists[i].id + "\" style=\"display:none\"><input id=\"editTitle_" + playlists[i].id + "\" value='" + playlists[i].snippet.title + "' type=\"text\" />";
    //            liContent += "<select id=\"playlistType_" + playlists[i].id + "\"><option value=\"public\" " + (playlists[i].status.privacyStatus === 'public' ? "selected" : "") + " >Public</option><option value=\"private\" " + (playlists[i].status.privacyStatus != 'public' ? "selected" : "") + " >Private</option></select>";
    //            liContent += "<button onclick=\"saveUpdate('" + playlists[i].id + "')\">Save</button>";
    //            liContent += "<button onclick=\"cancelUpdate('" + playlists[i].id + "','" + playlists[i].status.privacyStatus + "')\">Cancel</button></div>";

    //            liContent += "</li>";
    //            $("#existingPlaylists").append(liContent);
    //        }
    //    });
    //});
}

//show the block that allows the user to update a playlist
function updatePlaylist(playlistId)
{
    $("#playlistDisplay_"+playlistId).css('display', 'none');
    $("#playlistEdit_" + playlistId).css('display', 'block');
}

//save playlist details update
function saveUpdate(playlistId) {

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    $.ajax({
        url: "/Home/EditPlaylist",
        type: 'PUT',
        data: {
            id:playlistId,
            name: $('#editTitle_' + playlistId).val(),
            status: $('#playlistType_' + playlistId).val(),
            description: 'A ' + $('#playlistType_' + playlistId).val() + ' playlist updated with the YouTube API'
        },
        error: function (e) {
            alert("Error: " + e);
        },
        success: function (data) {
            $("#existingPlaylists").empty();
            getPlaylists();
        }
    });

    //USE REQUESTS MADE DIRECTLY TO THE YOUTUBE API

    //var request = gapi.client.youtube.playlists.update({
    //    part: 'snippet,status',
    //    resource: {
    //        id:playlistId,
    //        snippet: {
    //            title: $('#editTitle_'+playlistId).val(),
    //            description: 'A ' + $('#playlistType_'+playlistId).val() + ' playlist updated with the YouTube API'
    //        },
    //        status: {
    //            privacyStatus: $('#playlistType_'+playlistId).val()
    //        }
    //    }
    //});
    //request.execute(function (response) {
    //    var result = response.result;
    //    if (result) {
    //        $("#existingPlaylists").empty();
    //        getPlaylists();
    //    } else {
    //        alert('There was an error in the update process. Please try again later.');
    //    }
    //});
}

//cancel the process of updating a playlist details
function cancelUpdate(playlistId,playlistType) {
    $("#playlistDisplay_" + playlistId).css('display', 'block');
    $("#playlistEdit_" + playlistId).css('display', 'none');
    $("#editTitle_" + playlistId).val($("#displayTitle_" + playlistId).text());
    $("#playlistType_" + playlistId).val(playlistType);

}

// Create a new playlist.
function createPlaylist() {

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    if ($('#playlistName').val() != null && $('#playlistName').val()!='')
    {

        $.ajax({
            url: "/Home/CreatePlaylist",
            type: 'POST',
            data: {
                name: $('#playlistName').val(),
                status: $('#playlistType').val(),
                description: 'A ' + $('#playlistType').val() + ' playlist created with the YouTube API'
            },
            error: function (e) {
                alert("Error: " + e);
            },
            success: function (data) {
                playlistId = data.Id;

                var liContent = "<li>"
                //display section
                liContent += "<div id=\"playlistDisplay_" + playlistId + "\">" + "<label id=\"displayTitle_" + playlistId + "\">" + $('#playlistName').val() + "</label>";
                liContent += "<button onclick=\"getPlaylistItems('" + playlistId + "')\">See playlist content</button>";
                liContent += "<button onclick=\"updatePlaylist('" + playlistId + "')\">Update Playlist</button>";
                liContent += "<button onclick=\"deletePlaylist('" + playlistId + "')\">Delete Playlist</button></div>";

                ////edit section
                liContent += "<div id=\"playlistEdit_" + playlistId + "\" style=\"display:none\"><input id=\"editTitle_" + playlistId + "\" value='" + $('#playlistName').val() + "' type=\"text\" />";
                liContent += "<select id=\"playlistType_" + playlistId + "\"><option value=\"public\" " + ($('#playlistType').val() === 'public' ? "selected" : "") + " >Public</option><option value=\"private\" " + ($('#playlistType').val() != 'public' ? "selected" : "") + " >Private</option></select>";
                liContent += "<button onclick=\"saveUpdate('" + playlistId + "')\">Save</button>";
                liContent += "<button onclick=\"cancelUpdate('" + playlistId + "','" + $('#playlistType').val() + "')\">Cancel</button></div>";

                liContent += "</li>";

                $("#existingPlaylists").append(liContent);
            }
        });

        //USE REQUESTS MADE DIRECTLY TO THE YOUTUBE API

        //var request = gapi.client.youtube.playlists.insert({
        //    part: 'snippet,status',
        //    resource: {
        //        snippet: {
        //            title: $('#playlistName').val(),
        //            description: 'A ' + $('#playlistType').val() + ' playlist created with the YouTube API'
        //        },
        //        status: {
        //            privacyStatus: $('#playlistType').val()
        //        }
        //    }
        //});
        //request.execute(function (response) {
        //    var result = response.result;
        //    if (result) {
        //        //$('#addVideo').css('display', 'block');
        //        playlistId = result.id;
        //        //$('#playlist-id').val(playlistId);
        //        //$('#playlist-title').html(result.snippet.title);
        //        //$('#playlist-description').html(result.snippet.description);
        //        var liContent = '<li>' + $('#playlistName').val();
        //        liContent += "<button id=\"playlist-button\" onclick=\"deletePlaylist('" + playlistId + "')\">Delete Playlist</button></li>";
        //        $("#existingPlaylists").append(liContent);
        //    } else {
        //        $('#status').html('Could not create playlist');
        //    }
        //});
    }
    else
    {
        alert('The new playlist must have a name!');
    }
    
}

//transfer to the page where the videos contained in the playlist are displayed
function getPlaylistItems(playlistId)
{
    window.location.href = "Videos?playlistId=" + playlistId;
}

//delete a playlist
function deletePlaylist(playlistId)
{

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    $.ajax({
        url: "/Home/DeletePlaylist",
        type: 'DELETE',
        data: {
            id: playlistId
        },
        error: function (e) {
            alert("Error: " + e);
        },
        success: function (data) {
            $("#existingPlaylists").empty();
            getPlaylists()
        }
    });

    //USE REQUESTS MADE DIRECTLY TO THE YOUTUBE API

    //var request = gapi.client.youtube.playlists.delete({
    //    id: playlistId
    //});
    //request.execute(function (response) {
    //    $("#existingPlaylists").empty();
    //    getPlaylists()
    //});
}


//======================== VIDEO OPERATIONS =======================================

//add video to playlist
function addVideoToPlaylist(playlistId, videoId) {

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    $.ajax({
        url: "/Home/AddPlaylistVideo",
        type: 'POST',
        data: {
            playlistId: playlistId,
            videoId: videoId
        },
        error: function (e) {
            alert("Error: " + e);
        },
        success: function (data) {
            getPlaylists("Search");
        }
    });

    //USE REQUESTS MADE DIRECTLY TO THE YOUTUBE API

    //var details = {
    //    videoId: id,
    //    kind: 'youtube#video'
    //}
    //if (startPos != undefined) {
    //    details['startAt'] = startPos;
    //}
    //if (endPos != undefined) {
    //    details['endAt'] = endPos;
    //}
    //var request = gapi.client.youtube.playlistItems.insert({
    //    part: 'snippet',
    //    resource: {
    //        snippet: {
    //            playlistId: playlistId,
    //            resourceId: details
    //        }
    //    }
    //});
    //request.execute(function (response) {
    //    $('#status').html('<pre>' + JSON.stringify(response.result) + '</pre>');
    //});
}

//add/remove videos from playlist
function playlistOperation(videoId) {

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    var isInPlaylist = isInExistingPlaylists(videoId)
    if (isInPlaylist != null) {
        //remove from current playlist
        $.ajax({
            url: "/Home/RemovePlaylistVideo",
            type: 'DELETE',
            data: {
                playlistItemId: isInPlaylist
            },
            error: function (e) {
                alert("Error: " + e);
            },
            success: function (data) {
                
                var playlistId=$("#playlistName_" + videoId).val();
                if(playlistId!="null")
                {
                    //if the playlist selected is null then the video will only be removed, else it will be add/changed from/to the playlist
                    addVideoToPlaylist(playlistId, videoId);
                }
                else
                {
                    //reset playlists content
                    getPlaylists("Search");
                }
                
            }
        });

    }
    else {
        var playlistId = $("#playlistName_" + videoId).val();
        if (playlistId !="null") {
            //if the selected playlsit is != null, the video will be add/changed from/to the playlist
            addVideoToPlaylist(playlistId, videoId);
        }
        else
        {
            //reset playlists content
            getPlaylists("Search");
        }
    }
}

// check if video already exists in one of the users playlists
function isInExistingPlaylists(videoId) {
    for (var j = 0; j < playlistResults.length; j++) {
        for (var k = 0; k < playlistResults[j].items.length; k++) {
            if (playlistResults[j].items[k].ContentDetails.VideoId == videoId) {
                return playlistResults[j].items[k].Id;
            }
        }
    }
    return null;
}

//removes a video from a playlist
function removePlaylistVideo(playlistItemId) {

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    $.ajax({
        url: "/Home/RemovePlaylistVideo",
        type: 'DELETE',
        data: {
            playlistItemId: playlistItemId
        },
        error: function (e) {
            alert("Error: " + e);
        },
        success: function (data) {
            $("#video_" + playlistItemId).remove();
        }
    });
}

function getVideoComments(videoId)
{
    $.ajax({
        url: "/Home/GetVideoComments",
        type: 'GET',
        data: {
            videoId: videoId
        },
        error: function (e) {
            alert("Error: " + e.responseText);
        },
        success: function (data) {
            var here = data;
        }
    });
}

function editVideoNote(videoId)
{
    $("#videoNote_"+videoId).css('display', 'none');
    $("#videoNoteEdit_" + videoId).css('display', 'block');
    
}

function saveVideoNote(playlistItemId, playlistId)
{
    $.ajax({
        url: "/Home/UpdatePlaylistVideo",
        type: 'PUT',
        data: {
            playListItemId: playlistItemId,
            playlistId: playlistId,
            note: $("#editNote_" + playlistItemId).val()
        },
        error: function (e) {
            alert("Error: " + e);
            cancelVideoNote(playlistItemId);
        },
        success: function (data) {
            $("#noteContent_" + playlistItemId).text($("#editNote_" + playlistItemId).val());
            $("#videoNote_" + playlistItemId).css('display', 'block');
            $("#videoNoteEdit_" + playlistItemId).css('display', 'none');
        }
    });
}

function cancelVideoNote(videoId)
{
    $("#videoNote_" + videoId).css('display', 'block');
    $("#videoNoteEdit_" + videoId).css('display', 'none');
    $("#editNote_" + videoId).val($("#noteContent_" + videoId).text());
}

//search for videos on Youtube
function searchVideo(searchText) {

    //USE REQUESTS TO THE BACKEND TO HANDLE THE OPERATIONS ON THE YOUTUBE API 

    $.ajax({
        url: "/Home/SearchVideo",
        type: 'GET',
        data: { searchText: searchText },
        error: function (e) {
            alert("Error: " + e);
        },
        success: function (data) {
            var searchResult = data;
            for (var i = 0; i < searchResult.length; i++) {
                var liContent = "<li id=\"video_" + searchResult[i].id.VideoId + "\">";
                liContent += "<h3><a href=\"https://www.youtube.com/watch?v=" + searchResult[i].id.VideoId + "\" target=\"_blank\">" + searchResult[i].title + "</a></h3>";
                liContent += "<h4>" + searchResult[i].description + "</h4>"
                //liContent += "<button id=\"addButton_" + searchResult[i].id.VideoId + "\" onclick=\"addToPlaylist('" + searchResult[i].id.VideoId + "')\">Add To Playlist</button>";
                liContent += "<div id=\"playlistForm_" + searchResult[i].id.VideoId + "\">";
                liContent += "<label>Playlist: </label>"
                liContent += "<select onChange=\"playlistOperation('" + searchResult[i].id.VideoId + "')\" id=\"playlistName_" + searchResult[i].id.VideoId + "\" " + (playlistResults.length == 0 ? "disabled" : "") + " >";
                liContent += "<option value=\"null\" " + (searchResult[i].id.PlaylistId == null ? "selected" : "") + " ></option>"
                for (var j = 0; j < playlistResults.length; j++) {
                    liContent += "<option value=\"" + playlistResults[j].playlistData.Id + "\" ";
                    for (var k = 0; k < playlistResults[j].items.length; k++) {
                        liContent += playlistResults[j].items[k].ContentDetails.VideoId == searchResult[i].id.VideoId ? "selected" : "";
                    }
                    liContent += " >" + playlistResults[j].playlistData.Snippet.Title + "</option>";
                }
                liContent += "</select>";
                liContent += "</div></li>";
                $("#resultDisplay").append(liContent);
            }
        }
    });
}