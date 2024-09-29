import { FullScreen } from "ol/control";

export const fullScreen = {
  fullScreenControl: new FullScreen({
    tipLabel: 'Click to fullscreen the map',
    className: 'ol-full-screen',
  }),
};