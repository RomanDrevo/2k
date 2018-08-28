import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'
import PropTypes from 'prop-types'
import React from 'react'

const MyMapComponent = (props) => (
  props.visible ? (
    <GoogleMap
      defaultZoom={props.defaultZoom}
      defaultCenter={{
        lat: props.markerCoordinates.lat,
        lng: props.markerCoordinates.lng
      }}
    >
      {props.isMarkerShown && (
        <Marker position={{ lat: props.markerCoordinates.lat, lng: props.markerCoordinates.lng }} />
      )}
    </GoogleMap>
  ) : null)

MyMapComponent.defaultProps = {
  defaultZoom: 15
}

MyMapComponent.propTypes = {
  defaultZoom: PropTypes.number,
  isMarkerShown: PropTypes.bool,
  visible: PropTypes.bool,
  markerCoordinates: PropTypes.object
}

export default withScriptjs(withGoogleMap(MyMapComponent))
