using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class Album
    {
        public long AlbumId { get; set; }

        public string Title { get; set; }
        public string Artist { get; set; }
        public int Year { get; set; }

        public List<AlbumRating> Ratings { get; set; }
    }
}
