import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

export const projFunc = () => {
  // proj4.defs(
  //   'EPSG:6870',
  //   '+proj=tmerc +lat_0=0 +lon_0=20 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
  // );
  // register(proj4);

  proj4.defs(
    'EPSG:32634',
    '+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs +type=crs'
  );

  register(proj4);
};
