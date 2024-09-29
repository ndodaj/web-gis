import { Injectable } from '@angular/core';

import { DragElementService } from '../drag/drag-element.service';
import { AppConfigService } from '@core/services/app-config.service';
import { BaseService } from '@core/api/base-service';

@Injectable({
  providedIn: 'root',
})
export class LayerControlService extends BaseService {
  layerWFS!: any;
  layers: any;
  value!: any;
  uniqueValuesMap: any = null;

  constructor(
    public dragElService: DragElementService,
    config: AppConfigService
  ) {
    super(config);
  }

  addLayerToQuery(layers?: any) {
    this.layers = layers;
    let layerSelect = document.getElementById(
      'layerSelect'
    ) as HTMLInputElement;

    layerSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a layer...';
    layerSelect.appendChild(defaultOption);
    this.layers.forEach((wmsLayer: any, index: any) => {
      if (wmsLayer.getVisible()) {
        const layerToAdd = this.layers[index];
        const option = document.createElement('option');
        option.value = index.toString();
        option.text = layerToAdd.get('title');
        layerSelect.appendChild(option);
      }
    });
  }

  async fetchAndExtractKeys(layerURL: string) {
    const uniqueValuesMap: { [key: string]: any } = {};

    try {
      const response = await fetch(layerURL);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const features = data.features as any[];

      features.forEach((feature) => {
        const properties = feature.properties;

        for (const key in properties) {
          if (properties.hasOwnProperty(key)) {
            if (!uniqueValuesMap[key]) {
              uniqueValuesMap[key] = new Set();
            }
            uniqueValuesMap[key].add(properties[key]);
          }
        }
      });

      return uniqueValuesMap;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }

  async getFields() {
    //let uniqueValuesMap;
    const fieldSelect = document.getElementById('fieldSelect') as HTMLElement;
    const attributeSelect = document.getElementById(
      'attributeSelect'
    ) as HTMLElement;
    const layerSelect = document.getElementById(
      'layerSelect'
    ) as HTMLInputElement;

    fieldSelect.innerHTML = '';
    attributeSelect.innerHTML = '';
    let fields: any = [];
    const selectedLayerIndex = parseInt(layerSelect.value);

    const selectedLayer = this.layers[selectedLayerIndex];

    if (selectedLayer) {
      this.uniqueValuesMap = await this.fetchAndExtractKeys(this.layerWFS);
    }

    if (this.uniqueValuesMap) {
      const allKeys = Object.keys(this.uniqueValuesMap);
      const filteredKeys = allKeys.filter((key) => key !== 'geometry');

      filteredKeys.forEach((key) => {
        fields.push(key);
      });

      fields.forEach((value: any) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        fieldSelect.appendChild(option);
      });
    }
  }

  resetFilter() {
    let layerSelect: any = document.getElementById('layerSelect')!;
    const selectedLayerIndex = parseInt(layerSelect.value);
    const selectedLayer = this.layers[selectedLayerIndex];

    if (selectedLayer) {
      const targetSource: any = selectedLayer.getSource();

      if (targetSource) {
        const params = targetSource.getParams();
        delete params.CQL_FILTER;
        params.CQL_FILTER = 'accepted = true';
        targetSource.updateParams(params);
      }
    }
  }
  filterCQL() {
    const attributeSelect = document.getElementById(
      'attributeSelect'
    ) as HTMLInputElement;
    const fieldSelect = document.getElementById(
      'fieldSelect'
    ) as HTMLInputElement;
    const operatorSelect = document.getElementById(
      'operator'
    ) as HTMLInputElement;
    let layerSelect = document.getElementById(
      'layerSelect'
    ) as HTMLInputElement;
    const selectedLayerIndex = parseInt(layerSelect.value);
    const selectedLayer = this.layers[selectedLayerIndex];

    // Check if the attribute select dropdown is hidden (number field)
    const attributeInput = document.getElementById(
      'attributeInput'
    ) as HTMLInputElement;
    let targetSource = selectedLayer.getSource();

    if (targetSource) {
      // @ts-ignore
      const params = targetSource.getParams();
      const selectedField = fieldSelect.value;

      const selectedOperator = operatorSelect.value;

      let selectedAttribute;

      if (attributeInput) {
        selectedAttribute = attributeInput.value.toUpperCase();

        let CQLFilter =
          selectedField +
          ' ' +
          selectedOperator +
          " '" +
          selectedAttribute +
          "%'";

        CQLFilter += ' AND accepted = true';
        params.CQL_FILTER = CQLFilter;
      } else {
        selectedAttribute = attributeSelect.value;

        let CQLFilter =
          selectedField +
          ' ' +
          selectedOperator +
          " '" +
          selectedAttribute +
          "'";
        CQLFilter += ' AND accepted = true';
        params.CQL_FILTER = CQLFilter;
      }

      // @ts-ignore
      targetSource.updateParams(params);
    }
  }
  operatorSelect() {
    const operatorSelect = document.getElementById(
      'operator'
    ) as HTMLInputElement;
    operatorSelect?.addEventListener('change', () => {
      this.getAttributeValues();
    });
  }

  getAttributeValues = async () => {
    const fieldSelect = document.getElementById(
      'fieldSelect'
    ) as HTMLSelectElement;
    // let layerSelect = document.getElementById(
    //   'layerSelect'
    // ) as HTMLInputElement;
    const operatorSelect = document.getElementById(
      'operator'
    ) as HTMLInputElement;
    const attributeSelect = document.getElementById(
      'attributeSelect'
    ) as HTMLInputElement;

    const selectedField = fieldSelect.value;

    const selectedOperator = operatorSelect.value;

    const attributeInput = document.getElementById('attributeInput');
    if (attributeInput) {
      attributeInput.remove();
    }

    if (
      selectedOperator === 'LIKE' ||
      selectedOperator === '>' ||
      selectedOperator === '<'
    ) {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'attributeInput';
      input.placeholder = 'Enter a value';
      if (attributeSelect) {
        attributeSelect.style.display = 'none';

        attributeSelect.parentNode?.insertBefore(input, attributeSelect);
      }
    } else {
      attributeSelect.style.display = 'block';
      attributeSelect.innerHTML = '';

      const uniqueValuesSet = this.uniqueValuesMap[selectedField];
      if (uniqueValuesSet) {
        const uniqueValuesArray = Array.from(uniqueValuesSet);

        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        attributeSelect.appendChild(emptyOption);

        uniqueValuesArray.forEach((value) => {
          const option = document.createElement('option') as HTMLOptionElement;
          option['value'] = value as string;
          option['textContent'] = value as string;
          attributeSelect.appendChild(option);
        });
      }
    }
  };

  areAttributesNumeric(selectedField: any) {
    if (!selectedField || !this.uniqueValuesMap[selectedField]) {
      return false;
    }
    const uniqueValuesSet = this.uniqueValuesMap[selectedField];

    for (const value of uniqueValuesSet) {
      if (isNaN(parseFloat(value))) {
        return false;
      }
    }
    return true;
  }

  updateOperatorOptions() {
    const fieldSelect = document.getElementById(
      'fieldSelect'
    ) as HTMLInputElement;
    const greaterThanOption = document.querySelector(
      'option[value=">"]'
    ) as HTMLInputElement;
    const lessThanOption = document.querySelector(
      'option[value="<"]'
    ) as HTMLInputElement;
    const likeOption = document.querySelector(
      'option[value="LIKE"]'
    ) as HTMLInputElement;
    const selectedField = fieldSelect.value;
    greaterThanOption.disabled = !this.areAttributesNumeric(selectedField);
    lessThanOption.disabled = !this.areAttributesNumeric(selectedField);
    likeOption.disabled = this.areAttributesNumeric(selectedField);
  }

  layerSelectionChange() {
    const layerSelect = document.getElementById(
      'layerSelect'
    ) as HTMLSelectElement;

    layerSelect?.addEventListener('change', () => {
      const selectedIndex: any = layerSelect.value;
      const selectedLayer = this.layers[selectedIndex];

      const selectedLayerSource: any = selectedLayer?.getSource()!;
      const layerParams = selectedLayerSource?.getParams()?.LAYERS;
      this.layerWFS = `${this.geoserverUrl}/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerParams}&outputFormat=json`;
      this.getFields();
      this.getAttributeValues();
      this.updateOperatorOptions();
    });
  }
}
