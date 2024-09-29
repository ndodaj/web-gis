import LayerSwitcher, { Options } from 'ol-ext/control/LayerSwitcher';
export default class ExtendedLayerSwitcher extends LayerSwitcher {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
