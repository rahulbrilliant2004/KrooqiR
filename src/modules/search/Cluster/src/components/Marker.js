import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import MapView from 'react-native-maps'
import MarkerImg from '../../../../../images/highlight-pin-single-family-act.png'

const Marker = ({ item, color, children }) => {
	const coords = item.geometry.coordinates
	const { price, currency } = item.properties

	return (
		<MapView.Marker
			image={MarkerImg}
			coordinate={{ latitude: coords[1], longitude: coords[0] }}
			width={40}
			height={36.5}
			anchor={{ x: 0.5, y: 0.75 }}
			calloutOffset={{ x: 100, y: 50 }}
			calloutAnchor={{ x: 0.5, y: 0 }}
			activeOpacity={0.8}
		/>
	)
}

const styles = StyleSheet.create({
	marker: {
		position: 'relative',
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 4,
		borderRadius: 2,
	},
	markerText: {
		fontSize: 12,
		color: 'white',
	},
	pointer: {
		width: 10,
		height: 10,
		backgroundColor: 'black',
		alignSelf: 'center',
		transform: [{ rotate: '45deg' }],
		top: -6,
	}
})

Marker.defaultProps = {
	color: 'black'
}

export default Marker
