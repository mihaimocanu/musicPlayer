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
            //var userId = User.Identity.GetUserId();

            return this.Json("Success", JsonRequestBehavior.AllowGet);
            //var currentUser = manager.FindById(User.Identity.GetUserId());

            //List<IdentityUserRole> roles = currentUser.Roles.ToList();

            //bool isAdmin = roles.Where(role => role.RoleId.Equals(ConfigurationManager.AppSettings["Admin.Role.Id"])).Count() > 0 ? true : false;

            //if (!isAdmin)
            //{
            //    return this.Json("Error_" + Resource.BackendAdmin_NotLoggedError_Msg);
            //}
            //else
            //{
            //    try
            //    {
            //        ApplicationUser changedUser = await manager.FindByIdAsync(saveData.Id);
            //        if (changedUser != null)
            //        {

            //            changedUser.Email = saveData.Email;
            //            changedUser.CompanyName = saveData.CompanyName;
            //            changedUser.Firstname = saveData.Firstname;
            //            changedUser.Lastname = saveData.Lastname;
            //            //changedUser.Street=saveData.Street;
            //            //changedUser.PostCode=saveData.PostCode;
            //            //changedUser.City=saveData.City;
            //            changedUser.Country = saveData.Country;

            //            IdentityResult resultApprove = await manager.UpdateAsync(changedUser);
            //            if (resultApprove.Succeeded)
            //            {
            //                return this.Json("Success");
            //            }
            //            else
            //            {
            //                return this.Json("Error_" + Resource.BackendAdmin_UpdateError_Msg);
            //            }
            //        }
            //        else
            //        {
            //            return this.Json("Error_" + Resource.BackendAdmin_UserNotFound_Msg);
            //        }
            //    }
            //    catch (Exception e)
            //    {
            //        return this.Json("Error_" + Resource.BackendAdmin_InternalServerError_Msg);
            //    }
            //}

        }
    }
}