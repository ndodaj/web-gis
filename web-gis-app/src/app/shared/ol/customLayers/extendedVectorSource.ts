import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { Options } from 'ol/source/Tile';

export default class ExtendedVectorSource extends VectorSource<
  Feature<Geometry>
> {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
