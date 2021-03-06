import mapboxgl from "mapbox-gl";
import React from "react";
import MapboxGeocoder from "mapbox-gl-geocoder";
import PropTypes from "prop-types";
import Config from "../../config";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "../../actions/mapActions";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      mapMovements: this.props.mapMovements
    };

    this.mapboxMap;

    this.updateMapbox = this.updateMapbox.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  componentDidMount() {
    mapboxgl.accessToken = Config.mapboxToken;
    if (!mapboxgl.supported()) {
      // console.log('WARNING: Your browser is not officailly supported by Mapbox GL');
    }
    this.mapboxMap = new mapboxgl.Map({
      container: this.container,
      style: this.props.style,
      center: [-122.010406, 36.964643],
      zoom: 3,
      hash: true
    });
    this.mapboxMap.addControl(
      new MapboxGeocoder({ accessToken: mapboxgl.accessToken }),
      "top-left"
    );
    this.mapboxMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // map.flyTo({ center: this.props.center, zoom: this.props.zoom })

    // window.map = map;
    this.setState({ active: true });
    this.mapboxMap.on("moveend", this.handleMove);
  }

  componentWillReceiveProps = newProps => {
    if (this.mapboxMap && this.props.style !== newProps.style) {
      this.updateMapbox(newProps);
    }
  };

  updateMapbox = newProps => {
    this.mapboxMap.setStyle(newProps.style);
    this.mapboxMap.flyTo({
      center: newProps.center,
      zoom: Number(newProps.zoom)
    });
  };

  handleMove() {
    let mapMovements = {
      zoom: parseFloat(this.mapboxMap.getZoom().toPrecision(3)),
      center: this.mapboxMap.getCenter(),
      pitch: Math.floor(this.mapboxMap.getPitch()),
      bearing: Math.floor(this.mapboxMap.getBearing())
    };
    this.props.actions.trackMapMovement(mapMovements);
  }

  render() {
    return (
      <div
        style={this.props.containerStyle}
        className={this.props.hidden}
        ref={mapDiv => {
          this.container = mapDiv;
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    mapState: state.mapState,
    userData: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(mapActions, dispatch)
  };
}

Map.propTypes = {
  center: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  hidden: PropTypes.string.isRequired,
  containerStyle: PropTypes.object.isRequired,
  style: PropTypes.string.isRequired,
  mapMovements: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
