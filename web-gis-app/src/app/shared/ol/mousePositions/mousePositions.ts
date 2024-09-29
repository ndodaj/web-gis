import { MousePosition } from "ol/control";
import { Coordinate, toStringXY } from "ol/coordinate";

export const mousePositions = {
    mousePosition: new MousePosition({
        className: 'ol-mouse-position1',
        coordinateFormat: (coordinate: any) => {
          return 'KRGJSH : ' + toStringXY(coordinate, 2);
        },
      }),
      mousePositionControl: new MousePosition({
        coordinateFormat: function (coordinate) {
          return 'KRGJSH : ' + toStringXY(coordinate as Coordinate, 2);
        },
        className: 'custom-mouse-position',
      })
}