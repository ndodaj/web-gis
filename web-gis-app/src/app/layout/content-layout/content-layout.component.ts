import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { NavigationEnd, Router, Scroll, Event } from '@angular/router';
import { filter, map, startWith, withLatestFrom } from 'rxjs/operators';

import { ThemeConfigService } from '@core/services/theme-config.service';
import { LayoutService } from '@core/services/layout.service';
import { checkRouterChildsData } from '@core/utils/check-router-childs-data';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit, AfterViewInit {
  @Input() sidenavRef!: TemplateRef<any>;
  @Input() toolbarRef!: TemplateRef<any>;
  @Input() footerRef!: TemplateRef<any>;
  @Input() quickpanelRef!: TemplateRef<any>;
  @Input() secondaryToolbarRef!: TemplateRef<any>;

  isLayoutVertical$ = this.themeConfigService.config$.pipe(
    map((config) => config.layout === 'vertical')
  );
  isBoxed$ = this.themeConfigService.config$.pipe(
    map((config) => config.boxed)
  );
  isToolbarFixed$ = this.themeConfigService.config$.pipe(
    map((config) => config.toolbar.fixed)
  );
  isFooterFixed$ = this.themeConfigService.config$.pipe(
    map((config) => config.footer.fixed)
  );
  isFooterVisible$ = this.themeConfigService.config$.pipe(
    map((config) => config.footer.visible)
  );
  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isDesktop$ = this.layoutService.isDesktop$;

  scrollDisabled$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      checkRouterChildsData(
        this.router.routerState.root.snapshot,
        (data) => !!data.scrollDisabled
      )
    )
  );

  containerEnabled$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      checkRouterChildsData(
        this.router.routerState.root.snapshot,
        (data) => !!data.containerEnabled
      )
    )
  );

  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  @ViewChild(MatSidenavContainer, { static: true })
  sidenavContainer!: MatSidenavContainer;

  constructor(
    private layoutService: LayoutService,
    private themeConfigService: ThemeConfigService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    /**
     * Expand Sidenav when we switch from mobile to desktop view
     */
    this.isDesktop$
      .pipe(filter((matches) => !matches))
      .subscribe(() => this.layoutService.expandSidenav());

    /**
     * Open/Close Sidenav through LayoutService
     */
    this.layoutService.sidenavOpen$
      .pipe()
      .subscribe((open) => (open ? this.sidenav.open() : this.sidenav.close()));

    /**
     * Mobile only:
     * Close Sidenav after Navigating somewhere (e.g. when a user clicks a link in the Sidenav)
     */
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        withLatestFrom(this.isDesktop$),
        filter(([_, matches]) => !matches)
      )
      .subscribe(() => this.sidenav.close());
  }

  ngAfterViewInit(): void {
    /**
     * Enable Scrolling to specific parts of the page using the Router
     */
    this.router.events
      .pipe(
        filter<Event, Scroll>((e: Event): e is Scroll => e instanceof Scroll)
      )
      .subscribe((e: Scroll) => {
        if (e.position) {
          // backward navigation
          this.sidenavContainer.scrollable.scrollTo({
            start: e.position[0],
            top: e.position[1]
          });
        } else if (e.anchor) {
          const scroll = (anchor: HTMLElement) =>
            this.sidenavContainer.scrollable.scrollTo({
              behavior: 'smooth',
              top: anchor.offsetTop,
              left: anchor.offsetLeft
            });

          let anchorElem = this.document.getElementById(e.anchor);

          if (anchorElem) {
            scroll(anchorElem);
          } else {
            setTimeout(() => {
              anchorElem = this.document.getElementById(e.anchor as string);
              scroll(anchorElem as HTMLElement);
            }, 100);
          }
        } else {
          // forward navigation
          this.sidenavContainer.scrollable.scrollTo({
            top: 0,
            start: 0
          });
        }
      });
  }
}
