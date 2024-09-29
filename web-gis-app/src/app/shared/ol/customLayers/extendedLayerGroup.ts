import LayerGroup, {Options} from "ol/layer/Group";

export default class ExtendedLayerGroup extends LayerGroup {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}