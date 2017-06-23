import mapboxgl from 'mapbox-gl';
import React from 'react';
// import FiordColor from './styles/fiord_color';

export default class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
    // this.handleMove = this.handleMove.bind(this)
  }

  componentDidMount() {
    mapboxgl.accessToken = "pk.eyJ1IjoibmF0ZXZhdHQiLCJhIjoiR1hVR1ZIdyJ9.gFwSyghJZIERfjLkzgTx6A";
    if (!mapboxgl.supported()) {
      console.log('WARNING: Your browser is not officailly supported by Mapbox GL');
    }
    console.log(this.props.zoom);
    const map = new mapboxgl.Map({
      container: this.container,
      style: this.props.style,
      center: [-122.010406, 36.964643],
      zoom: 3,
      hash: true
    })

    map.flyTo({ center: this.props.center, zoom: this.props.zoom })

    window.map = map
    this.setState({ active: true })
    // map.on('moveend', this.handleMove)
  }

  // handleMove(e) {
  //   store.zoom = map.getZoom().toPrecision(3)
  //   store.center = map.getCenter()
  //   store.lat = store.center.lat.toPrecision(6)
  //   store.lng = fixLongitude(store.center.lng).toPrecision(6)
  //   store.pitch = Math.floor(map.getPitch())
  //   store.bearing = Math.floor(map.getBearing())
  // }

  render() {
    const { children } = this.props
    const { map } = this.state

    return (
      <div style={ this.props.containerStyle } ref={(x) => {
        this.container = x
      }}>
      { map && children }
      </div>
    )
  }
}
