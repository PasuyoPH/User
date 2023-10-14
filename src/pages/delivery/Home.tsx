import { Account, App, Constants, Deliveries } from 'app-types'
import { Card, Display, Form, Text } from '../../../components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { Http } from 'app-structs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRight, faBalanceScale, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'

interface FetchedDeliveries {
  deliveries: Deliveries.Data[]
  riders: Account.RiderAccountData[]
}

const http = new Http.Client()

const DeliveryHomePage = (user: App.UserAppData) => {
  const [data, setData] = useState<FetchedDeliveries>(),
    [weight, setWeight] = useState<number>(0),
    [name, setName] = useState<string>(),
    [deliveries, setDeliveries] = useState<Deliveries.Data[]>(),
    [drafts, setDrafts] = useState<Deliveries.Data[]>(),
    navigation = useNavigation()

  useFocusEffect(
    useCallback(
      () => {
        const getDeliveries = async () => {
          const res = await http.request<FetchedDeliveries>(
            {
              method: 'get',
              url: Constants.Url.Routes.DELIVERIES,
              headers: {
                Authorization: user.token
              }
            }
          )

          setData(res.value)
          if (res.value) {
            const deliveriesArr = [],
              draftsArr = []

            for (const delivery of res.value.deliveries) {
              if (delivery.draft)
                draftsArr.push(delivery)
              else deliveriesArr.push(delivery)
            }

            setDeliveries(deliveriesArr)
            setDrafts(draftsArr)
          }
        }

        getDeliveries()
          .catch(console.error)
      },
      []
    )
  )

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 8,
            gap: 32
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
          drafts && drafts.length >= 1 ? (
            <Display.FloatingCard
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  marginHorizontal: 32,
                  gap: 8
                }
              }
              color={Constants.Colors.Text.gold}
            >
              <Text.Label
                color={Constants.Colors.Text.tertiary}
              >
                Seems like you have drafts that are not yet completed. Check them out!
              </Text.Label>

              <View style={{ flexDirection: 'row' }}>
                <Display.Button
                  bg={Constants.Colors.Text.tertiary}
                  text={
                    { content: 'Visit', reverse: true }
                  }
                  icon={faArrowRight}
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
              { paddingHorizontal: 32 }
            }
          >
            {
              deliveries ? (
                <Text.Label
                  color={
                    deliveries && deliveries.length >= 1 ?
                      Constants.Colors.Text.green :
                      Constants.Colors.Text.danger
                  }
                >
                  {
                    deliveries.length >= 1 ?
                      `You currently have ${deliveries.length} active deliver${deliveries.length === 1 ? 'y' : 'ies'}.` :
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
                paddingVertical: deliveries && deliveries.length >= 1 ? 16 : 0,
                gap: 16
              }
            }
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {
              deliveries ? (
                deliveries.map(
                  (delivery, idx) => (
                    <Card.DeliveryCard
                      key={idx}
                      delivery={delivery}
                      rider={data.riders[delivery.uid]}
                    />
                  )
                )
              ) : null
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
                  value={weight.toString()}
                  onValue={
                    (value) => setWeight(Number(value))
                  }
                />
              </View>
            </View>

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
                () => (navigation.navigate as any)(
                  'NewDelivery',
                  { form: { name, weight } }
                )
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DeliveryHomePage