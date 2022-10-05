import { onCleanup, createEffect, Component } from 'solid-js'
import { useMap } from '../MapGL'
import type MapboxMap from 'mapbox-gl/src/ui/map'
import type {
  MarkerSpecification,
  PopupSpecification,
} from 'mapbox-gl/src/style-spec/types.js'
import type { LngLatLike } from 'mapbox-gl/src/geo/lng_lat.js'

export const Marker: Component<{
  options?: MarkerSpecification
  lngLat: LngLatLike
  openPopup?: boolean
  children?: any
}> = props => {
  const map: MapboxMap = useMap()
  let marker = null
  let popup = null

  // Add Marker
  createEffect(async () => {
    map().isMapLibre ? await import('maplibre-gl') : await import('mapbox-gl')
    const mapLib = window[map().isMapLibre ? 'maplibregl' : 'mapboxgl']

    if (marker) return
    if (props.children)
      popup = new mapLib.Popup(
        props.options.popup as PopupSpecification
      ).setDOMContent(<div>{props.children}</div>)

    marker = new mapLib.Marker(props.options)
      .setLngLat(props.lngLat)
      .setPopup(popup)
      .addTo(map())
    props.openPopup && marker.togglePopup()
  })
  // Remove Marker
  onCleanup(() => marker?.remove())

  // Update Position
  createEffect(() => marker?.setLngLat(props.lngLat))

  // Update Content
  createEffect(() => popup?.setDOMContent(<div>{props.children}</div>))

  return <></>
}
