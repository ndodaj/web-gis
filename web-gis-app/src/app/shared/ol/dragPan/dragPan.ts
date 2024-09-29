import { DragPan } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
export const dragPan = new DragPan({
  condition: function (event) {
    return platformModifierKeyOnly(event);
  },
});
