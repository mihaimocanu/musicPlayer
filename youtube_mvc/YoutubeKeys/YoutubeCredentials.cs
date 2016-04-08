using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.Util.Store;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using System.IO;
using System.Threading;
using System.Web.Hosting;

namespace youtube_mvc.YoutubeKeys
{
    public class YoutubeCredentials
    {
        public static YouTubeService youtubeService = null;

        public static async Task Login()
        {
            UserCredential credential;
            using (var stream = new FileStream(Path.Combine(HostingEnvironment.ApplicationPhysicalPath, @"YoutubeKeys\", "client_secrets.json"), FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows for full read/write access to the
                    // authenticated user's account.
                    new[] { YouTubeService.Scope.YoutubeForceSsl},
                    "user",
                    CancellationToken.None,
                    new FileDataStore("credential")
                );
            }

            youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "youtubeApi"
            });
        }
    }
}
