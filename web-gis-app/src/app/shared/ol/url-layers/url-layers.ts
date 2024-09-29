import { environment } from 'src/environments/environment';

export class ndihma_ekonomike_url_layers {
  static readonly protected_areas: string =
    environment.geoportal_url + '/service/akzm/wms';
  static readonly natural_monuments: string =
    environment.geoportal_url + '/service/akzm/wms';
  static readonly road_network: string =
    environment.geoportal_url + '/service/instituti_transportiti/wms';
  static readonly enumeration_adr: string =
    environment.geoportal_url + '/service/adresar/wms';
  static readonly roads_adr: string =
    environment.geoportal_url + '/service/adresar/wms';
  static readonly buildings_adr: string =
    environment.geoportal_url + '/service/adresar/wms';
}

export class border_layers {
  static readonly alb_borders: string =
    environment.geoportal_url +
    '/service/kufinjt_e_njesive_administrative/wms?request=GetCapabilities';
  static readonly alb_regions: string =
    environment.geoportal_url +
    '/service/kufinjt_e_njesive_administrative/wms?request=GetCapabilities';
  static readonly alb_municipalities: string =
    environment.geoportal_url +
    '/service/kufinjt_e_njesive_administrative/wms?request=GetCapabilities';
  static readonly ortho_photo: string =
    environment.geoportal_url + '/service/wmts?request=GetCapabilities';
  static readonly carto_db_base_layer: string =
    'https://{1-4}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
}

export class geo_search {
  static readonly geo_search: string =
    'https://nominatim.openstreetmap.org/search?format=json&q={s}';
}
