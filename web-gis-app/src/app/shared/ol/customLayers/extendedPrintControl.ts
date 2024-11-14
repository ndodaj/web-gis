import PrintDialog, { Options } from 'ol-ext/control/PrintDialog';
export default class ExtendedPrintDialog extends PrintDialog {
  constructor(options?: Options & { [prop: string]: any }) {
    super(options);
  }
}
