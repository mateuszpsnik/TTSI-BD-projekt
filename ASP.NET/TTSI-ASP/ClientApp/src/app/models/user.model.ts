import { AlbumRating } from "./AlbumRating.model";

export class User {
  constructor(
    public userId?: number,
    public albumRatings?: AlbumRating[]
  ) { }
}
