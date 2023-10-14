import MapView, { MapViewProps, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { useEffect, useRef, useState } from 'react'
import * as Location from 'expo-location'
import { ActivityIndicator, View } from 'react-native'
import { Constants } from 'app-types'
import * as Text from '../Text'
import useStateRef from 'react-usestateref'
import { Shadow } from 'react-native-shadow-2'
import Button from './Button'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import ExpoConstants from 'expo-constants'

interface MapHeaderProps {
  onBack?: () => void
  onSearch?: (address?: string) => void
}

interface MapProps {
  askForLocation?: boolean
  defaultRegion?: Region
  header?: MapHeaderProps
}

const Map = (props: MapProps & MapViewProps) => {
  const [location, setLocation, locationRef] = useStateRef<Region>(null),
    [mustEnableLocationService, setMustEnableLocationService] = useState(false),
    [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription>(),
    ref = useRef<MapView>(undefined)

  useEffect(
    () => {
      const getLastLocation = async () => {
        if (!props.askForLocation) return
        
        const isLocationServicesEnabled = await Location.hasServicesEnabledAsync()
        if (!isLocationServicesEnabled)
          return setMustEnableLocationService(mustEnableLocationService)

        const permission = await Location.requestForegroundPermissionsAsync()
        if (!permission.granted && permission.canAskAgain)
          await getLastLocation()
        else {
          // get last know position
          const lastKnownLocation = await Location.getLastKnownPositionAsync()

          if (lastKnownLocation) {
            const data = {
              latitude: lastKnownLocation?.coords.latitude,
              longitude: lastKnownLocation?.coords.longitude,
              latitudeDelta: location?.latitudeDelta ?? (props.defaultRegion?.latitudeDelta ?? 0.003),
              longitudeDelta: location?.longitudeDelta ?? (props.defaultRegion?.longitudeDelta ?? 0.003)
            }

            if (typeof props.onRegionChangeComplete === 'function')
                props.onRegionChangeComplete(data, null)

            return setLocation(data)
          }

          // get current location
          const position = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 2000,
              distanceInterval: 0
            },
            (currentLocation) => {
              if (locationRef.current) return
              const data = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: location?.latitudeDelta ?? (props.defaultRegion?.latitudeDelta ?? 0.003),
                longitudeDelta: location?.longitudeDelta ?? (props.defaultRegion?.longitudeDelta ?? 0.003)
              }

              if (typeof props.onRegionChangeComplete === 'function')
                props.onRegionChangeComplete(data, null)

              setLocation(data)
            }
          )

          setLocationSubscription(position)
        }
      }

      getLastLocation()
        .catch(console.error)

      return () => {
        if (locationSubscription) locationSubscription.remove()
      }
    },
    []
  )

  useEffect(
    () => {
      if (!location || !locationSubscription) return

      locationSubscription.remove()
      setLocationSubscription(null)
    },
    [location]
  )

  return props.askForLocation && !location ? (
    <View
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          gap: 8
        }
      }
    >
      <ActivityIndicator
        color={Constants.Colors.All.main}
        size={48}
      />

      <Text.Label
        color={Constants.Colors.Text.tertiary}
        size={12}
      >
        Trying to fetch your location...
      </Text.Label>
    </View>
  ) : (
    <>
      <MapView
        {...props}
        ref={ref}
        style={
          {
            width: '100%',
            height: '100%',
            ...(props.style as any ?? {})
          }
        }
        initialRegion={
          props.askForLocation && location ? (
            location
          ) : ( location ?? props.defaultRegion )
        }
        provider={PROVIDER_GOOGLE}
      />

      {
        props.header ? (
          <View
            style={
              {
                top: 0,
                paddingHorizontal: 16,
                paddingVertical: 32,
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                gap: 12
              }
            }
          >
            {
              props.header.onBack ? (
                <Shadow
                  style={{ borderRadius: 100 }}
                  distance={2}
                >
                  <Button
                    icon={faAngleLeft}
                    bg={Constants.Colors.All.whiteSmoke}
                    text={
                      {
                        size: 16,
                        color: Constants.Colors.Text.tertiary
                      }
                    }
                    borderRadius={100}
                    paddingHorizontal={8}
                    paddingVertical={8}
                    onPress={props.header.onBack}
                  />
                </Shadow>
              ) : null
            }

            {
              props.header.onSearch ? (
                <View
                  style={
                    {
                      height: '100%',
                      flex: 1,
                    }
                  }
                >
                  <GooglePlacesAutocomplete
                    placeholder='Location Name'
                    query={
                      {
                        key: ExpoConstants.expoConfig.android.config.googleMaps.apiKey,
                        language: 'en',
                        components: 'country:ph'
                      }
                    }
                    onPress={
                      (_, details) => {
                        const region = {
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                          latitudeDelta: location?.latitudeDelta ?? (props.defaultRegion?.latitudeDelta ?? 0.003),
                          longitudeDelta: location?.longitudeDelta ?? (props.defaultRegion?.longitudeDelta ?? 0.003)
                        }

                        setLocation(region)
                        if (typeof props.onRegionChangeComplete === 'function')
                          props.onRegionChangeComplete(region, null)

                        ref.current.animateToRegion(region)
                        props.header.onSearch(details.formatted_address)
                      }
                    }
                    textInputProps={
                      {
                        style: {
                          borderWidth: .5,
                          borderColor: 'lightgrey',
                          paddingHorizontal: 18,
                          paddingVertical: 8,
                          backgroundColor: '#e8edee', // todo: add to color palette
                          fontSize: 16,
                          color: Constants.Colors.Text.tertiary,
                          borderRadius: 12,
                          width: '100%'
                        }
                      }
                    }
                    fetchDetails
                  />
                </View>
              ) : null
            }
          </View>
        ) : null
      }
    </>
  )
}

export default Map