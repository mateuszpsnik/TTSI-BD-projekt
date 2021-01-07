import { AlbumRating } from "./AlbumRating.model";

export class Album {
  constructor(
    public albumId?: number,
    public title?: string,
    public artist?: string,
    public year?: number,
    public ratings?: AlbumRating[]
  ) {}
}
