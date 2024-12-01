import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  QueryList,
  ViewChildren,
  SimpleChanges,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { stagger60ms } from '@shared/animations/stagger.animation';
import { MapService } from '@shared/services/map.service';
import { FilterDialogComponent } from './filter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import ExtendedLayerGroup from '@shared/ol/customLayers/extendedLayerGroup';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import { TileWMS } from 'ol/source';
import { GeoJSON } from 'ol/format';
import ExtendedVectorSource from '@shared/ol/customLayers/extendedVectorSource';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import ExtendedVectorLayer from '@shared/ol/customLayers/extendedVectorLayer';

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-features-list',
  templateUrl: './feature-list.component.html',
  animations: [stagger60ms],
})
export class FeaturesListComponent implements OnInit {
  @Input() layers!: any;
  @Input() reloadLayer!: boolean;
  @Output() reloadLayerChange = new EventEmitter<boolean>();
  dataSource = new MatTableDataSource<any>();
  displayedColumns: ColumnConfig[] = [];
  columnFilters: { [key: string]: string } = {};
  @ViewChildren(MatMenuTrigger) menuTriggers!: QueryList<MatMenuTrigger>;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @Input() dialogVisible!: boolean;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  selectedRow: any = null;
  editingRow: any = null;
  //layers: any[] = []; // List of layers
  layerWFS: any;
  featureListsData: any;
  featureListsData2: any;
  selectedLayer!: any; // Selected layer
  vectorSource!: any;
  selected = new Style({
    fill: new Fill({
      color: '#eeeeee',
    }),
    stroke: new Stroke({
      color: 'rgba(255, 255, 255, 0.7)',
      width: 2,
    }),
  });
  highlightLayer = new ExtendedVectorLayer({
    source: new ExtendedVectorSource(),
    style: new Style({
      fill: new Fill({
        color: '#eeeeee',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
      }),
    }), // Use the highlight style defined earlier
  });
  // Map instance (ensure it's set externally or injected)
  constructor(private mapService: MapService, private dialog: MatDialog) {}
  get visibleColumns() {
    return this.displayedColumns.filter((c) => c.visible).map((c) => c.key);
  }

  ngOnInit() {
    this.loadLayers(); // Initialize layers
    this.dataSource.sort = this.sort;
    this.createFilterPredicate();
  }
  ngOnChanges(changes: SimpleChanges) {
    // Detect changes to reloadLayer input
    console.log('changes', changes);

    if (changes['reloadLayer']) {
      this.loadLayers(); // Reload layers when reloadLayer is set to true
    }
  }
  reloadLayers(reload: boolean) {
    this.dialogVisibleChange.emit(this.reloadLayer);
    if (reload) {
      this.loadLayers();
    }
  }
  // Load vector layers into the dropdown
  loadLayers() {
    const map = this.mapService.getMap();
    if (!map) {
      console.error('Map instance not available.');
      return;
    }

    const allLayers: any[] = [];

    // Traverse through the layers
    map.getLayers().forEach((layerGroup) => {
      if (layerGroup instanceof ExtendedLayerGroup) {
        // Iterate through layers within the group
        layerGroup.getLayers().forEach((layer) => {
          console.log('la', layer);

          if (
            layer instanceof ExtendedTileLayer &&
            layer.getSource() instanceof TileWMS &&
            layer.isVisible()
          ) {
            // Add WMS layer to the list
            allLayers.push(layer);

            // Example of fetching feature info URL (if needed)
            const viewResolution = map.getView().getResolution();
            if (viewResolution) {
              const url = (layer.getSource() as TileWMS).getFeatureInfoUrl(
                /* Example coordinate, update based on context */
                [2199703.86630228, 5238615.54830713],
                viewResolution,
                map.getView().getProjection(),
                {
                  INFO_FORMAT: 'application/json',
                  FEATURE_COUNT: 1,
                }
              );
              if (url) {
                console.log(
                  `Feature info URL for layer "${layer.get('name')}":`,
                  url
                );

                fetch(url)
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);

                    if (data?.features?.length > 0) {
                      const properties = data.features[0]?.properties;
                      console.log('Feature properties:', properties);
                    }
                  })
                  .catch((error) =>
                    console.error('Error fetching feature info:', error)
                  );
              }
            }
          }
        });
      }
    });

    this.layers = allLayers;
    console.log('Extracted layers:', this.layers);
  }

  readGroupLayers(groupLayers: any[]): any[] {
    const layers: any[] = [];
    groupLayers.forEach((layer: any) => {
      if (layer.getLayers) {
        // Recursively read layers if it's a group
        layers.push(...this.readGroupLayers(layer.getLayers().getArray()));
      } else {
        layers.push(layer);
      }
    });
    return layers;
  }

  // Method to handle layer selection and feature fetching
  onLayerSelect(layer: any) {
    this.vectorSource = null;
    this.featureListsData = null;
    this.selectedLayer = layer;
    console.log('selectedLayer', this.selectedLayer);
    this.fetchData();
  }

  // Fetching data from WFS service
  async fetchData() {
    try {
      // Construct the WFS request URL using layer parameters
      const layerParams = this.selectedLayer.getSource().getParams().LAYERS;
      console.log('layerParams', layerParams);
      const [namespace, layerName] = (layerParams || '').split(':');
      this.layerWFS = `http://20.67.236.132:8080/geoserver/${namespace}/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&outputFormat=json`;
      console.log(this.layerWFS);

      // Perform the HTTP request to fetch data
      const response = await fetch(this.layerWFS);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // Convert GeoJSON features to OpenLayers features
        const features = data.features.map((feature: any) => {
          const olFeature = new GeoJSON().readFeature(feature);
          return olFeature;
        });

        // Create a new vector source with features
        this.vectorSource = new ExtendedVectorSource({
          features: features,
        });
        console.log(this.vectorSource.getFeatureById('line.1'));

        // Extract properties from features for table display
        this.featureListsData = this.vectorSource
          .getFeatures()
          .map((feature: any) => {
            const properties = feature.getProperties();
            console.log('properties', properties, feature.getId());

            delete properties.geometry;
            return {
              featureId: feature.getId(),
              // id: properties.id || '', // Use the feature ID or a fallback
              // name: properties.name || '',
              // geometryType: feature.getGeometry()?.getType() || 'Unknown', // Geometry type
              ...properties,
            };
          });

        console.log('Formatted Features:', this.featureListsData);

        // Update the data source and displayed columns
        this.dataSource.data = this.featureListsData;
        this.updateDisplayedColumns(this.featureListsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  onRowClick(row: any): void {
    console.log(
      'Row clicked:',
      row,
      this.vectorSource.getFeatureById(row.featureId)
    );

    const feature = this.vectorSource.getFeatureById(row.featureId);

    if (feature) {
      // Highlight the feature
      this.highlightFeature(feature);

      // Zoom to the feature extent
      this.zoomToFeatureExtent(feature);

      this.selectedRow = row;
    } else {
      console.error('Feature not found for ID:', row.featureId);
    }
  }

  zoomToFeatureExtent(feature: any) {
    const extent = feature.getGeometry().getExtent();
    console.log('zoomToFeatureExtent', feature);

    this.mapService
      .getMap()
      .getView()
      .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
  }
  highlightFeature(feature: any): void {
    // Add the highlight layer to the map only if it hasn't been added yet
    const map = this.mapService.getMap();
    if (!map.getLayers().getArray().includes(this.highlightLayer)) {
      map.addLayer(this.highlightLayer);
    }

    const highlightSource = this.highlightLayer.getSource(); // Source for the highlight layer

    if (!highlightSource) {
      console.error('No source found in the highlight layer');
      return;
    }

    // Clear any previously added features to avoid duplicates
    highlightSource.clear();

    // Determine the geometry type and set the appropriate style
    const geometryType = feature.getGeometry().getType();

    let style: Style;

    switch (geometryType) {
      case 'Point':
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: 'rgba(255, 255, 255, 0.7)',
              width: 2,
            }),
          }),
        });
        break;

      case 'LineString':
      case 'MultiLineString':
        style = new Style({
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.7)', // Red stroke for lines
            width: 3,
          }),
        });
        break;

      case 'Polygon':
      case 'MultiPolygon':
        style = new Style({
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.7)', // Red stroke for polygons
            width: 3,
          }),
        });
        break;

      default:
        console.warn('Unknown geometry type:', geometryType);
        style = new Style({
          stroke: new Stroke({
            color: 'gray',
            width: 1,
          }),
        });
        break;
    }

    // Apply the style to the feature
    feature.setStyle(style);

    // Add the styled feature to the highlight layer source
    highlightSource.addFeature(feature);
  }

  // Dynamically update displayed columns based on feature properties
  updateDisplayedColumns(data: any[]) {
    if (data.length > 0) {
      this.displayedColumns = Object.keys(data[0]).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize for display
        visible: true,
      }));
    } else {
      this.displayedColumns = [];
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyColumnFilter(columnKey: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement?.value || '';
    this.columnFilters[columnKey] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.columnFilters); // Triggers filter update
  }

  createFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const columnFilters = JSON.parse(filter);
      return Object.keys(columnFilters).every((columnKey) => {
        const columnFilterValue = columnFilters[columnKey];
        return data[columnKey]
          ?.toString()
          .toLowerCase()
          .includes(columnFilterValue);
      });
    };
  }
  refresh() {
    this.dataSource.filter = '';
  }
  closeDialog() {
    this.dialogVisible = false;
    this.dialogVisibleChange.emit(this.dialogVisible);
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Filters applied:', result);
        // Process the filters as needed
      }
    });
  }
  getFilterMenu(column: string): MatMenuPanel<any> | null {
    const index = this.visibleColumns.indexOf(column);
    const trigger = this.menuTriggers.toArray()[index];
    return trigger ? trigger.menu : null;
  }

  reset(data: any): void {
    console.log(data);
  }

  editRow(row: any) {
    console.log('row', row);

    this.editingRow = row; // Clone the row data
  }
  saveRow(row: any) {
    const index = this.dataSource.data.findIndex((item) => item.id === row.id);
    if (index !== -1) {
      this.dataSource.data[index] = { ...this.editingRow }; // Update row with edited data
      this.dataSource._updateChangeSubscription(); // Notify table to refresh
      this.editingRow = null; // Exit edit mode
    }
  }

  cancelEdit() {
    this.editingRow = null; // Exit edit mode without saving
  }

  deleteRow(row: any) {
    this.dataSource.data = this.dataSource.data.filter(
      (item) => item.id !== row.id
    );
  }
}
