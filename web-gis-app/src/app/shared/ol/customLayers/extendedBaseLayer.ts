import BaseLayer, { Options } from 'ol/layer/Base';
export default class ExtendedBaseLayer extends BaseLayer {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
