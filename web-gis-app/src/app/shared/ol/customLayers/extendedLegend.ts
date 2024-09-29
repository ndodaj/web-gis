import ol_legend_Legend, { Options } from 'ol-ext/legend/Legend';
export default class ExtendedLegend extends ol_legend_Legend {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
