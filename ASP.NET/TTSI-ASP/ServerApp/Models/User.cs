using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class User
    {
        public long UserId { get; set; }

        public List<AlbumRating> AlbumRatings { get; set; }
    }
}
