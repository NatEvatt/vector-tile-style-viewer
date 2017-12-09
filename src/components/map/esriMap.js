import React, { Component } from "react";
import "./map.css";
import { dojoRequire } from "esri-loader";
import EsriLoader from "esri-loader-react";
import PropTypes from "prop-types";

class ESRIMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.esri_map;
    this.mapView;
    this.VectorTileLayer;

    this.updateESRI = this.updateESRI.bind(this);
  }

  componentWillReceiveProps = (newProps) => {
    if (this.mapView) {
      this.updateESRI(newProps);
      console.log("we received props");
    }
  };

  updateESRI(newProps) {
    this.esri_map.removeAll();
    let VTLayer = new this.VectorTileLayer({
      url: newProps.esriUrl
    });
    this.esri_map.add(VTLayer);
    this.mapView.goTo({
      center: [newProps.center[0], newProps.center[1]],
      zoom: Number(newProps.zoom)
    });
  }

  createMap = () => {
    dojoRequire(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/VectorTileLayer",
        "esri/widgets/Search"
      ],
      (Map, MapView, VectorTileLayer, Search) => {
        this.VectorTileLayer = VectorTileLayer;
        this.esri_map = new Map();
        this.mapView = new MapView({
          container: this.mapContainer,
          map: this.esri_map,
          center: [
            this.props.center[0],
            this.props.center[1]
          ],
          zoom: Number(this.props.zoom)
        });

        let VTLayer = new VectorTileLayer({
          url:
            "http://www.arcgis.com/sharing/rest/content/items/95d4d6b61c0b4690adaf8cbdabb28196/resources/styles/root.json"
          // url: this.props.esriUrl
        });

        let searchWidget = new Search({
          view: this.mapView
        });

        this.mapView.ui.move(["zoom"], "bottom-right");

        this.mapView.ui.add(searchWidget, {
          position: "top-left",
          index: 2
        });

        this.esri_map.add(VTLayer);
      }
    );
  };

  render() {
    const options = {
      url: "https://js.arcgis.com/4.4/"
    };

    return (
      <div className={`App ${this.props.hidden}`}>
        <EsriLoader options={options} ready={this.createMap} />
        <div
          style={this.props.containerStyle}
          ref={node => (this.mapContainer = node)}
          className="map-view"
        />
      </div>
    );
  }
}

ESRIMap.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  hidden: PropTypes.string.isRequired,
  containerStyle: PropTypes.object.isRequired
};

export default ESRIMap;
