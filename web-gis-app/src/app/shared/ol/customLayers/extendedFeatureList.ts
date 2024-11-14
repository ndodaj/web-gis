import ol_control_FeatureList, { Options } from 'ol-ext/control/FeatureList';
export default class ExtendedOlControlFeatureList extends ol_control_FeatureList {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
