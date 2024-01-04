import { Account, Address, App, Constants } from 'app-types'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Display, Text } from '../../../components'
import useStateRef from 'react-usestateref'
import { MapMarker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { Http } from 'app-structs'
import { Marker } from 'react-native-svg'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapMarker, faMapMarkerAlt, faMarker, faMotorcycle } from '@fortawesome/free-solid-svg-icons'

const http = new Http.Client()

interface AddressData {
  dropoff: Address.AddressUsedData
  pickup: Address.AddressUsedData
}

const RiderPositionPage = (props: App.PageProps & App.UserAppData) => {
  const [_, setWs, ws] = useStateRef<WebSocket>(),
    [geo, setGeo] = useState<App.Geo>(),
    [addresses, setAddresses] = useState<AddressData>(),
    { rider, job } = props.route.params as { rider: Account.RiderAccountData, job: string }

  useEffect(
    () => {
      const connect = async () => {
          const connection = new WebSocket(Constants.Url.Gateway)

          connection.onopen = () => {
            console.log('Connection Opened')

            connection.send(
              JSON.stringify(
                {
                  c: 5, /// listen_rider_location
                  d: { uid: rider.uid }
                }
              )
            )
          }

          connection.onmessage = (event) => {
            try {
              const packet = JSON.parse(event.data.toString())
              
              switch (packet.c) {
                case 4: { // rider updated geo
                  if (packet.d)
                    setGeo(
                      {
                        lat: packet.d.lat,
                        lng: packet.d.lng
                      }
                    )
                } break
              }
            } catch {}
          }
          
          setWs(connection)
        },
        getAddresses = async () => {
          const result = await http.request<Address.AddressUsedData[]>(
            {
              method: 'get',
              url: Constants.Url.Routes.USER_JOB_ADDRESSES(job),
              headers: {
                Authorization: props.token
              }
            }
          )

          if (!Array.isArray(result.value)) return
          const data: AddressData = { dropoff: null, pickup: null }

          for (const address of result.value) {
            switch (address.type) {
              case Address.AddressUsedType.START:
                data.pickup = address
                break

              case Address.AddressUsedType.END:
                data.dropoff = address
                break
            }
          }

          setAddresses({ ...data })
        }

      getAddresses()
        .catch(console.error)

      connect()
        .catch(console.error)

      return () => {
        if (ws.current) ws.current.close()
      }
    },
    []
  )
  
  return geo ? (
    <Display.Map
      defaultRegion={
        {
          latitude: geo.lat,
          longitude: geo.lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003
        }
      }
      hideLabels
    >
      <MapMarker
        coordinate={
          {
            latitude: geo.lat,
            longitude: geo.lng
          }
        }
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }
      >
        <Text.Label
          color={Constants.Colors.Text.main}
        >
          {rider.fullName}
        </Text.Label>

        <FontAwesomeIcon
          icon={faMotorcycle}
          color={Constants.Colors.All.main}
          size={32}
        />
      </MapMarker>
      
      {
        addresses ? (
          <>
            <MapViewDirections
              origin={
                { latitude: geo.lat, longitude: geo.lng }
              }
              destination={
                {
                  latitude: addresses.dropoff.latitude,
                  longitude: addresses.dropoff.longitude
                }
              }
              waypoints={
                [
                  {
                    latitude: addresses.pickup.latitude,
                    longitude: addresses.pickup.longitude
                  }
                ]
              }
              strokeColors={
                [
                  Constants.Colors.Text.danger,
                  Constants.Colors.Text.green
                ]
              }
              strokeColor={Constants.Colors.Text.danger}
              strokeWidth={3}
              apikey={'AIzaSyAe1O4RsaElYL79mHnPSHRGL_lVCf9uP0M'}
            />

            <MapMarker
              coordinate={addresses.dropoff}
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.green}
              >
                Drop Here
              </Text.Label>

              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                color={Constants.Colors.Text.green}
              />
            </MapMarker>

            <MapMarker
              coordinate={addresses.pickup}
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }
            >
              <Text.Label
                color={Constants.Colors.All.lightBlue}
              >
                Pickup
              </Text.Label>

              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                color={Constants.Colors.All.lightBlue}
              />
            </MapMarker>
          </>
        ) : null
      }
    </Display.Map>
  ) : (
    <View
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }
      }
    >
      <ActivityIndicator
        color={Constants.Colors.All.lightBlue}
      />
      
      <Text.Label
        size={14}
        style='italic'
        color={Constants.Colors.Text.tertiary}
      >
        Fetching rider position...
      </Text.Label>
    </View>
  )
}

export default RiderPositionPage