import TileWMS, { Options } from 'ol/source/TileWMS';

export default class ExtendedTileWms extends TileWMS {
  private customExtent?: number[];

  constructor(options?: Options & { extent?: number[] }) {
    super(options);

    // Store the custom extent if provided
    if (options?.extent) {
      this.customExtent = options.extent;
    }
  }

  // Getter for the custom extent
  getExtent(): number[] | undefined {
    return this.customExtent;
  }
}
