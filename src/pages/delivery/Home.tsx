import { Account, App, Constants, Deliveries } from 'app-types'
import { Display, Form, Text } from '../../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, ScrollView, View, Alert, BackHandler, Pressable, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { Http } from 'app-structs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRight, faBalanceScale, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import UploadImage from '../../../components/Cards/UploadImage'

const http = new Http.Client()

const DeliveryHomePage = (user: App.UserAppData) => {
  const [weight, setWeight] = useState<string>(),
    [name, setName] = useState<string>(),
    [itemImg, setItemImg] = useState<string>(),
    [imageModalShown, setImageModalShown] = useState(false),
    [imageUrl, setImageUrl] = useState<string>(),
    [deliveriesCount, setDeliveriesCount] = useState<number>(),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    navigation = useNavigation()

  const onBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'No',
          onPress: () => {}
        },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp()
        }
      ],
      { cancelable: false }
    )

    return true
  }

  useFocusEffect(
    useCallback(
      () => {
        const getDeliveries = async () => {
          const res = await http.request<number>(
            {
              method: 'get',
              url: Constants.Url.Routes.USER_ACTIVE_DELIVERIES,
              headers: {
                Authorization: user.token
              }
            }
          )

          
          setDeliveriesCount(res.value ?? 0)
        }

        getDeliveries()
          .catch(console.error)

        BackHandler.addEventListener('hardwareBackPress', onBackPress)
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }
      },
      []
    )
  )

  return (
    <>
      <Display.Modal
        show={imageModalShown}
        onDismiss={
          () => setImageModalShown(false)
        }
        container={
          {
            style: {
              margin: 32
            }
          }
        }
      >
        <UploadImage
          token={user.token}
          onUpload={
            (uri, original) => {
              setItemImg(original)
              setImageUrl(uri)

              setImageModalShown(false)
            }
          }
        />
      </Display.Modal>

      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingVertical: 8,
              gap: 4,
            }
          }
          style={
            { marginBottom: 8 }
          }
        >
          <Display.Header
            {...user.data}
            hideFavourites
          />

          {
            deliveriesCount >= 1 ? (
              <Display.FloatingCard
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    marginHorizontal: 32,
                    gap: 8,
                    marginTop: 16
                  }
                }
                color={Constants.Colors.Text.gold}
              >
                <Text.Label
                  color={Constants.Colors.Text.tertiary}
                >
                  You currently have on going deliveries. Check them out!
                </Text.Label>

                <View style={{ flexDirection: 'row' }}>
                  <Display.Button
                    bg={Constants.Colors.Text.tertiary}
                    text={
                      { content: 'Visit', reverse: true }
                    }
                    icon={faArrowRight}
                    onPress={
                      () => (navigation.navigate as any)('Orders')
                    }
                  />
                </View>
              </Display.FloatingCard>
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
            <View
              style={
                { paddingHorizontal: 32, marginTop: 16 }
              }
            >
              {
                typeof deliveriesCount === 'number' ? (
                  <Text.Label
                    color={
                      deliveriesCount >= 1 ?
                        Constants.Colors.Text.green :
                        Constants.Colors.Text.danger
                    }
                  >
                    {
                      deliveriesCount ?
                        `You currently have ${deliveriesCount} active deliver${deliveriesCount === 1 ? 'y' : 'ies'}.` :
                        'You don\'t have any active deliveries right now.'
                    }
                  </Text.Label>
                ) : (
                  <ActivityIndicator
                    color={Constants.Colors.All.main}
                  />
                )
              }
            </View>
            
            <ScrollView
              contentContainerStyle={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  paddingHorizontal: 32,
                  //paddingVertical: deliveries && deliveries.length >= 1 ? 16 : 0,
                  gap: 16
                }
              }
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {
                /*deliveries ? (
                  deliveries.map(
                    (delivery, idx) => (
                      <Card.DeliveryCard
                        key={idx}
                        delivery={delivery}
                        rider={data.riders[delivery.uid]}
                      />
                    )
                  )
                ) :*/ null
              }
            </ScrollView>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                paddingHorizontal: 32,
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
              <Text.Header
                weight='bold'
                color={Constants.Colors.Text.tertiary}
                size={28}
              >
                Create a Delivery
              </Text.Header>

              <Text.Label
                font='normal'
                style='italic'
                color={Constants.Colors.Text.secondary}
                size={14}
              >
                Create your delivery today and get started!
              </Text.Label>
            </View>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }
              }
            >
              { /* Item to Deliver */ }
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8
                  }
                }
              >
                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      flex: 1
                    }
                  }
                >
                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 4,
                        alignItems: 'center'
                      }
                    }
                  >
                    <FontAwesomeIcon
                      icon={faBoxOpen}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Text.Label
                      font='normal'
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                    >
                      Item Name
                    </Text.Label>
                  </View>

                  <Form.Input
                    fontSize={12}
                    placeholder='Item name'
                    value={name}
                    onValue={setName}
                  />
                </View>

                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      flex: 1
                    }
                  }
                >
                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 4,
                        alignItems: 'center'
                      }
                    }
                  >
                    <FontAwesomeIcon
                      icon={faBalanceScale}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Text.Label
                      font='normal'
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                    >
                      Expected Weight
                    </Text.Label>
                  </View>

                  <Form.Input
                    fontSize={12}
                    placeholder='Weight (kg)'
                    numberOnly
                    value={weight}
                    onValue={
                      (value) => setWeight(value)
                    }
                  />
                </View>
              </View>

              <Pressable
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 256 - (128 / 2),
                    backgroundColor: Constants.Colors.Text.secondary + '30',
                    padding: itemImg ? 0 : 32
                  }
                }
                onPress={
                  () => setImageModalShown(true)
                }
              >
                {
                  itemImg ? (
                    <Image
                      source={
                        { uri: itemImg }
                      }
                      style={
                        {
                          width: '100%',
                          height: '100%'
                        }
                      }
                    />
                  ) : (
                    <Text.Label
                      font='normal'
                      weight='bold'
                      color={Constants.Colors.Text.tertiary}
                      align='center'
                    >
                      Click here to upload a picture of the item.
                    </Text.Label>
                  )
                }
              </Pressable>

              {
                itemImg ? (
                  <Display.Button
                    text={
                      { content: 'Continue' }
                    }
                    inverted={
                      {
                        color: Constants.Colors.All.lightBlue,
                        secondaryColor: Constants.Colors.All.whiteSmokeAlt
                      }
                    }
                    onPress={
                      () => {
                        setResult([false, ''])

                        if (!name)
                          return setResult(
                          [
                            true,
                            'Error: Make srue to provide the name of the item to deliver.'
                          ]
                        )

                        if (isNaN(weight as any))
                          return setResult(
                          [
                            true,
                            'Eror: Please make sure that the weight is a valid number and not less than 0 or greater than 25.'
                          ]
                        )

                        if (!imageUrl)
                          return setResult(
                            [
                              true,
                              'Error: Please make sure to provide an image of the item to deliver.'
                            ]
                          );
                        
                        (navigation.navigate as any)(
                          'NewDelivery',
                          {
                            form: {
                              name,
                              weight: Number(weight),
                              proof: imageUrl
                            }
                          }
                        )
                      }
                    }
                  />
                ) : null
              }
            </View>

            {
              message ? (
                <Text.Label
                  color={
                    error ?
                      Constants.Colors.Text.danger :
                      Constants.Colors.Text.green
                  }
                  align='center'
                >
                  {message}
                </Text.Label>
              ) : null
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default DeliveryHomePage