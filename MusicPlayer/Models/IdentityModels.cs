using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;

namespace MusicPlayer.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(50)]
        public string UserFacebookId { get; set; }
        public virtual List<PlaylistInfo> PlaylistsInfo { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class PlaylistInfo
    {
        [Key, Column(Order = 0)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int PlaylistId { get; set; }

        [Required]
        [Column(Order = 1)]
        [ForeignKey("User")]
        public string UserId { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "No more than 100 characters")]
        public string PlaylistName { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public DateTime UpdatedAt { get; set; }

        public virtual ApplicationUser User { get; set; }

        public virtual List<PlaylistData> PlaylistItems { get; set; }
    }

    public class PlaylistData
    {
        [Key, Column(Order = 0)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int ItemId { get; set; }

        [Required]
        [Column(Order = 1)]
        [ForeignKey("Playlist")]
        public int PlaylistId { get; set; }

        [Required]
        [MaxLength(200, ErrorMessage = "No more than 200 characters")]
        public string ItemName { get; set; }

        [Required]
        public string ItemPath { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        public virtual PlaylistInfo Playlist { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}