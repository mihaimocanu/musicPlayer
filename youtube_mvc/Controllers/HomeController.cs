using Google.Apis.Upload;
using Google.Apis.YouTube.v3.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using youtube_mvc.YoutubeKeys;
using youtube_mvc.Models;
using Google.Apis.YouTube.v3;

namespace youtube_mvc.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";

            return RedirectToAction("AudioEQ");
            //return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return RedirectToAction("AudioEQ");
            //return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return RedirectToAction("AudioEQ");
            //return View();
        }

        public ActionResult UpdatePlaylist()
        {
            ViewBag.Message = "Your contact page.";
            if (YoutubeCredentials.youtubeService == null)
                YoutubeCredentials.Login().Wait();

            return RedirectToAction("AudioEQ");
            //return View();
        }

        public ActionResult SearchVideos()
        {
            ViewBag.Message = "Your contact page.";

            return RedirectToAction("AudioEQ");
            //return View();
        }
        public ActionResult UploadVideo()
        {
            ViewBag.Message = "Your contact page.";

            return RedirectToAction("AudioEQ");
            //return View();
        }
        public ActionResult AudioEQ()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult DjSet()
        {
            ViewBag.Message = "Your contact page.";

            return RedirectToAction("AudioEQ");
            //return View();
        }

        public async Task<JsonResult> SearchVideo(string searchText)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                var searchListRequest = YoutubeCredentials.youtubeService.Search.List("snippet");
                searchListRequest.Q = searchText; 
                searchListRequest.MaxResults = 20;

                // Call the search.list method to retrieve results matching the specified query term.
                var searchListResponse = await searchListRequest.ExecuteAsync();

                var searchVideos = new List<Object>();
                foreach (var item in searchListResponse.Items)
                {
                    searchVideos.Add(new
                    {
                        id = item.Id,
                        title = item.Snippet.Title,
                        description = item.Snippet.Description
                    });
                }

                return this.Json(searchVideos, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }
        }

        public async Task<ActionResult> Videos(string playlistId)
        {
            ViewBag.Message = "Your contact page.";

            var playlistResultObject = await GetPlaylistsItems(playlistId);

            return View(playlistResultObject.Items);
        }

        public async Task<JsonResult> AddPlaylistVideo(string playlistId,string videoId)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                var newPlaylistItem = new PlaylistItem();
                newPlaylistItem.Snippet = new PlaylistItemSnippet();
                newPlaylistItem.Snippet.PlaylistId = playlistId;
                newPlaylistItem.Snippet.ResourceId = new ResourceId();
                newPlaylistItem.Snippet.ResourceId.Kind = "youtube#video";
                newPlaylistItem.Snippet.ResourceId.VideoId = videoId;
                newPlaylistItem = await YoutubeCredentials.youtubeService.PlaylistItems.Insert(newPlaylistItem, "snippet").ExecuteAsync();

                return this.Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }
        }

        public async Task<JsonResult> UpdatePlaylistVideo(string playListItemId, string playlistId, string note)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                // Create a new, private playlist in the authorized user's channel.
                var newPlaylistItem = new PlaylistItem();
                newPlaylistItem.Id = playListItemId;
                newPlaylistItem.ContentDetails = new PlaylistItemContentDetails();
                newPlaylistItem.ContentDetails.Note = note;
                newPlaylistItem.Snippet = new PlaylistItemSnippet();
                newPlaylistItem.Snippet.PlaylistId = playlistId;
                newPlaylistItem = await YoutubeCredentials.youtubeService.PlaylistItems.Update(newPlaylistItem, "contentDetails").ExecuteAsync();

                return this.Json(newPlaylistItem, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }

        }

        public async Task<JsonResult> RemovePlaylistVideo(string playlistItemId)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                // Create a new, private playlist in the authorized user's channel.
                var deletePlaylistVideo = await YoutubeCredentials.youtubeService.PlaylistItems.Delete(playlistItemId).ExecuteAsync();

                return this.Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }
        }

        public async Task<JsonResult> CreatePlaylist(string name, string status, string description)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                // Create a new, private playlist in the authorized user's channel.
                var newPlaylist = new Playlist();
                newPlaylist.Snippet = new PlaylistSnippet();
                newPlaylist.Snippet.Title = name;
                newPlaylist.Snippet.Description = description;
                newPlaylist.Status = new PlaylistStatus();
                newPlaylist.Status.PrivacyStatus = status;
                newPlaylist = await YoutubeCredentials.youtubeService.Playlists.Insert(newPlaylist, "snippet,status").ExecuteAsync();

                return this.Json(newPlaylist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }

        }

        public async Task<JsonResult> EditPlaylist(string id, string name, string status, string description)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                // Create a new, private playlist in the authorized user's channel.
                var newPlaylist = new Playlist();
                newPlaylist.Snippet = new PlaylistSnippet();
                newPlaylist.Id=id;
                newPlaylist.Snippet.Title=name;
                newPlaylist.Snippet.Description = description;
                newPlaylist.Status = new PlaylistStatus();
                newPlaylist.Status.PrivacyStatus = status;
                newPlaylist = await YoutubeCredentials.youtubeService.Playlists.Update(newPlaylist, "snippet,status").ExecuteAsync();

                return this.Json(newPlaylist, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }

        }

        public async Task<JsonResult> DeletePlaylist(string id)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                // Create a new, private playlist in the authorized user's channel.
                var deletePlaylist= await YoutubeCredentials.youtubeService.Playlists.Delete(id).ExecuteAsync();

                return this.Json(new { status="success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }

        }

        public async Task<JsonResult> GetPlaylistsData(String id)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                var channel= YoutubeCredentials.youtubeService.Channels.List("contentDetails");
                channel.Mine = true;
                var channelList= await channel.ExecuteAsync();
                var channelId = channelList.Items.FirstOrDefault().Id;

                var playlists = YoutubeCredentials.youtubeService.Playlists.List("snippet,status");
                playlists.ChannelId = channelId;

                var playlistResultObject = await playlists.ExecuteAsync();

                var playlistsItems = playlistResultObject.Items;

                var playlistsData = new List<Object>();

                foreach (var playlist in playlistsItems)
                {
                    var items = await GetPlaylistsItems(playlist.Id);
                    playlistsData.Add(new
                    {
                        playlistData = playlist,
                        items = items.Items
                    });
                }

                return this.Json(playlistsData, JsonRequestBehavior.AllowGet);
            }
            catch(Exception e)
            {
                return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            }
            
        }
        //public async Task<JsonResult> GetPlaylistsItems(String id)
        public async Task<PlaylistItemListResponse> GetPlaylistsItems(String id)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                var playlistItems = YoutubeCredentials.youtubeService.PlaylistItems.List("contentDetails,snippet");
                playlistItems.PlaylistId = id;

                var playlistResultObject = await playlistItems.ExecuteAsync();
                return playlistResultObject;

                //var playlistsVideos = new List<Object>();
                //foreach (var item in playlistResultObject.Items)
                //{
                //    playlistsVideos.Add(new
                //    {
                //        id = item.Id,
                //        title = item.Snippet.Title,
                //        description = item.Snippet.Description
                //    });
                //}
                    

                //return this.Json(playlistsVideos, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return null;
            }

        }

        [HttpPost]
        public async Task<JsonResult> UploadVideoMethod(HttpPostedFileBase file)
        {
            if (file != null && file.ContentLength > 0)
            {
                try
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var path = Path.Combine(Server.MapPath("~/Uploads/"), fileName);
                    file.SaveAs(path);

                    if (YoutubeCredentials.youtubeService == null)
                        YoutubeCredentials.Login().Wait();

                    var video = new Video();
                    video.Snippet = new VideoSnippet();
                    video.Snippet.Title = "Test1";
                    video.Snippet.Description = "Default Video Description";
                    video.Snippet.Tags = new string[] { "tag1", "tag2" };
                    video.Snippet.CategoryId = "22"; // See https://developers.google.com/youtube/v3/docs/videoCategories/list
                    video.Status = new VideoStatus();
                    video.Status.PrivacyStatus = "private"; // or "private" or "public"
                    var filePath = @"" + path; // Replace with path to actual movie file.

                    using (var fileStream = new FileStream(filePath, FileMode.Open))
                    {
                        var videosInsertRequest = YoutubeCredentials.youtubeService.Videos.Insert(video, "snippet,status", fileStream, "video/*");
                        videosInsertRequest.ProgressChanged += videosInsertRequest_ProgressChanged;
                        videosInsertRequest.ResponseReceived += videosInsertRequest_ResponseReceived;

                        await videosInsertRequest.UploadAsync();
                    }

                    return this.Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception e)
                {
                    return this.Json(e.Message, JsonRequestBehavior.DenyGet);
                }
            }
            return this.Json(new { status = "Not success" }, JsonRequestBehavior.DenyGet);
            
        }
        void videosInsertRequest_ProgressChanged(Google.Apis.Upload.IUploadProgress progress)
        {
            switch (progress.Status)
            { 
                case UploadStatus.Uploading:
                    Console.WriteLine("{0} bytes sent.", progress.BytesSent);
                    break;

                case UploadStatus.Failed:
                    Console.WriteLine("An error prevented the upload from completing.\n{0}", progress.Exception);
                    break;
            }
        }

        void videosInsertRequest_ResponseReceived(Video video)
        {
            Console.WriteLine("Video id '{0}' was successfully uploaded.", video.Id);
        }

        public async Task<JsonResult> AddComment(string videoId, string commentText)
        {
            //try
            //{
            //    if (YoutubeCredentials.youtubeService == null)
            //        YoutubeCredentials.Login().Wait();

            //    // Create a new, private playlist in the authorized user's channel.
            //    var newComment = new Comment();
            //    newComment.Snippet = new CommentSnippet();
            //    newComment.Snippet.VideoId = videoId;
            //    newComment.Snippet.TextOriginal = commentText;
            //    newComment.Snippet.Description = description;
            //    newPlaylist = await YoutubeCredentials.youtubeService.Comments.Insert(newComment, "snippet").ExecuteAsync();

            //    return this.Json(newPlaylist, JsonRequestBehavior.AllowGet);
            //}
            //catch (Exception e)
            //{

            //    return this.Json(e.Message, JsonRequestBehavior.DenyGet);
            //}
            return this.Json("ok", JsonRequestBehavior.AllowGet);

        }

        public async Task<JsonResult> GetVideoComments(string videoId)
        {
            try
            {
                if (YoutubeCredentials.youtubeService == null)
                    YoutubeCredentials.Login().Wait();

                var videoCommentsListResponse = YoutubeCredentials.youtubeService.CommentThreads.List("snippet");//.CommentThreads.List("snippet");
                videoCommentsListResponse.VideoId = videoId;
                videoCommentsListResponse.Key = "AIzaSyCjmSrLizdS6TXf5dPjYz5okfxIpnRvYuo";
                videoCommentsListResponse.TextFormat = CommentThreadsResource.ListRequest.TextFormatEnum.PlainText;
                var videoCommentThreads = await videoCommentsListResponse.ExecuteAsync();
                
                List<CommentBody> comments=new List<CommentBody>();

                foreach(var videoCommentThread in videoCommentThreads.Items)
                {
                    var comment = new CommentBody();

                    comment.authorName = videoCommentThread.Snippet.TopLevelComment.Snippet.AuthorDisplayName;
                    comment.commentText = videoCommentThread.Snippet.TopLevelComment.Snippet.TextDisplay;
                    comment.publishedAt = Convert.ToDateTime(videoCommentThread.Snippet.TopLevelComment.Snippet.PublishedAtRaw);
                    if(videoCommentThread.Snippet.TotalReplyCount>0)
                    {
                        comment.replays = await GetCommentReplays(videoCommentThread.Id);
                    }
                    else
                    {
                        comment.replays = new List<CommentBody>();
                    }
                    comments.Add(comment); 
                }

                return this.Json(comments.OrderBy(com=>com.publishedAt).ToList(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(e.Message, JsonRequestBehavior.AllowGet);
            }
        }

        public async Task<List<CommentBody>> GetCommentReplays(string commentParentId)
        {
            var videoComment=YoutubeCredentials.youtubeService.Comments.List("snippet");
            videoComment.ParentId = commentParentId;
            var comments = await videoComment.ExecuteAsync();
            List<CommentBody> commentsBody = new List<CommentBody>();
            foreach(var comment in comments.Items)
            {
                var commentBody = new CommentBody();
                commentBody.authorName = comment.Snippet.AuthorDisplayName;
                commentBody.commentText = comment.Snippet.TextDisplay;
                commentBody.publishedAt = Convert.ToDateTime(comment.Snippet.PublishedAtRaw);
                commentsBody.Add(commentBody);
            }
            return commentsBody.OrderBy(com=>com.publishedAt).ToList();
        }

    }

    public class CommentBody
    {
        public string commentText { get; set; }
        public string authorName { get; set; }
        public DateTime publishedAt { get; set; }
        public List<CommentBody> replays { get; set; }
    }
}
