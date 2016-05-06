namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class customDB : DbMigration
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
            
            CreateTable(
                "dbo.PlaylistDatas",
                c => new
                    {
                        ItemId = c.Int(nullable: false, identity: true),
                        PlaylistId = c.Int(nullable: false),
                        ItemName = c.String(nullable: false, maxLength: 200),
                        ItemPath = c.String(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ItemId)
                .ForeignKey("dbo.PlaylistInfoes", t => t.PlaylistId, cascadeDelete: true)
                .Index(t => t.PlaylistId);
            
            AddColumn("dbo.AspNetUsers", "UserFacebookId", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlaylistInfoes", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.PlaylistDatas", "PlaylistId", "dbo.PlaylistInfoes");
            DropIndex("dbo.PlaylistDatas", new[] { "PlaylistId" });
            DropIndex("dbo.PlaylistInfoes", new[] { "UserId" });
            DropColumn("dbo.AspNetUsers", "UserFacebookId");
            DropTable("dbo.PlaylistDatas");
            DropTable("dbo.PlaylistInfoes");
        }
    }
}
