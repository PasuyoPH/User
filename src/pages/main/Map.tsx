import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Types from 'app-types'
import { Http } from 'app-structs'
import { ActivityIndicator, View } from 'react-native'
import { Text } from '../../../components'
import { SafeAreaView } from 'react-native-safe-area-context'

const http = new Http.Client()

const MapPage = (rider: Types.App.RiderAppData) => {

  return rider.geo ? (
    true ? (
      (
        <View
          style={
            {
              position: 'relative',
              flexGrow: 1
            }
          }
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={
              {
                latitude: rider.geo.lat,
                longitude: rider.geo.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
              }
            }
            region={
              {
                latitude: rider.geo.lat,
                longitude: rider.geo.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
              }
            }
            showsUserLocation
            showsMyLocationButton={false}
            zoomEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            provider={PROVIDER_GOOGLE}
          />
        </View>
      )
    ) : (
      <SafeAreaView>
        {
          true === undefined ?
            <ActivityIndicator /> :
            (
              <Text.Label>
                You must have a job to view this page
              </Text.Label>
            )
        }
      </SafeAreaView>
    )
  ) : null
}

export default MapPage