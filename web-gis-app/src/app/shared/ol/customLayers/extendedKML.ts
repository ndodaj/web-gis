import { KML } from 'ol/format';
import JSZip from 'jszip';

const zip = new JSZip();

const getKMLImage = async (href: any) => {
  const index = window.location.href.lastIndexOf('/');
  if (index !== -1) {
    const kmlFile = zip.file(href.slice(index + 1));
    if (kmlFile) {
      const arrayBuffer = await kmlFile.async('arraybuffer');
      return URL.createObjectURL(new Blob([arrayBuffer]));
    }
  }
  return href;
};

export default class ExtendedKMZ extends KML {
  constructor(opt_options: any = {}) {
    // Provide default empty object for options
    opt_options.iconUrlFunction = getKMLImage;
    super(opt_options);
  }
}
