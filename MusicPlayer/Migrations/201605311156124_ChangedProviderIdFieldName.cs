namespace MusicPlayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedProviderIdFieldName : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "UserProviderId", c => c.String(maxLength: 50));
            DropColumn("dbo.AspNetUsers", "UserFacebookId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "UserFacebookId", c => c.String(maxLength: 50));
            DropColumn("dbo.AspNetUsers", "UserProviderId");
        }
    }
}
