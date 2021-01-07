using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class AlbumRating
    {
        public long AlbumRatingId { get; set; }

        public int Points { get; set; }

        public Album Album { get; set; }
    }
}
