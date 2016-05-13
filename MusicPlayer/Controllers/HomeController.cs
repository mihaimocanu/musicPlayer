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
                    path = x.ItemPath
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
        public async Task<JsonResult> UploadPlaylistItem(int playlistId) //, List<PlaylistItem> itemsList)
        {
            try
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var currentUser = manager.FindById(User.Identity.GetUserId());
                
                foreach (string file in Request.Files)
                {
                    var fileContent = Request.Files[file];
                    if (fileContent != null && fileContent.ContentLength > 0)
                    {
                        // get a stream
                        var stream = fileContent.InputStream;
                        // and optionally write the file to disk
                        var fileName = Path.GetFileName(file);
                        var path = Path.Combine(Server.MapPath("~/App_Data/Music"), fileName);
                        using (var fileStream = System.IO.File.Create(path))
                        {
                            stream.CopyTo(fileStream);
                        }
                    }
                }
                //var files = Request.Files;
                //var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                //var currentUser = manager.FindById(User.Identity.GetUserId());
                //var newPlaylist = new PlaylistInfo();
                //newPlaylist.PlaylistName = name;
                //newPlaylist.CreatedAt = DateTime.Now;
                //newPlaylist.UpdatedAt = DateTime.Now;
                //newPlaylist.PlaylistItems = new List<PlaylistData>();
                //foreach (var item in itemsList)
                //{
                //    var plItem = new PlaylistData();
                //    plItem.ItemName = item.name;
                //    plItem.ItemPath = item.path;
                //    plItem.UpdatedAt = DateTime.Now;

                //    newPlaylist.PlaylistItems.Add(plItem);
                //}

                //currentUser.PlaylistsInfo.Add(newPlaylist);

                //IdentityResult resultAdd = await manager.UpdateAsync(currentUser);
                //if (resultAdd.Succeeded)
                //{
                    return this.Json("Success", JsonRequestBehavior.AllowGet);
                //}
                //else
                //{
                //    throw new Exception("Errors: " + String.Join(";", resultAdd.Errors));
                //}

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

            }

        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> UpdatePlaylist(int id, List<PlaylistItem> itemsList)
        {
            try
            {

                if (removePlaylistItems(id))
                {
                    var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                    var currentUser = manager.FindById(User.Identity.GetUserId());
                    var updatedPlaylist = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == id).FirstOrDefault();

                
                    foreach (var item in itemsList)
                    {
                        var plItem = new PlaylistData();
                        plItem.ItemName = item.name;
                        plItem.ItemPath = item.path;
                        plItem.UpdatedAt = DateTime.Now;

                        updatedPlaylist.PlaylistItems.Add(plItem);
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
                    throw new Exception("Error: Adding new items.");
                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

            }

        }

        private bool removePlaylistItems(int playlistId)
        {
            try
            {
                ApplicationDbContext dbContext = new ApplicationDbContext();
                string userId = User.Identity.GetUserId();
                var currentUser = dbContext.Users.Where(u => u.Id.Equals(userId)).FirstOrDefault();
                var playlistData = currentUser.PlaylistsInfo.Where(item => item.PlaylistId == playlistId).FirstOrDefault();

                var playlistItems = playlistData.PlaylistItems.Select(x => x.ItemId).ToList();

                foreach (var item in playlistItems)
                {
                    var deleteItem = playlistData.PlaylistItems.Where(x => x.ItemId == item).FirstOrDefault();
                    dbContext.Entry(deleteItem).State = EntityState.Deleted;
                }

                dbContext.SaveChanges();

                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message+" - on remiving playlist items");
            }

        }

    }
}