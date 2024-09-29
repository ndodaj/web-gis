import VectorSource from "ol/source/Vector";
import { Options } from "ol/layer/BaseVector";
import VectorLayer from "ol/layer/Vector";
import VectorSourceType from "ol/source/Vector"

export default class ExtendedVectorLayer extends VectorLayer<VectorSource> {
  constructor(options?: Options<VectorSourceType> & { [prop: string]: any }) {
    super(options);
  }
}