using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using MusicPlayer.Helpers;
using MusicPlayer.Models;
using System;
using System.Collections.Generic;
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
                //var userId = User.Identity.GetUserId();
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var userId = User.Identity.GetUserId();
                var currentUser = manager.FindById(User.Identity.GetUserId());
                
                return this.Json(currentUser.PlaylistsInfo.Select(x => new { 
                    id=x.PlaylistId,
                    name=x.PlaylistName,
                    updatedAt=x.UpdatedAt
                }), JsonRequestBehavior.AllowGet);
            }
            catch(Exception e)
            {
                throw new Exception(e.Message);

            }
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> SavePlaylist(string name, List<PlaylistItem> itemsList)
        {
            try
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var currentUser = manager.FindById(User.Identity.GetUserId());
                var newPlaylist= new PlaylistInfo();
                newPlaylist.PlaylistName=name;
                newPlaylist.CreatedAt=DateTime.Now;
                newPlaylist.UpdatedAt=DateTime.Now;
                newPlaylist.PlaylistItems = new List<PlaylistData>();
                foreach (var item in itemsList)
                {
                    var plItem=new PlaylistData();
                    plItem.ItemName=item.name;
                    plItem.ItemPath=item.path;
                    plItem.UpdatedAt=DateTime.Now;

                    newPlaylist.PlaylistItems.Add(plItem);
                }

                currentUser.PlaylistsInfo.Add(newPlaylist);

                IdentityResult resultAdd = await manager.UpdateAsync(currentUser);
                if (resultAdd.Succeeded)
                {
                    return this.Json("Success", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    throw new Exception("Errors: "+String.Join(";", resultAdd.Errors));
                }

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
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
                var currentUser = manager.FindById(User.Identity.GetUserId());
                var updatedPlaylist = currentUser.PlaylistsInfo.Where(item =>item.PlaylistId==id).FirstOrDefault();
                updatedPlaylist.UpdatedAt = DateTime.Now;
                updatedPlaylist.PlaylistItems.RemoveRange(0, updatedPlaylist.PlaylistItems.Count);
                IdentityResult resultDelete = await manager.UpdateAsync(currentUser);
                if (resultDelete.Succeeded)
                {
                    updatedPlaylist.PlaylistItems = new List<PlaylistData>();
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
                    throw new Exception("Errors: " + String.Join(";", resultDelete.Errors));
                }
                

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);

            }

        }

    }
}