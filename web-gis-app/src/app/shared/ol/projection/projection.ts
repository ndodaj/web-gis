import { Projection } from 'ol/proj';

export const projections = {
  krgjshProjection: new Projection({
    code: 'EPSG:6870',
    extent: [-2963585.56, 3639475.76, 2404277.44, 9525908.77],
    worldExtent: [-90, -90, 90, 90],
    units: 'm',
  }),
  proj32634: new Projection({
    code: 'EPSG:32634',
    extent: [166021.44, 0.0, 833978.56, 9329005.18],
    worldExtent: [18.0, 0.0, 24.0, 84.0],
    units: 'm',
  }),
};
