namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FBId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "UserFacebookId", c => c.String(maxLength: 50));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "UserFacebookId");
        }
    }
}
