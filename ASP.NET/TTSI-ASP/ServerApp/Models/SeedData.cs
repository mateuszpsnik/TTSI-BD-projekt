using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class SeedData
    {
        public static void SeedDatabase(DataContext context)
        {
            context.Database.Migrate();

            Album a1 = new Album
            {
                Artist = "AAA",
                Title = "AAA",
                Year = 2000
            };

            Album a2 = new Album
            {
                Artist = "BBB",
                Title = "BBB",
                Year = 2000,
                Ratings = new List<AlbumRating> { new AlbumRating { Points = 8 },
                        new AlbumRating { Points = 7 }}
            };

            if (context.Albums.Count() == 0)
            {
                context.Albums.AddRange(a1, a2);
                context.SaveChanges();
            }

            if (context.Users.Count() == 0)
            {
                context.Users.AddRange(new User
                {
                    AlbumRatings = new List<AlbumRating>
                    {
                        new AlbumRating { Album = a1, Points = 8 },
                        new AlbumRating { Album = a2, Points = 7 }
                    },
                },
                new User
                {
                    AlbumRatings = new List<AlbumRating>
                    {
                        new AlbumRating { Album = a1, Points = 10 },
                        new AlbumRating { Album = a2, Points = 5 }
                    }
                }
                );

                context.SaveChanges();
            }
        }
    }
}
