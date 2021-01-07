import { Album } from "./album.model";

export class AlbumRating {
  constructor(
    public albumRatingId?: number,
    public points?: number,
    public album?: Album
  ) { }
}
