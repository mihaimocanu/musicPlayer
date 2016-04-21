namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateDB2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PlaylistInfo",
                c => new
                    {
                        PlaylistId = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        PlaylistName = c.String(nullable: false),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PlaylistId)
                .ForeignKey("dbo.UserProfile", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlaylistInfo", "UserId", "dbo.UserProfile");
            DropIndex("dbo.PlaylistInfo", new[] { "UserId" });
            DropTable("dbo.PlaylistInfo");
        }
    }
}
