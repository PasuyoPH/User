import { Address, App, Constants, Deliveries, Orders, Payments, Paypal } from 'app-types'
import { View, ScrollView , ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Display, Text } from '../../../components'
import { useState, useCallback } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import * as Linking from 'expo-linking'

const http = new Http.Client()

const ConfirmDelivery = (props: App.PageProps & App.UserAppData) => {
  const { pickup, dropoff, delivery } = props.route.params as {
      pickup: Address.AddressData,
      dropoff: Address.AddressData,
      delivery: Deliveries.Data
    },
    [methods, setMethods] = useState<Payments.PaymentMethod[]>(),
    [selectedMethod, setSelectedMethod] = useState(0),
    navigation = useNavigation()

  const createPaymentUrl = async (data: { uid: string }, paymentType: number) => {
    if (!data) return

    // create payment
    const result = await http.request<Paypal.PaymentPaypalCreated>(
      {
        method: 'post',
        url: Constants.Url.Routes.PAYMENT,
        headers: {
          Authorization: props.token
        },
        data: {
          uid: data.uid,
          type: 0,
          payment_method: paymentType
        }
      }
    )

    if (result.value) {
      if (result.value.redirectTo)
        Linking.openURL(result.value.redirectTo)
      else {
        // send to a payment processed page
        (navigation.navigate as any)('Processed', { uid: data.uid })
      }

      return true
    } else return false
  }

  useFocusEffect(
    useCallback(
      () => {
        const getPaymentMethods = async () => {
          const res = await http.request<Payments.PaymentMethod[]>(
            {
              method: 'get',
              url: Constants.Url.Routes.PAYMENTMETHODS
            }
          )

          setMethods(res.value ?? [])
        }

        getPaymentMethods()
          .catch(console.error)
      },
      []
    )
  )

  return (
    <SafeAreaView
      style={
        {
          display: 'flex',
          flexDirection: 'column'
        }
      }
    >
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 16,
            paddingHorizontal: 32
          }
        }
      >
        <Text.Header
          weight='bold'
          size={28}
          color={Constants.Colors.Text.tertiary}
        >
          Confirm Delivery
        </Text.Header>

        <Text.Label
          color={Constants.Colors.Text.secondary}
          size={14}
          style='italic'
          font='normal'
        >
          Confirm your delivery by paying in order to get it processed.
        </Text.Label>
      </View>

      <View
        style={
          {
            flexDirection: 'row',
            paddingHorizontal: 32
          }
        }
      >
        <Card.ConfirmDelivery
          delivery={delivery}
          pickup={pickup}
          dropoff={dropoff}
        />
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            marginTop: 32,
            paddingHorizontal: 32
          }
        }
      >
        <Text.Header
          weight='bold'
          size={28}
          color={Constants.Colors.Text.tertiary}
        >
          Payment Method
        </Text.Header>

        <Text.Label
          color={Constants.Colors.Text.secondary}
          size={14}
          style='italic'
          font='normal'
        >
          Complete this delivery by choosing a payment method below.
        </Text.Label>
      </View>

      <ScrollView
        contentContainerStyle={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 32,
            paddingVertical: 16,
            gap: 8
          }
        }
      >
        {
          methods ? (
            methods.map(
              (method, idx) => (
                <Card.PaymentMethod
                  key={idx}
                  index={idx}
                  selected={idx === selectedMethod}
                  name={method.name}
                  onPress={() => setSelectedMethod(idx)}
                  image={method.image}
                />
              )
            )
          ) : (
            <ActivityIndicator
              color={Constants.Colors.All.main}
              size={32}
            />
          )
        }
      </ScrollView>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            paddingHorizontal: 32,
            justifyContent: 'space-between',
            gap: 8
          }
        }
      >
        <Display.Button
          text={
            { content: 'Cancel', reverse: true }
          }
          icon={faX}
          inverted={
            { color: Constants.Colors.Text.danger }
          }
          style={{ flex: 1 }}
        />

        <Display.Button
          text={
            { content: 'Continue', reverse: true }
          }
          icon={faCheck}
          style={{ flex: 1 }}
          bg={Constants.Colors.Text.green}
          onPress={
            async () => await createPaymentUrl(delivery, selectedMethod)
          }
        />
      </View>
    </SafeAreaView>
  )
}

export default ConfirmDelivery