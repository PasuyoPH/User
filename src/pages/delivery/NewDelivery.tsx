import { Address, App, Constants, Deliveries } from 'app-types'
import { View, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Display, Text } from '../../../components'
import { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import { faAngleLeft, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons'

const http = new Http.Client()

const NewDeliveryPage = (props: App.PageProps & App.UserAppData) => {
  const { pickup, dropoff, form } = props.route.params as {
      pickup: Address.AddressData,
      dropoff: Address.AddressData,
      form: { name: string, weight: number }
    },
    navigation = useNavigation()

  const navigateToAddress = (name: string) => (navigation.navigate as any)(
      'ChooseAddress',
      {
        route: 'NewDelivery',
        props: { pickup, dropoff, form },
        name
      }
    ),
    onBackPress = () => {
      (navigation.navigate as any)('Home')
      return true
    },
    pressContinue = async () => {
      // create new draft here
      const res = await http.request<Deliveries.Data>(
        {
          method: 'post',
          url: Constants.Url.Routes.DELIVERIES,
          headers: {
            Authorization: props.token
          },
          data: {
            address: { pickup: pickup.uid, dropoff: dropoff.uid },
            delivery: form
          }
        }
      );

      (navigation.navigate as any)(
        'Confirm',
        {
          pickup,
          dropoff,
          delivery: res.value
        }
      )
    }

  useFocusEffect(
    useCallback(
      () => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress)

        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }
      },
      []
    )
  )

  return (
    <SafeAreaView>
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 32,
            paddingVertical: 16,
            gap: 32
          }
        }
      > 
        <View
          style={{ flexDirection: 'row' }}
        >
          <Display.Button
            icon={faAngleLeft}
            bg='transparent'
            text={{ color: Constants.Colors.Text.tertiary }}
            paddingHorizontal={0}
            paddingVertical={0}
            onPress={
              () => navigation.goBack()
            }
          />
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
            weight='bold'
            size={28}
            color={Constants.Colors.Text.tertiary}
          >
            Choose addresses
          </Text.Header>

          <Text.Label
            color={Constants.Colors.Text.secondary}
            size={14}
            style='italic'
            font='normal'
          >
            for your delivery, on where to pickup and drop off.
          </Text.Label>
        </View>

        { /* container for address choosers */ }
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }
          }
        >
          { /* pickup address */ }
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }
            }
          >
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={20}
            >
              Where to pick up?
            </Text.Label>

            {
              pickup ? (
                <Card.Address
                  address={pickup}
                  token={props.token}
                  hideButtons
                  onPress={() => navigateToAddress('pickup')}
                />
              ) : (
                <View
                  style={
                    { flexDirection: 'row' }
                  }
                >
                  <Display.Button
                    text={
                      { content: 'Choose', reverse: true }
                    }
                    inverted={
                      { color: Constants.Colors.Text.green}
                    }
                    icon={faPlus}
                    onPress={() => navigateToAddress('pickup')}
                  />
                </View>
              )
            }
          </View>

          { /* dropoff address */ }
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }
            }
          >
            <Text.Label
              color={Constants.Colors.Text.tertiary}
              size={20}
            >
              Where to drop off?
            </Text.Label>

            {
              dropoff ? (
                <Card.Address
                  address={dropoff}
                  token={props.token}
                  hideButtons
                  onPress={() => navigateToAddress('pickup')}
                />
              ) : (
                <View
                  style={
                    { flexDirection: 'row' }
                  }
                >
                  <Display.Button
                    text={
                      { content: 'Choose', reverse: true }
                    }
                    inverted={
                      { color: Constants.Colors.Text.green}
                    }
                    icon={faPlus}
                    onPress={() => navigateToAddress('dropoff')}
                  />
                </View>
              )
            }
          </View>
        </View>

        {
          pickup && dropoff ? (
            <Display.Button
              text={
                { content: 'Continue', reverse: true }
              }
              inverted={{}}
              icon={faArrowRight}
              onPress={pressContinue}
            />
          ) : null
        }
      </View>
    </SafeAreaView>
  )
}

export default NewDeliveryPage