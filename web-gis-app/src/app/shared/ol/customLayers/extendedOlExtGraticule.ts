import ol_control_Graticule, { Options } from 'ol-ext/control/Graticule';
export default class ExtendedOlExtGraticule extends ol_control_Graticule {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
