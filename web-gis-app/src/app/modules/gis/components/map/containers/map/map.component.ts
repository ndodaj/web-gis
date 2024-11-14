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
import { Map } from 'ol';
import { extendedLayerGroup } from '@shared/ol/extendedLayerGroup/extendedLayerGroup';
import { MapService } from '@shared/services/map.service';
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
  map!: Map;
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
  layerGroups = [extendedLayerGroup.additionalLayers] as any;
  value!: any;
  isSecondAreaOpen = false;

  constructor(
    protected router: Router,
    private themeConfigService: ThemeConfigService,
    private authService: AuthService,
    private accountService: AccountService,
    private cd: ChangeDetectorRef,
    private popover: PopoverService,
    private translateService: TranslateService,
    private mapService: MapService
  ) {
    this.currentLanguage = this.translateService.currentLang || 'en';
  }
  ngAfterViewInit() {
    // Wait until the view is initialized to access the DOM
    this.observeSplitArea();
  }
  ngOnInit(): void {
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
    layer.setVisible(!layer.getVisible());
  }
  zoomToLayer(layer: any) {
    // Implement zoom functionality
    console.log('Zoom to layer:', layer, layer.getSource());
    this.mapService.getMap().getView().fit(layer.getSource().tmpExtent_);
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
      this.map.updateSize(); // Adjust the map's size based on container height
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
    mapElement.style.inset = `0 0 ${insetValue} 0`; // Apply the new inset value to the map
    this.map?.updateSize(); // Ensure the map size is updated after the inset change
  }
}
