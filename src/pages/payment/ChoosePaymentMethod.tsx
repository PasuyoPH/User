import { ActivityIndicator, NativeAppEventEmitter, ScrollView, View } from 'react-native'
import { PageProps, UserAppData } from 'app-types/src/app'
import { Address, Constants, Items, Merchant, Payments, Paypal } from 'app-types'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Card, Display, Text } from '../../../components'
import { useCallback, useState } from 'react'
import { Http } from 'app-structs'
import { Orders } from 'app-types'
import { Http as HttpType } from 'app-types'
import * as Linking from 'expo-linking'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useStateRef from 'react-usestateref'

const http = new Http.Client()

// page to choose payment method
// FOR ORDERS
const ChoosePaymentMethodPage = (props: PageProps & UserAppData) => {
  const [checkoutItems, setCheckoutItems] = useState<HttpType.OrderData[]>(),
    [buttonLoading, setButtonLoading] = useState(false),
    [_, setReceipt, receipt] = useStateRef<string>(),
    { items, address, merchant, order } = props.route.params as {
      items: Items.Item[],
      address: Address.AddressData,
      merchant: Merchant.MerchantData,
      order: Orders.Order
    },
    [methods, setMethods] = useState<Payments.PaymentMethod[]>(),
    [selectedMethod, setSelectedMethod] = useState(0),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    navigation = useNavigation()

  const createPaymentUrl = async (data: Orders.Order, paymentType: number) => {
    setResult([false, ''])
    if (!data) return setButtonLoading(false)

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
          type: 1,
          payment_method: paymentType,
          payment_receipt: receipt.current
        }
      }
    )

    setButtonLoading(false)

    if (result.error)
      return setResult(
        [
          true,
          result.message ?? 'Error: Payment creation failed. Please try again or contact us.'
        ]
      )

    if (result.value) {
      if (result.value.redirectTo)
        Linking.openURL(result.value.redirectTo)
      else {
        // send to a payment processed page
        (navigation.navigate as any)('Processed')
      }

      // clear user cart as we are finished
      NativeAppEventEmitter.emit('cart-clear')

      return true
    } else return false
  }

  useFocusEffect(
    useCallback(
      () => {
        const cart = new Map(props.cart)
  
        // remove all items that have 0 quantity
        for (const [key, value] of cart)
          if (value.quantity < 1) cart.delete(key)
  
        NativeAppEventEmitter.emit('set-cart', cart)
  
        const convertItemsToCheckout = async () => {
            const orderData: HttpType.OrderData[] = []
            // loop through each item and then get cart data
            for (const item of items) {
              const cartData = cart.get(item.uid)
              if (!cartData) continue
              
              orderData.push(
                {
                  item: item.uid,
                  merchant: item.merchant,
                  quantity: cartData.quantity
                }
              )
            }
  
            setCheckoutItems(orderData)
          },
          getPaymentMethods = async () => {
            const res = await http.request<Payments.PaymentMethod[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.PAYMENTMETHODS
              }
            )
  
            setMethods(
              res.value ?
                [res.value[0]] :
                []
            )
          }
          
        getPaymentMethods()
          .catch(console.error)
  
        convertItemsToCheckout()
          .catch(console.error)
      },
      []
    )
  )

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 32,
              paddingVertical: 64,
              flexGrow: 1,
              backgroundColor: Constants.Colors.All.whiteSmokeAlt,
              gap: 24
            }
          }
        >
          <Card.ConfirmOrder
            order={order}
            merchant={merchant}
            address={address}
            items={items}
            cart={props.cart}
          />

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row'
              }
            }
          >
            <Display.Button
              icon={faAngleLeft}
              iconSize={24}
              text={{ color: Constants.Colors.Text.tertiary }}
              bg='#00000000'
              paddingHorizontal={0}
              onPress={navigation.goBack}
            />
          </View>

          <View
            style={
              { paddingHorizontal: 8 }
            }
          >
            <Text.Header
              color={Constants.Colors.Text.tertiary}
              size={18}
              //weight='bold'
              font='Wolf Sans'
            >
              Payment Methods
            </Text.Header>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                paddingVertical: 8,
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
                      requireImage={method.requireImage}
                      token={props.token}
                      onComplete={
                        (data) => setReceipt(data.img)
                      }
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
          </View>
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              //position: 'absolute',
              //  bottom: 70,
              width: '100%',
              justifyContent: 'center',
              paddingHorizontal: 32,
              marginBottom: 32,
              gap: 8
            }
          }
        >
          <Display.Button
            bg={Constants.Colors.Layout.tertiary}
            text={
              checkoutItems || !buttonLoading ? (
                { content: 'Continue' }
              ) : undefined
            }
            style={
              { width: '100%' }
            }
            onPress={
              async () => {
                if (!checkoutItems || buttonLoading) return
                // after creating the order, create a new payment url which will redirect to the payment url
                await createPaymentUrl(order, selectedMethod)
              }
            }
          >
            {
              !checkoutItems || buttonLoading ? (
                <ActivityIndicator
                  color={Constants.Colors.Text.alt}
                />
              ) : undefined
            }
          </Display.Button>

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
  )
}

export default ChoosePaymentMethodPage