import TileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { Options } from "ol/layer/BaseTile";

export default class ExtendedTileLayer extends TileLayer<TileSource> {
  constructor(options?: Options<TileSource> & { [prop: string]: any }) {
    super(options);
    
  }
}