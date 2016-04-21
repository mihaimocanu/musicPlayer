namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPlaylistData2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PlaylistData",
                c => new
                    {
                        ItemId = c.Int(nullable: false, identity: true),
                        PlaylistId = c.Int(nullable: false),
                        ItemName = c.String(nullable: false),
                        ItemPath = c.String(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ItemId)
                .ForeignKey("dbo.PlaylistInfo", t => t.PlaylistId, cascadeDelete: true)
                .Index(t => t.PlaylistId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlaylistData", "PlaylistId", "dbo.PlaylistInfo");
            DropIndex("dbo.PlaylistData", new[] { "PlaylistId" });
            DropTable("dbo.PlaylistData");
        }
    }
}
