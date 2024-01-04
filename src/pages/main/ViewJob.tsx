import { View, Pressable, Image } from 'react-native'
import { SafeAreaView  } from 'react-native-safe-area-context'
import { Display, Text } from '../../../components'
import { App, Constants, Job } from 'app-types'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { faAngleLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Http } from 'app-structs'
import { useState } from 'react'
import MapView from 'react-native-maps'
import useStateRef from 'react-usestateref'

const http = new Http.Client()

const ViewJobPage = (props: App.UserAppData & App.PageProps) => {
  const [job, setJob, _] = useStateRef<Job.JobData>(),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    { uid, type } = props.route.params as { uid: string, type: Job.JobTypes },
    navigation = useNavigation()

  useFocusEffect(
    useCallback(
      () => {
        const getJob = async () => {
          const result = await http.request<Job.JobData>(
            {
              method: 'get',
              url: Constants.Url.Routes.JOBS2_DATA(uid) + '?type=' + type ?? '0',
              headers: {
                Authorization: props.token
              }
            }
          )

          setJob(result.value)
        }

        getJob()
          .catch(console.error)
      },
      []
    )
  )

  return job ? (
    <SafeAreaView
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          paddingVertical: 16,
          paddingHorizontal: 32,
          gap: 16
        }
      }
    >
      <Pressable
        style={
          { flexDirection: 'row' }
        }
        onPress={
          () => (navigation.navigate as any)('Home')
        }
      >
        <Display.Button
          icon={faAngleLeft}
          bg='transparent'
          text={
            { color: Constants.Colors.Text.tertiary }
          }
          paddingHorizontal={0}
          paddingVertical={0}
          onPress={
            () => (navigation.navigate as any)('Home')
          }
          iconSize={18}
        />
      </Pressable>

      <Text.Header
        weight='bold'
        color={Constants.Colors.Text.tertiary}
      >
        {
          job.data.delivery ?
            'Delivery' :
            job.data.order ?
              'Order' :
              'Unknown'
        }
      </Text.Header>

      {
        job.person ? (
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                gap: 8
              }
            }
          >
            {
              job.person.merchant ? (
                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column'
                    }
                  }
                >
                  <Text.Label
                    weight='bold'
                    color={Constants.Colors.Text.tertiary}
                  >
                    MERCHANT
                  </Text.Label>

                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }
                    }
                  >
                    {
                      job.person.merchant.logo ? (
                        <Image
                          source={{ uri: job.person.merchant.logo }}
                          style={{ width: 48, height: 48, borderRadius: 10 }}
                        />
                      ) : (
                        <View
                          style={
                            {
                              width: 48,
                              height: 48,
                              backgroundColor: Constants.Colors.Text.secondary,
                              borderRadius: 10
                            }
                          }
                        />
                      )
                    }

                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column'
                        }
                      }
                    >
                      <Text.Label
                        font='normal'
                        color={Constants.Colors.Text.tertiary}
                        size={14}
                      >
                        {job.person.merchant.name}
                      </Text.Label>

                      <Text.Label
                        font='normal'
                        color={Constants.Colors.Text.secondary}
                        style='italic'
                        size={12}
                      >
                        {job.person.merchant.bio ?? 'No bio provided.'}
                      </Text.Label>
                    </View>
                  </View>
                </View>
              ) : null
            }

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }
            >
              <Text.Label
                weight='bold'
                color={Constants.Colors.Text.tertiary}
              >
                COURIER
              </Text.Label>

              {
                !job.person.rider ? (
                  <Text.Label
                    color={Constants.Colors.Text.secondary}
                    size={14}
                    style='italic'
                  >
                    No rider.
                  </Text.Label>
                ) : (
                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }
                    }
                  >
                    {
                      job.person.rider?.profile ? (
                        <Image
                          source={{ uri: job.person.user?.profile }}
                          style={{ width: 48, height: 48, borderRadius: 10 }}
                        />
                      ) : (
                        <View
                          style={
                            {
                              width: 48,
                              height: 48,
                              backgroundColor: Constants.Colors.Text.secondary,
                              borderRadius: 10
                            }
                          }
                        />
                      )
                    }
    
                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column'
                        }
                      }
                    >
                      <Text.Label
                        font='normal'
                        color={Constants.Colors.Text.tertiary}
                        size={14}
                      >
                        {job.person.rider.fullName}
                      </Text.Label>
    
                      <Text.Label
                        font='monospace'
                        color={Constants.Colors.Text.secondary}
                        style='italic'
                        size={12}
                      >
                        +63{job.person.rider.phone.slice(1, 5)}.....
                      </Text.Label>
                    </View>
                  </View>
                )
              }
            </View>
          </View>
        ) : null
      }

      {
        job.data.delivery ? (
          <>
            <Image
              source={
                { uri: job.data.delivery.image ?? '' }
              }
              style={
                {
                  width: '100%',
                  height: 120
                }
              }
            />

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 8,
                  justifyContent: 'space-between'
                }
              }
            >
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }
              >
                <Text.Label
                  weight='bold'
                  color={Constants.Colors.Text.tertiary}
                >
                  WEIGHT
                </Text.Label>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  font='monospace'
                  size={14}
                >
                  {job.data.delivery.weight.toLocaleString()}kg
                </Text.Label>
              </View>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }
              >
                <Text.Label
                  weight='bold'
                  color={Constants.Colors.Text.tertiary}
                >
                  DISTANCE
                </Text.Label>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  font='monospace'
                  size={14}
                >
                  {job.data.delivery.distance.toFixed(2)}km
                </Text.Label>
              </View>

              {/*<View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }
              >
                <Text.Label
                  weight='bold'
                  color={Constants.Colors.Text.tertiary}
                >
                  TIME OF ARRIVAL
                </Text.Label>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  font='monospace'
                  size={12}
                >
                  Oct 16, 12:23 PM
                </Text.Label>
              </View>*/}
            </View>
          </>
        ) : null
      }

      {
        Object.values(job.extra.items).length >= 1 ? (
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column'
              }
            }
          >
            <Text.Label
              weight='bold'
              color={Constants.Colors.Text.tertiary}
            >
              ITEMS
            </Text.Label>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8
                }
              }
            >
              {
                Object.values(job.extra.items).map(
                  (data, idx) => (
                    <View
                      key={idx}
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }
                      }
                    >
                      <Image
                        source={{ uri: data.item.image }}
                        style={{ width: 48, height: 48, borderRadius: 10 }}
                      />

                      <View
                        style={
                          {
                            width: 48,
                            height: 48,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10
                          }
                        }
                      >
                        <Text.Label
                          color={Constants.Colors.Text.alt}
                          font='monospace'
                        >
                          {data.quantity.toLocaleString()}
                        </Text.Label>
                      </View>
                    </View>
                  )
                )
              }
            </View>
          </View>
        ) : null
      }

      <Pressable
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
            height: 240,
          }
        }
        onPress={
          () => job.person.rider ? (
            (navigation.navigate as any)(
              'RiderPosition',
              { 
                rider: job.person.rider,
                job: job.uid
              }
            )
          ) :  null
        } // navigate to map
      >
        {/*<MapView
          style={
            {
              position: 'absolute',
              height: 240,
              width: '100%',
            }
          }
          region={
            rider.geo ? (
              {
                latitude: rider.geo.lat,
                longitude: rider.geo.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
              }
            ) : undefined
          }
        />*/}

        {
          job.person.rider ? (
            <View
              style={
                {
                  height: 240,
                  width: '100%'
                }
              }
            >
              <Display.Map
                style={{ position: 'absolute' }}
              />

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    height: '100%'
                  }
                }
              >
                <Text.Label
                  color={Constants.Colors.Text.alt}
                >
                  Click to View Map
                </Text.Label>
              </View>
            </View>
          ) : (
            <Text.Label
              color={Constants.Colors.Text.danger}
              style='italic'
              size={14}
            >
              No rider to check position.
            </Text.Label>
          )
        }
      </Pressable>
    </SafeAreaView>
  ) : null
}

export default ViewJobPage