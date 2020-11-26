declare module "@iov/asset-directory" {
  interface AssetBase {
    readonly "caip-19": string | null;
    readonly symbol: string;
  }
  export interface Asset extends AssetBase {
    readonly "trustwallet-uid": string;
  }

  export interface AssetStarname extends AssetBase {
    readonly logo: string;
    readonly name: string;
    readonly "starname-uri": string;
  }

  export const assets: ReadonlyArray<Asset>;
  export const assetsStarname: ReadonlyArray<AssetStarname>;
}
