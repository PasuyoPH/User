import { Image, Pressable, View } from 'react-native'
import { Constants, Deliveries, Job, Orders } from 'app-types'
import { Divider } from '../Display'
import * as Text from '../Text'
import { useNavigation } from '@react-navigation/native'

interface JobCardProps {
  delivery?: Deliveries.Data
  order?: Orders.Order
  status?: { pickedUp?: boolean, finished?: boolean }
  uid?: string
  type?: Job.JobTypes
}

const JobCard = (props: JobCardProps) => {
  const navigation = useNavigation()

  return (
    <Pressable
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }
      }
      onPress={
        () => {
          if (!props.status?.finished)
            (navigation.navigate as any)(
              'ViewJob',
              { uid: props.uid, type: props.type }
            )
        }
      }
    >
      <Text.Header
        color={Constants.Colors.Text.tertiary}
        weight='bold'
        size={24}
      >
        {
          props.delivery ?
            'Delivery' :
            (
              props.order ?
                'Order' :
                'Unknown'
            )
        }
      </Text.Header>

      <View
        style={{ paddingHorizontal: 4 }}
      >
        <Divider
          color={Constants.Colors.Text.secondary}
          vertical
          length={32}
        />
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
          }
        }
      >
        <Text.Label
          color={Constants.Colors.Text.tertiary}
        >
          Status:
        </Text.Label>

        <Text.Label
          color={Constants.Colors.Text.green}
          size={14}
        >
          {
            props.status?.finished ?
              'Finished' :
              (
                props.status?.pickedUp ?
                  'Picked Up' :
                  (
                    (props.order?.rider || props.delivery?.rider) ?
                      'Accepted' :
                      'Processing'
                  )
              )
          }
        </Text.Label>
      </View>

      {
        props.delivery ? (
          <>
            <View>
              <Image
                style={
                  {
                    width: '100%',
                    height: 128
                  }
                }
                source={
                  { uri: props.delivery?.image ?? 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' }
                }
                alt={props.delivery.name + ' picture.'}
              />
            </View>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
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
                <Text.Header
                  color={Constants.Colors.Text.tertiary}
                  size={18}
                >
                  ITEM
                </Text.Header>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  font='monospace'
                  size={14}
                >
                  {props.delivery.name}
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
                <Text.Header
                  color={Constants.Colors.Text.tertiary}
                  size={18}
                >
                  DISTANCE
                </Text.Header>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  font='monospace'
                  size={14}
                >
                  {props.delivery.distance.toFixed(2)}k.m
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
                <Text.Header
                  color={Constants.Colors.Text.tertiary}
                  size={18}
                >
                  WEIGHT
                </Text.Header>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  font='monospace'
                  size={14}
                >
                  {props.delivery.weight.toFixed(2)}kg
                </Text.Label>
              </View>
            </View>
          </>
        ) : null
      }

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
          }
        }
      >
        <Text.Label
          color={Constants.Colors.Text.secondary}
          size={14}
          style='italic'
        >
          Click to view more information
        </Text.Label>
      </View>

      {
        /*props.person.rider ? (
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }
            }
          >
            <Text.Header
              color={Constants.Colors.Text.tertiary}
              size={18}
              weight='bold'
            >
              COURIER
            </Text.Header>

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
              <Image
                style={
                  {
                    width: 48,
                    height: 48
                  }
                }
                source={
                  { uri: props.job.person.rider.profile ?? 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png' }
                }
              />

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column'
                  }
                }
              >
                <Text.Label
                  color={Constants.Colors.Text.tertiary}
                >
                  {props.job.person.rider.fullName}
                </Text.Label>

                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  size={14}
                  style='italic'
                >
                  +63 {props.job.person.rider.phone}
                </Text.Label>
              </View>
            </View>
          </View>
        ) : null*/
      }
    </Pressable>
  )

  /*return (
    <Button
      bg={Constants.Colors.All.whiteSmoke}
      style={
        { elevation: 4 }
      }
      paddingHorizontal={0}
      paddingVertical={0}
    >
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 256 + 32
          }
        }
      >
        <View
          style={
            {
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: Constants.Colors.All.main,
              width: '100%'
            }
          }
        >
          <Text.Label
            color={Constants.Colors.Text.alt}
            align='center'
            size={10}
          >
            # {props.uid}
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
          <View
            style={
              { position: 'relative' }
            }
          >
            <Image
              style={
                {
                  width: '100%',
                  height: 128
                }
              }
              source={
                {
                  uri: props.job.data.delivery ? (
                    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                  ) : (
                    props.job.data.order ? (
                      props.job.person.merchant?.banner
                    ) : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                  )
                }
              }
            />

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  width: '100%',
                  height: 128,
                  position: 'absolute',
                  padding: 8
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.alt}
                size={20}
              >
                {props.job.data?.delivery?.name ?? props.job.person?.merchant.name}
              </Text.Label>
            </View>
          </View>
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingVertical: 8,
              paddingHorizontal: 16,
              gap: 12
            }
          }
        >
          {
            props.job.person?.rider ? (
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }
                }
              >
                <Text.Label
                  size={12}
                  color={Constants.Colors.Text.secondary}
                  font='normal'
                  weight='bold'
                >
                  COURIER
                </Text.Label>

                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      
                      gap: 8
                    }
                  }
                >
                  <Image
                    source={
                      { uri: 'https://scontent.fmnl8-3.fna.fbcdn.net/v/t39.30808-6/322113042_513339527267490_2630672777140286584_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeFiDSKfujbnrZc5hkj-9TuxPaFvLbhzZq09oW8tuHNmreiVqOBaNvtPKm8TzYDZoiuKz86RhfjaaUo3FTJP-j2r&_nc_ohc=y96BBpUC-PwAX-VoXl5&_nc_ht=scontent.fmnl8-3.fna&oh=00_AfAZgFAGFT89KQIrskQJGS5Tzp38ko_KslehTT4k_nQDZQ&oe=64F43E95' }
                    }
                    style={
                      {
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        backgroundColor: Constants.Colors.Text.secondary
                      }
                    }
                  />

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
                      font='normal'
                    >
                      Alexander Montoya
                    </Text.Label>

                    <Text.Label
                      style='italic'
                      font='normal'
                      color={Constants.Colors.Text.secondary}
                      size={12}
                    >
                      +639456282634
                    </Text.Label>
                  </View>
                </View>
              </View>
            ) : null
          }

          {
            props.job.data.order ? (
              <>
                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 8
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
                    <Text.Header
                      size={12}
                      weight='bold'
                      color={Constants.Colors.Text.secondary}
                      font='normal'
                    >
                      DISTANCE
                    </Text.Header>

                    <Text.Label
                      size={14}
                      color={Constants.Colors.Text.tertiary}
                    >
                      {props.job.data.order.distance?.toFixed(2) ?? '0'} km
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
                    <Text.Header
                      size={12}
                      weight='bold'
                      color={Constants.Colors.Text.secondary}
                      font='normal'
                    >
                      ETA
                    </Text.Header>

                    <Text.Label
                      size={14}
                      color={Constants.Colors.Text.tertiary}
                    >
                      {props.job.data.order.eta?.toFixed(2) ?? '0'} seconds
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
                    <Text.Header
                      size={12}
                      weight='bold'
                      color={Constants.Colors.Text.secondary}
                      font='normal'
                    >
                      TOTAL
                    </Text.Header>

                    <Text.Label
                      size={14}
                      color={Constants.Colors.Text.green}
                    >
                      ₱{props.job.data.order.total.toFixed(2)}
                    </Text.Label>
                  </View>
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
                    size={14}
                    font='normal'
                    weight='bold'
                    color={Constants.Colors.Text.tertiary}
                  >
                    ITEMS
                  </Text.Label>

                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        paddingHorizontal: 8
                      }
                    }
                  >
                    {
                      (Object.values(props.job.extra.items) ?? []).map(
                        (data, idx) => (
                          <View
                            key={idx}
                            style={
                              {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 4
                              }
                            }
                          >
                            <Text.Label
                              color={Constants.Colors.Text.secondary}
                              size={14}
                              font='normal'
                              weight='bold'
                            >
                              {(data?.quantity ?? 0).toLocaleString()}x
                            </Text.Label>

                            <Text.Label
                              color={Constants.Colors.Text.secondary}
                              size={14}
                              font='normal'
                            >
                              -
                            </Text.Label>

                            <Text.Label
                              color={Constants.Colors.Text.secondary}
                              size={14}
                              font='normal'
                            >
                              {data.item.name}
                            </Text.Label>
                          </View>
                        )
                      )
                    }
                  </View>
                </View>
              </>
            ) : null
          }

          {
            props.job.data.delivery ? (
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 16
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
                    color={Constants.Colors.Text.secondary}
                    size={12}
                    font='normal'
                    weight='bold'
                  >
                    WEIGHT
                  </Text.Label>

                  <Text.Label
                    size={20}
                    font='monospace'
                  >
                    0 KG
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
                    color={Constants.Colors.Text.secondary}
                    size={12}
                    font='normal'
                    weight='bold'
                  >
                    ARRIVAL TIME
                  </Text.Label>

                  <Text.Label
                    size={20}
                    font='monospace'
                  >
                    12:59pm
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
                    color={Constants.Colors.Text.secondary}
                    size={12}
                    font='normal'
                    weight='bold'
                  >
                    DISTANCE
                  </Text.Label>

                  <Text.Label
                    size={20}
                    font='monospace'
                  >
                    0 KM
                  </Text.Label>
                </View>
              </View>
            ) : null
          }

          <Divider
            color={Constants.Colors.Text.secondary + '40'}
            width={.3}
          />

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 16
              }
            }
          >
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                FROM
              </Text.Label>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                  }
                }
              >
                <Text.Label
                  size={14}
                  color={Constants.Colors.Text.tertiary}
                >
                  {
                    ((props.job.addresses.pickup.landmark ?? '') + ' ' + props.job.addresses.pickup.text)
                      .trim()
                  }
                </Text.Label>
              </View>
            </View>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                TO
              </Text.Label>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row'
                  }
                }
              >
                <Text.Label
                  size={14}
                  color={Constants.Colors.Text.tertiary}
                >
                  {
                    ((props.job.addresses.dropoff.landmark ?? '') + ' ' + props.job.addresses.dropoff.text)
                      .trim()
                  }
                </Text.Label>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Button>
  )*/
}

export default JobCard