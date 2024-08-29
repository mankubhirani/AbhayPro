export interface SportItem {
  sportId: string;
  sportName: string;
  imageUrl: string;
  gameId: number;
}

export interface CarouselItemsChunk extends Array<SportItem> {}

export interface MenuResponse {
  menuList: SportItem[];
}
