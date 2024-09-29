import { Fill, RegularShape, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

export const customStyles = {
  country: new Style({
    stroke: new Stroke({
      color: 'gray',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(20,20,20,0.9)',
    }),
  }),
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
    }),
  }),
  labelStyle: new Style({
    text: new Text({
      font: '14px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [3, 3, 3, 3],
      textBaseline: 'bottom',
      offsetY: -15,
    }),
    image: new RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
    }),
  }),
  tipStyle: new Style({
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  }),
  modifyStyle: new Style({
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
    // text: new Text({
    //   text: 'Zvarrit për të modifikuar',
    //   font: '12px Calibri,sans-serif',
    //   fill: new Fill({
    //     color: 'rgba(255, 255, 255, 1)',
    //   }),
    //   backgroundFill: new Fill({
    //     color: 'rgba(0, 0, 0, 0.7)',
    //   }),
    //   padding: [2, 2, 2, 2],
    //   textAlign: 'left',
    //   offsetX: 15,
    // }),
  }),
  segmentStyle: new Style({
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textBaseline: 'bottom',
      offsetY: -12,
    }),
    image: new RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
  }),
  pointStyle: new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: [95, 221, 44, 1],
      }),
      radius: 4,
      stroke: new Stroke({
        color: [95, 221, 44, 1],
        width: 2,
      }),
    }),
  }),
  lineStringStyle: new Style({
    stroke: new Stroke({
      color: [251, 254, 250, 1],
      width: 2,
    }),
  }),
  blueCountriesStyle: new Style({
    fill: new Fill({
      color: [135, 158, 223, 1],
    }),
    stroke: new Stroke({
      color: [251, 254, 250, 1],
    }),
  }),
  purpleCountriesStyle: new Style({
    fill: new Fill({
      color: [205, 103, 160, 1],
    }),
    stroke: new Stroke({
      color: [251, 254, 250, 1],
    }),
  }),
  geoStyle: new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: 'red',
      }),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  }),
  printControl2Style: new Style({
    text: new Text({
      font: '20px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif',
    }),
  }),
  strokeStyle: new Stroke({
    color: 'rgba(255, 120, 0, 0.9)',
    width: 2,
    lineDash: [0.5, 4],
  })
};
