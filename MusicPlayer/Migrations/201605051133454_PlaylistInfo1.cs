namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PlaylistInfo1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PlaylistInfoes",
                c => new
                    {
                        PlaylistId = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        PlaylistName = c.String(nullable: false, maxLength: 100),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PlaylistId)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlaylistInfoes", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.PlaylistInfoes", new[] { "UserId" });
            DropTable("dbo.PlaylistInfoes");
        }
    }
}
