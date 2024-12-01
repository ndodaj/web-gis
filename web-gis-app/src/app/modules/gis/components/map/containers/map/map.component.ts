import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PopoverService } from '@core/services/popover.service';
import { ThemeConfigService } from '@core/services/theme-config.service';
import { UserMenuComponent } from '@layout/user-menu/user-menu.component';
import { TranslateService } from '@ngx-translate/core';

import { Observable, map, take, tap } from 'rxjs';
import { AutoUnsubscribe } from '@core/utils';
import { AccountService } from '@core/api/services/account.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { Feature } from 'ol';
import { extendedLayerGroup } from '@shared/ol/extendedLayerGroup/extendedLayerGroup';
import { MapService } from '@shared/services/map.service';
import { IndicatorCategoryDtoService } from '@core/api/services/indicator-category-dto.service';
import { IndicatorDtoService } from '@core/api/services/indicator-dto.service';
import ExtendedVectorLayer from '@shared/ol/customLayers/extendedVectorLayer';
import ExtendedVectorSource from '@shared/ol/customLayers/extendedVectorSource';
import { Geometry, Point } from 'ol/geom';
import ExtendedLayerGroup from '@shared/ol/customLayers/extendedLayerGroup';
import ExtendedTileLayer from '@shared/ol/customLayers/extendedTileLayer';
import { fromLonLat } from 'ol/proj';
@AutoUnsubscribe
@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  userDetail!: any;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('splitArea', { static: false }) splitArea!: ElementRef;
  isSidebarOpen = false;
  currentLanguage!: string;
  userVisible$: Observable<boolean> = this.themeConfigService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );
  @ViewChild(SplitComponent) splitComponent!: SplitComponent;
  @ViewChild(SplitAreaDirective) firstSplitArea!: SplitAreaDirective;
  secondSplitAreaSize = 10; // Initial size of the second split area (before collapse)
  isSecondSplitCollapsed = false;
  mapSize: number = 90; // Initial size of the map area
  mapHeight!: string;
  //map!: Map;
  opacityPercentage: number = 100;
  userName!: any;
  isLogedIn = this.authService.isLoggedIn() ? true : false;
  dropdownOpen!: boolean;
  direction = 'horizontal';
  selectedBaseLayer = 'osm';
  baselayers = [
    { name: 'OSM', image: 'assets/img/osmmap.png', layerType: 'osm' },
    {
      name: 'BingMap',
      image: 'assets/img/bingmap.png',
      layerType: 'bingmap',
    },
    {
      name: 'CartoDark',
      image: 'assets/img/cartodark.png',
      layerType: 'cartodark',
    },
  ];
  reloadLayer: boolean = false;
  activeTool: string | null = null;
  //layerGroups = [extendedLayerGroup.additionalLayers] as any;
  layerGroups: any[] = [];
  value!: any;
  isSecondAreaOpen = false;
  isExpanded: boolean = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  latitude: number | null = null; // Latitude input
  longitude: number | null = null; // Longitude input
  constructor(
    protected router: Router,
    private themeConfigService: ThemeConfigService,
    private authService: AuthService,
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private popover: PopoverService,
    private translateService: TranslateService,
    private mapService: MapService,
    private indicatorCategoryDtoService: IndicatorCategoryDtoService,
    private indicatorDtoService: IndicatorDtoService
  ) {
    this.currentLanguage = this.translateService.currentLang || 'en';
  }
  ngAfterViewInit() {
    // Wait until the view is initialized to access the DOM
    this.observeSplitArea();
  }
  ngOnInit(): void {
    console.log('map');
    this.userName = 'Gazmir Pisha';
    if (this.isLogedIn) {
      this.accountService
        .getCurrentUser()
        .pipe(
          take(1),
          tap((data: any) => {
            this.userDetail = data.data;

            this.userName = this.userDetail.username;
          })
        )
        .subscribe();
    }

    this.indicatorCategoryDtoService
      .getIndicatorCategories('ne', undefined)
      .pipe(
        take(1),
        tap((response) => {
          if (response?.content) {
            // Construct layer groups from API response
            this.layerGroups = response.content.map((group: any) => {
              const layerGroup = this.mapService.constructLayerGroup(group);
              this.mapService.getMap().addLayer(layerGroup);
              console.log(layerGroup, layerGroup.get('title'));

              this.indicatorCategoryDtoService
                .getLayerGroupsByName(layerGroup.get('title'), 'ne')
                .pipe(
                  take(1),
                  tap((res) => {
                    console.log('res', res);
                    const layers = res?.layerGroup?.publishables?.published;
                    const normalizedLayers = Array.isArray(layers)
                      ? layers
                      : [layers];
                    console.log('layers', layers);
                    normalizedLayers.forEach((element) => {
                      console.log(element);
                      layerGroup
                        .getLayers()
                        .push(this.mapService.constructTileLayer(element));
                      //this.mapService.constructTileLayer(response?.data)
                    });
                  })
                )
                .subscribe();
              console.log(this.indicatorDtoService.apiUrl);

              return layerGroup;
            });
            const staticLayerGroup = extendedLayerGroup.additionalLayers;
            console.log('staticLayerGroup', staticLayerGroup);

            this.mapService.getMap().addLayer(staticLayerGroup);

            // Combine static and API-generated groups
            this.layerGroups = [staticLayerGroup, ...(this.layerGroups || [])];
          }
        })
      )
      .subscribe();
  }
  observeSplitArea() {
    // Get the split area element
    const splitAreaElement = this.splitArea.nativeElement;

    // Create a ResizeObserver to monitor changes in the height of the split area
    const resizeObserver = new ResizeObserver(() => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        // Set the map's height to match the height of the split area
        mapElement.style.height = `${splitAreaElement.offsetHeight}px`;
      }
    });

    // Observe the split area for size changes
    resizeObserver.observe(splitAreaElement);
  }
  changeLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'sq' : 'en';
    this.translateService.use(newLanguage);
    this.currentLanguage = newLanguage;
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }
  selectBaselayer(layer: any) {
    console.log(layer);
  }
  goToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }
  toggleTool(tool: string) {
    this.activeTool = this.activeTool === tool ? null : tool;
  }
  setLayerExpand() {
    this.isExpanded = !this.isExpanded;
  }
  // Set the active tool
  setActiveTool(tool: string) {
    this.activeTool = tool;
  }

  // Clear the active tool
  clearActiveTool() {
    this.activeTool = null;
  }
  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: UserMenuComponent,
      origin: originRef,
      offsetY: 12,
      positions: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ],
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
  toggleLayerVisibility(layer: any) {
    console.log('toggleLayerVisibility', layer);
    this.reloadLayer = !this.reloadLayer;
    layer.setVisible(!layer.getVisible());
  }
  zoomToLayer(layer: any) {
    // Implement zoom functionality tmpExtent_
    console.log('Zoom to layer:', layer, layer.tmpExtent_);
    const extent = layer.getSource().tmpExtent_;
    console.log('extent', extent);

    this.mapService.getMap().getView().fit(extent);
  }

  setVisibilityRange(layer: any) {
    // Implement visibility range functionality
    console.log('Set visibility range for:', layer.get('title'));
  }

  togglePopup(layer: any) {
    // Implement pop-up toggle functionality
    console.log('Toggle pop-up for:', layer.get('title'));
  }

  moveLayerUp(layer: any) {
    // Implement move up functionality
    console.log('Move layer up:', layer.get('title'));
  }
  updateLayerOpacity(layer: any) {
    console.log(layer);
  }
  moveLayerDown(layer: any) {
    // Implement move down functionality
    console.log('Move layer down:', layer.get('title'));
  }

  viewInAttributeTable(layer: any) {
    this.isSecondAreaOpen = true;
    // Implement attribute table view functionality
    console.log('View in Attribute Table:', layer.get('title'));
  }
  setBaseLayer(baseLayer: any) {
    console.log(baseLayer);
    this.selectedBaseLayer = baseLayer.layerType;

    switch (baseLayer?.layerType) {
      case 'osm':
        extendedLayerGroup.baseLayerGroup.getLayers().forEach((layer) => {
          if (
            layer.getProperties()?.title === 'OSM' &&
            layer.getProperties().visible === false
          ) {
            layer.setVisible(true);
          } else if (layer.getProperties()?.title !== 'OSM') {
            layer.setVisible(false);
          }
        });
        break;
      case 'bingmap':
        extendedLayerGroup.baseLayerGroup.getLayers().forEach((layer) => {
          console.log(layer.getProperties().title);
          if (
            layer.getProperties()?.title === 'BingMaps' &&
            layer.getProperties().visible === false
          ) {
            layer.setVisible(true);
          } else if (layer.getProperties()?.title !== 'BingMaps') {
            layer.setVisible(false);
          }
        });
        break;
      case 'cartodark':
        extendedLayerGroup.baseLayerGroup.getLayers().forEach((layer) => {
          console.log(layer.getProperties().title);
          if (
            layer.getProperties()?.title === 'CartoDarkAll' &&
            layer.getProperties().visible === false
          ) {
            layer.setVisible(true);
          } else if (layer.getProperties()?.title !== 'CartoDarkAll') {
            layer.setVisible(false);
          }
        });
        break;
      default:
        break;
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log(this.isSidebarOpen);
  }
  tool1Action() {
    console.log('Tool 1 action triggered');
  }

  tool2Action() {
    console.log('Tool 2 action triggered');
  }

  tool3Action() {
    console.log('Tool 3 action triggered');
  }

  tool4Action() {
    console.log('Tool 4 action triggered');
  }

  tool5Action() {
    console.log('Tool 5 action triggered');
  }
  toggleSecondArea() {
    this.isSecondAreaOpen = !this.isSecondAreaOpen;
  }
  collapseExampleCArea(
    index: number,
    areaToCollapseDirection: 'before' | 'after'
  ) {
    console.log(index, areaToCollapseDirection);
  }
  updateMapHeight() {
    if (this.mapContainer) {
      //const containerHeight = this.mapContainer.nativeElement.offsetHeight;
      // Assuming `map` is the OpenLayers map instance
      this.mapService.getMap().updateSize(); // Adjust the map's size based on container height
    }
  }

  onSplitterChange(event: any) {
    console.log(event);

    // const firstSplitAreaSize = event[0].size; // Get the size of the first split area (percentage or pixel size)
    // const calculatedInset = this.calculateInset(firstSplitAreaSize);
    // this.updateMapInset(calculatedInset); // Call updateMapInset to apply the calculated inset
  }
  toggleSecondSplitArea() {
    this.isSecondSplitCollapsed = !this.isSecondSplitCollapsed;
    if (this.isSecondSplitCollapsed) {
      this.secondSplitAreaSize = 0;
    } else {
      this.secondSplitAreaSize = 30; // Or whatever size you want for the expanded area
    }
  }

  updateSplitAreaSize() {
    // Here you can dynamically calculate the size based on window height or other factors
    const totalHeight = window.innerHeight;
    this.mapSize = totalHeight * 0.9; // 90% height for the map
    this.secondSplitAreaSize = totalHeight * 0.1; // 10% height for the second split
  }

  // Calculate the inset value based on the first split area size
  calculateInset(firstSplitAreaSize: number): string {
    // Assuming 100% is the total height and you subtract the size of the first split area
    const mapInset = `calc(100% - ${firstSplitAreaSize}px)`; // You can adjust the calculation based on the actual split size logic
    return mapInset;
  }

  // Update map inset dynamically
  updateMapInset(insetValue: string) {
    const mapElement = document.getElementById('map')!;
    mapElement.style.inset = `0 0 ${insetValue} 0`;
    this.mapService.getMap()?.updateSize();
  }

  setLayerOpacity(layer: any, event: any): void {
    const value = parseFloat(event.target.value);
    console.log(layer, event, value);

    if (!isNaN(value) && value >= 0 && value <= 1) {
      layer.setOpacity(value);
      this.opacityPercentage = Math.round(value * 100);
    }
  }
  areAllLayersVisible(group: any): boolean {
    return group
      .getLayers()
      .getArray()
      .every((layer: any) => layer.getVisible());
  }

  toggleGroupVisibility(group: any, visible: any): void {
    console.log(visible);

    group
      .getLayers()
      .getArray()
      .forEach((layer: any) => layer.setVisible(visible?.target?.checked));
  }

  formatOpacityPercentage(opacity: number): number {
    return Math.round(opacity * 100);
  }

  onSearch() {
    const layers = this.getAllLayersFromGroup(
      this.mapService.getMap().getLayers()
    );

    const results: any = [];
    layers.forEach((layer) => {
      if (layer instanceof ExtendedVectorLayer) {
        const source = layer.getSource() as ExtendedVectorSource;
        source.forEachFeature((feature) => {
          const name = feature.get('name'); // Adjust to match your feature properties
          if (
            name &&
            name.toLowerCase().includes(this.searchQuery.toLowerCase())
          ) {
            results.push({ name, feature });
          }
        });
      } else if (layer instanceof ExtendedTileLayer) {
        console.log(layer);

        const layerName = layer.get('name'); // Adjust based on your layer properties
        console.log('layerName', layerName);

        if (
          layerName &&
          layerName.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) {
          const tileSource = layer.getSource();
          if (tileSource) {
            const extent = tileSource?.getTileGrid()?.getExtent() as any;
            this.mapService
              .getMap()
              .getView()
              .fit(extent, { padding: [20, 20, 20, 20], duration: 500 });
          }
          results.push({ name: layerName, layer });
        }
      }
    });

    this.searchResults = results;
  }

  getAllLayersFromGroup(
    layerGroup: any
  ): (ExtendedVectorLayer | ExtendedTileLayer)[] {
    const layers: (ExtendedVectorLayer | ExtendedTileLayer)[] = [];

    layerGroup.getArray().forEach((layer: any) => {
      console.log('Processing layer:', layer);

      if (
        layer instanceof ExtendedVectorLayer ||
        layer instanceof ExtendedTileLayer
      ) {
        // Add both Vector and Tile layers
        layers.push(layer);
      } else if (layer instanceof ExtendedLayerGroup) {
        // Recursively handle nested layer groups
        const childLayers = layer.getLayers();
        layers.push(...this.getAllLayersFromGroup(childLayers));
      } else {
        console.log('Skipped layer:', layer); // Log unsupported layers for debugging
      }
    });

    return layers;
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }

  onSelectResult(result: any) {
    const feature: Feature = result.feature;
    const geometry = feature.getGeometry() as Geometry;

    if (geometry instanceof Point) {
      // For point features, zoom to the coordinate
      this.mapService.getMap().getView().setCenter(geometry.getCoordinates());
      this.mapService.getMap().getView().setZoom(15);
    } else {
      // For other geometries, fit the view to the feature's extent
      const extent = geometry?.getExtent();
      this.mapService
        .getMap()
        .getView()
        .fit(extent, { duration: 500, maxZoom: 15 });
    }

    this.clearSearch(); // Optional: clear the search results
  }

  searchByCoordinates() {
    if (this.latitude !== null && this.longitude !== null) {
      // Convert lat/lon to map projection
      const projectedCoords = fromLonLat([this.longitude, this.latitude]);

      // Zoom to the coordinates on the map
      this.mapService.getMap().getView().setCenter(projectedCoords);
      this.mapService.getMap().getView().setZoom(15);
    } else {
      alert('Please enter valid latitude and longitude!');
    }
  }
}
