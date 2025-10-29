import 'leaflet';

declare module 'leaflet' {
  interface Marker {
    _icon?: HTMLElement;
  }
}
