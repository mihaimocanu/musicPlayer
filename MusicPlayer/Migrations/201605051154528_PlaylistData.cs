namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PlaylistData : DbMigration
    {
        public override void Up()
        {
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
                //.ForeignKey("dbo.PlaylistInfo", t => t.PlaylistId, cascadeDelete: true)
                .Index(t => t.PlaylistId);

            AddForeignKey("dbo.PlaylistDatas", "PlaylistId", "dbo.PlaylistInfoes", "PlaylistId", true);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PlaylistDatas", "PlaylistId", "dbo.PlaylistInfoes");
            DropIndex("dbo.PlaylistDatas", new[] { "PlaylistId" });
            DropTable("dbo.PlaylistDatas");
        }
    }
}
