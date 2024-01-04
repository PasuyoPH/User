import { PageProps, UserAppData } from 'app-types/src/app'
import { NativeAppEventEmitter, View, Image, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Display, Text } from '../../../components'
import { Address, App, Constants, Items, Merchant, Orders } from 'app-types'
import { faMapMarkerAlt, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Http } from 'app-structs'
import { useNavigation } from '@react-navigation/native'
import useStateRef from 'react-usestateref'
import { Http as HttpType } from 'app-types'

const http = new Http.Client()

const CheckoutPage = (user: UserAppData & PageProps) => {
  const { address } = (user.route.params ?? {}) as { address?: Address.AddressData }

  const [items, setItems, itemsRef] = useStateRef<Items.Item[]>(undefined),
    [merchants, setMerchants] = useState<Record<string, Merchant.MerchantData>>(undefined),
    [totalPrice, setTotalPrice] = useState<number>(0),
    [currentAddress, setCurrentAddress, currentAddressRef] = useStateRef<Address.AddressData>(address),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    navigation = useNavigation()

  const convertItemsToCheckout = async () => {
      const orderData: HttpType.OrderData[] = []
      // loop through each item and then get cart data
      for (const item of itemsRef.current) {
        const cartData = user.cart.get(item.uid)
        if (!cartData) continue

        console.log('CART DATA:', cartData)
        
        orderData.push(
          {
            item: item.uid,
            merchant: item.merchant,
            quantity: cartData.quantity
          }
        )
      }

      return orderData
    },
    calculateTotalPrice = (cart: Map<string, App.CartData>) => {
      const checked = [] // array of checked items
      let total = 0

      for (const item of (items ?? [] as Items.Item[])) {
        const cartItem = cart.get(item.uid)
        if (!checked.includes(item.uid) && cartItem) {
          total += cartItem.quantity * item.price
          checked.push(item.uid)
        }
      }

      return total
    },
    onBackPress = () => {
      (navigation.navigate as any)('Home')
      return true
    },
    pressContinue = async () => {
      setResult([false, ''])
      if (typeof totalPrice !== 'number') return;

      if (totalPrice <= 0)
        return setResult(
          [
            true,
            'Price is set to 0, make sure to add items to your cart.'
          ]
        );

      if (!currentAddress)
        return setResult(
          [
            true,
            'Please make sure to set the location of delivery.'
          ]
        )

      // send request
      const result = await http.request<Orders.Order>(
          {
            method: 'post',
            url: Constants.Url.Routes.ORDERS,
            data: {
              data: await convertItemsToCheckout(),
              address: currentAddressRef.current.uid
            },
            headers: {
              Authorization: user.token
            }
          }
        )

      if (result.error)
        setResult(
          [
            true,
            result.message ?? 'Error: Something happened. Please try again.'
          ]
        )

      if (result.value) { // get merchant
        const merchant = await http.request<Merchant.MerchantData>(
          {
            method: 'get',
            url: Constants.Url.Routes.MERCHANT(result.value.merchant),
            headers: {
              Authorization: user.token
            }
          }
        )

        if (!merchant.value) return; // should rarely happen

        (navigation.navigate as any)(
          'ChoosePayment',
          {
            address: currentAddress,
            items,
            merchant: merchant.value,
            order: result.value
          }
        )
      }
    }

  useFocusEffect(
    useCallback(
      () => {
        if (!Array.isArray(items) || !user.cart) return
  
        setTotalPrice(
          calculateTotalPrice(user.cart)
        )
      },
      [user.cart, items]
    )
  )

  useFocusEffect(
    useCallback(
      () => {
        setCurrentAddress(address ?? null)
      },
      [address]
    )
  )

  useFocusEffect(
    useCallback(
      () => {
        const getItems = async () => {
          const ids = [...user.cart.keys()],
            res = await http.request<Items.Item[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.ITEMS_IDS(ids),
                headers: {
                  Authorization: user.token
                }
              }
            )

          setItems(res.value ?? [])
          if (Array.isArray(res.value)) { // fetch merchants
            const merchantRes = await http.request<Merchant.MerchantData[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.MERCHANT_IDS(
                  res.value.map(
                    (item) => item.merchant
                  )
                ),
                headers: {
                  Authorization: user.token
                }
              }
            )

            if (Array.isArray(merchantRes.value)) {
              const data: Record<string, Merchant.MerchantData> = {}
              merchantRes.value.forEach(
                (merchant) => {
                  data[merchant.uid] = merchant
                }
              )

              setMerchants(data)
            }
          }
        }

        getItems()
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
    <SafeAreaView
    style={
      {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 16
      }
    }
    >
    <ScrollView
      
    >
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4
          }
        }
      >
        <Text.Label
          color={Constants.Colors.Text.secondary}
          size={12}
        >
          Deliver to
        </Text.Label>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }
          }
        >
          <Display.Button
            icon={faMapMarkerAlt}
            text={
              {
                content: currentAddress !== undefined ? (
                    (
                      () => {                        
                        if (!currentAddressRef.current)
                          return 'No location set'

                        const addressText = [currentAddress.landmark ?? '', currentAddress.text]
                          .join(' ')
                          .trim()

                        return addressText.length > 40 ?
                          addressText.substring(0, 40) + '...' :
                          addressText
                      }
                    )()
                  ) : (
                    'No address selected' 
                  ),
                size: 14,
                color: Constants.Colors.Text.tertiary
              }
            }
            paddingHorizontal={0}
            paddingVertical={0}
            bg='transparent'
            onPress={
              () => (navigation.navigate as any)('ChooseAddress')
            }
          />
        </View>
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 32
          }
        }
      >
        <Text.Header
          weight='bold'
          size={28}
          color={Constants.Colors.Text.tertiary}
        >
          Here's your cart
        </Text.Header>

        <Text.Label
          color={Constants.Colors.Text.secondary}
          size={14}
          style='italic'
        >
          {
            items && merchants ? (
              user.cart.size + ' item' + (user.cart.size === 1 ? '' : 's')
            ) : (
              'Loading...'
            )
          }
        </Text.Label>
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 28
          }
        }
      >
        {
          items && merchants ? (
            items.map(
              (item, idx) => {
                const itemInCart = user.cart.get(item.uid)
                if (!itemInCart || itemInCart.quantity < 1) return null

                return (
                  <View
                    key={idx}
                    style={
                      {
                        elevation: 4,
                        margin: 4,
                        backgroundColor: Constants.Colors.Text.alt,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 10,
                        maxWidth: 128 + 32
                      }
                    }
                  >
                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 8
                        }
                      }
                    >
                      <Image
                        source={
                          { uri: item.image }
                        }
                        style={
                          { width: 64, height: 64 }
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
                          {item.name}
                        </Text.Label>
  
                        <Text.Label
                          size={10}
                          font='monospace'
                          color={Constants.Colors.Text.secondary}
                        >
                          ₱{(item.price + (item.price * .15)).toFixed(2)}
                        </Text.Label>
                      </View>
  
                      <View
                        style={
                          {
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }
                        }
                      >
                        <Display.Button
                          onPress={
                            () => NativeAppEventEmitter.emit('remove-cart', item.uid)
                          }
                          icon={faMinus}
                          paddingHorizontal={8}
                          paddingVertical={4}
                          style={
                            {
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0
                            }
                          }
                          bg={Constants.Colors.All.lightBlue}
                        />
  
                        <View
                          style={
                            { padding: 8 }
                          }
                        >
                          <Text.Label
                            color={Constants.Colors.Text.tertiary}
                            size={14}
                          >
                            {itemInCart?.quantity.toLocaleString()}
                          </Text.Label>
                        </View>
  
                        <Display.Button
                          onPress={
                            () => NativeAppEventEmitter.emit('add-cart', item.uid)
                          }
                          icon={faPlus}
                          paddingHorizontal={8}
                          paddingVertical={4}
                          style={
                            {
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0
                            }
                          }
                          bg={Constants.Colors.All.lightBlue}
                        />
                      </View>
                    </View>
                  </View>
                )
              }
            )
          ) : null
        }
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              padding: 32,
              gap: 16
            }
          }
        >
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            }
          >
            <Text.Label
              color={Constants.Colors.Text.secondary}
              size={16}
            >
              Your Total (excluding fees)
            </Text.Label>

            {
              typeof totalPrice === 'number' ? (
                <Text.Label
                  font='monospace'
                  color={Constants.Colors.Text.green}
                  size={14}
                >
                  ₱{((totalPrice * .15) + totalPrice).toFixed(2)}
                </Text.Label>
              ) : (
                <ActivityIndicator />
              )
            }
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                width: '100%'
              }
            }
          >
            <Display.Button
              inverted={
                { color: Constants.Colors.All.lightBlue }
              }
              onPress={pressContinue}
              text={
                {
                  content: typeof totalPrice === 'number' ?
                    'Continue' : (
                    <ActivityIndicator
                      color='white'
                    />
                  )
                }
              }
              style={{ width: '100%' }}
            />

            {
              message ? (
                <Text.Label
                  color={
                    error ?
                      Constants.Colors.Text.danger :
                      Constants.Colors.Text.green
                  }
                  size={14}
                  align='center'
                >
                  {message}
                </Text.Label>
              ) : null
            }
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default CheckoutPage