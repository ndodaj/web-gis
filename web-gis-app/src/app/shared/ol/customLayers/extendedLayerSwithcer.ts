import LayerSwitcher, { Options } from 'ol-ext/control/LayerSwitcher';
import ExtendedTileLayer from './extendedTileLayer';
import ExtendedLayerGroup from './extendedLayerGroup';

export default class ExtendedLayerSwitcher extends LayerSwitcher {
  showSymbology: boolean;

  constructor(
    options?: Options & { showSymbology?: boolean; [prop: string]: any }
  ) {
    super(options);
    this.showSymbology = options?.showSymbology || false;
  }

  getLegendUrl(url: string): string {
    return (
      url ||
      'https://geoext.github.io/geoext2/website-resources/img/GeoExt-logo.png'
    );
  }

  // Override drawList to add legends to each layer item
  drawList(element: Element, collection: ExtendedTileLayer[]) {
    console.log(element);

    // Call the original drawList method
    super.drawList(element, collection);

    if (this.showSymbology) {
      collection.forEach((layer) => {
        let layersToIterate = [];

        // If the layer is a LayerGroup, extract its layers
        if (layer instanceof ExtendedLayerGroup) {
          layersToIterate = layer.getLayers().getArray(); // Get the individual layers
        } else {
          layersToIterate = [layer]; // It's a single layer
        }

        layersToIterate.forEach((individualLayer: any) => {
          console.log(individualLayer);

          const layerName =
            individualLayer.get('title') || individualLayer['values_']?.title;
          console.log(layerName);

          // Locate the <li> item by matching the label content with layer name
          const layerItem = Array.from(
            element.querySelectorAll('li.ol-layer-tile')
          ).find((li) => {
            console.log(li);

            const label = li.querySelector('.li-content label');
            console.log(label);

            return label?.textContent === layerName;
          });
          console.log(layerItem, individualLayer.getVisible());

          if (layerItem && individualLayer.getVisible()) {
            console.log(individualLayer.getSource().getLegendUrl());

            const legendUrl = this.getLegendUrl(
              individualLayer.getSource().getLegendUrl()
            );
            console.log(legendUrl);
            const existingLegends = layerItem.querySelectorAll('img');
            existingLegends.forEach((img) => img.remove());
            const legendImage = document.createElement('img');
            legendImage.src = legendUrl;
            legendImage.alt = `${layerName} Legend`;
            legendImage.style.height = '24px';
            legendImage.style.marginLeft = '24px';

            // Append the legend image to the `li-content` div within the layer item
            const contentDiv = layerItem.querySelector('.li-content');
            contentDiv?.appendChild(legendImage);
          }
        });
      });
    }
  }
}
