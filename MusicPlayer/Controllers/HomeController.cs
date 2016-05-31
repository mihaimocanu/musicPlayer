using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using MusicPlayer.Helpers;
using MusicPlayer.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MusicPlayer.Controllers
{
    public class HomeController : Controller
    {
        #region Controller-View
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        #endregion

        #region User-Control
        [HttpGet]
        public async Task<JsonResult> IsAuthenticated()
        {
            //var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            if(User.Identity.IsAuthenticated)
            {
                return this.Json(true, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return this.Json(false, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Playlist-Control
        [HttpGet]
        [Authorize]
        public async Task<JsonResult> GetPlaylistList()
        {
            try
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var userId = User.Identity.GetUserId();
                var currentUser = manager.FindById(User.Identity.GetUserId());

                return this.Json(currentUser.PlaylistsInfo.Select(x => new
                {
                    id = x.PlaylistId,
                    name = x.PlaylistName,
                    updatedAt = x.UpdatedAt
                }), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

            }
        }

        [HttpGet]
        [Authorize]
        public async Task<JsonResult> GetPlaylistData(int playlistId)
        {
            try
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var userId = User.Identity.GetUserId();
                var currentUser = manager.FindById(User.Identity.GetUserId());
                var playlistData = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();
                return this.Json(playlistData.PlaylistItems.Select(x => new
                {
                    id = x.ItemId,
                    name = x.ItemName,
                    path = Request.Url.Scheme + "://" + Request.Url.Authority + Request.ApplicationPath.TrimEnd('/') + "/dataStore/" + x.ItemPath
                }), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

            }
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> CreatePlaylist(string name)
        {
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            var currentUser = manager.FindById(User.Identity.GetUserId());
            var newPlaylist = new PlaylistInfo();
            newPlaylist.PlaylistName = name;
            newPlaylist.CreatedAt = DateTime.Now;
            newPlaylist.UpdatedAt = DateTime.Now;
            newPlaylist.PlaylistItems = new List<PlaylistData>();

            currentUser.PlaylistsInfo.Add(newPlaylist);

            IdentityResult resultAdd = await manager.UpdateAsync(currentUser);

            if (resultAdd.Succeeded)
            {
                return this.Json(newPlaylist.PlaylistId, JsonRequestBehavior.AllowGet);
            }
            else
            {
                throw new Exception("Errors: " + String.Join(";", resultAdd.Errors));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> DeletePlaylist(int playlistId)
        {
            try
            {
                var playlistItemsId = new List<int>();
                string userId = User.Identity.GetUserId();
                using (ApplicationDbContext dbContext = new ApplicationDbContext())
                {
                    var currentUser = dbContext.Users.Where(u => u.Id.Equals(userId)).FirstOrDefault();
                    var playlistData = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();
                    playlistItemsId = playlistData.PlaylistItems.Select(item => item.ItemId).ToList();
                }

                foreach (int itemId in playlistItemsId)
                {
                    removePlaylistItem(playlistId, itemId);
                }

                using (ApplicationDbContext dbContext = new ApplicationDbContext())
                {
                    var currentUser = dbContext.Users.Where(u => u.Id.Equals(userId)).FirstOrDefault();
                    var playlistData = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();

                    dbContext.Entry(playlistData).State = EntityState.Deleted;

                    dbContext.SaveChanges();

                    return this.Json("Success", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> UpdatePlaylistFiles(int oldPlaylistId, int newPlaylistId, List<int> removedItemsList)
        {
            if (removedItemsList == null)
            {
                removedItemsList = new List<int>();
            }
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            var currentUser = manager.FindById(User.Identity.GetUserId());

            var oldPlaylist = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == oldPlaylistId).FirstOrDefault();

            var newPlaylist = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == newPlaylistId).FirstOrDefault();

            if (oldPlaylistId != newPlaylistId)
            {
                //remove new playlists Items
                foreach (var item in newPlaylist.PlaylistItems)
                {
                    removePlaylistItem(newPlaylistId, item.ItemId);
                }

                // add to the new playlist, the items from the old, excepting the ones selected for removal
                var itemsToCopy = oldPlaylist.PlaylistItems.Where(item => !removedItemsList.Contains(item.ItemId)).ToList();
                foreach (var item in itemsToCopy)
                {
                    var newItem = new PlaylistData();
                    newItem.ItemName = item.ItemName;
                    newItem.ItemPath = item.ItemPath;
                    newItem.UpdatedAt = DateTime.Now;

                    newPlaylist.PlaylistItems.Add(newItem);
                }


                IdentityResult resultAdd = await manager.UpdateAsync(currentUser);

                if (resultAdd.Succeeded)
                {
                    return this.Json("Success", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    throw new Exception("Errors: " + String.Join(";", resultAdd.Errors));
                }

            }
            else
            {
                //just remove the unwanted items
                foreach (int item in removedItemsList)
                {
                    bool isDone = removePlaylistItem(newPlaylistId, item);
                }
                return this.Json("Success", JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region PlaylistItems-Control
        [HttpPost]
        [Authorize]
        public async Task<JsonResult> CopyPlaylistItem(int playlistId, int itemId)
        {
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            var currentUser = manager.FindById(User.Identity.GetUserId());

            var playlistInfo = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();

            var itemToCopy = currentUser.PlaylistsInfo.Where(item => item.PlaylistItems.Where(it => it.ItemId == itemId).FirstOrDefault() != null).FirstOrDefault().PlaylistItems.Where(item => item.ItemId == itemId).FirstOrDefault();

            //add item to the DB
            var plItem = new PlaylistData();
            plItem.ItemName = itemToCopy.ItemName;
            plItem.ItemPath = itemToCopy.ItemPath;
            plItem.UpdatedAt = DateTime.Now;

            playlistInfo.PlaylistItems.Add(plItem);

            IdentityResult resultAdd = await manager.UpdateAsync(currentUser);

            if (resultAdd.Succeeded)
            {
                return this.Json(plItem.ItemId, JsonRequestBehavior.AllowGet);
            }
            else
            {
                throw new Exception("Errors: " + String.Join(";", resultAdd.Errors));
            }

        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> UploadPlaylistItem(int playlistId)
        {
            try
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var currentUser = manager.FindById(User.Identity.GetUserId());

                var playlistInfo = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();

                foreach (string file in Request.Files)
                {
                    var fileContent = Request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {

                        var rawFileName = Path.GetFileName(file);
                        String[] rawSubStrings = rawFileName.Split('.');
                        string extension = "." + rawSubStrings.LastOrDefault();
                        rawSubStrings = rawSubStrings.Take(rawSubStrings.Count() - 1).ToArray();
                        string fileNameDB = String.Join(".", rawSubStrings);
                        string filePath = currentUser.Id + "_" + DateTime.Now.Ticks.ToString();

                        //add item to the DB
                        var plItem = new PlaylistData();
                        plItem.ItemName = fileNameDB;
                        plItem.ItemPath = filePath + extension;
                        plItem.UpdatedAt = DateTime.Now;

                        playlistInfo.PlaylistItems.Add(plItem);

                        IdentityResult resultAdd = await manager.UpdateAsync(currentUser);
                        if (resultAdd.Succeeded)
                        {
                            //// ToDo - uncomment this for live version

                            //////save the file on the hard-disk
                            ////// get a stream
                            ////var stream = fileContent.InputStream;
                            ////// and optionally write the file to disk
                            ////var path = Path.Combine(Server.MapPath("~/dataStore"), filePath + extension);
                            ////using (var fileStream = System.IO.File.Create(path))
                            ////{
                            ////    stream.CopyTo(fileStream);
                            ////}

                            return this.Json(plItem.ItemId, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            throw new Exception("Errors: " + String.Join(";", resultAdd.Errors));

                        }
                    }
                    throw new Exception("Errors: No valid file data sent");
                }
                throw new Exception("Errors: No valid file data sent");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        private bool removePlaylistItem(int playlistId, int itemId)
        {
            try
            {
                ApplicationDbContext dbContext = new ApplicationDbContext();
                string userId = User.Identity.GetUserId();
                var currentUser = dbContext.Users.Where(u => u.Id.Equals(userId)).FirstOrDefault();
                var playlistData = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();

                var deleteItem = playlistData.PlaylistItems.Where(x => x.ItemId == itemId).FirstOrDefault();

                //delete file, if it is not used in another place
                var isUsed = currentUser.PlaylistsInfo.Where(item => item.PlaylistItems.Where(itm => itm.ItemPath.Equals(deleteItem.ItemPath)).ToList().Count > 0).ToList().Count;
                if (isUsed == 1)
                {
                    //also delete the file, it is not used in another place
                    if (System.IO.File.Exists(HttpContext.Server.MapPath("~/dataStore/" + deleteItem.ItemPath)))
                    {
                        // Use a try block to catch IOExceptions, to
                        // handle the case of the file already being
                        // opened by another process.
                        try
                        {
                            System.IO.File.Delete(HttpContext.Server.MapPath("~/dataStore/" + deleteItem.ItemPath));
                        }
                        catch (System.IO.IOException e)
                        {
                            Console.WriteLine(e.Message);
                        }
                    }
                }

                dbContext.Entry(deleteItem).State = EntityState.Deleted;

                dbContext.SaveChanges();

                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message + " - on remiving playlist items");
            }

        }
        #endregion
    }
}