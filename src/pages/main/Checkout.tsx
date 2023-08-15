import { UserAppData } from 'app-types/src/app'
import { NativeAppEventEmitter, View, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Display, Text } from '../../../components'
import { App, Constants, Items, Merchant } from 'app-types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown, faLocationDot, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Http } from 'app-structs'

const http = new Http.Client()

const CheckoutPage = (user: UserAppData) => {
  const [items, setItems] = useState<Items.Item[]>(undefined),
    [merchants, setMerchants] = useState<Record<string, Merchant.MerchantData>>(undefined)

  const calculateTotalPrice = (cart: Map<string, App.CartData>) => {
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
  }

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
      <View
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
          <FontAwesomeIcon
            icon={faLocationDot}
            color={Constants.Colors.Layout.main}
          />

          <Text.Label
            color={Constants.Colors.Text.tertiary}
            size={14}
          >
            {
              'Lot 19, Blk 6 Casoy Street. Gordon Heights, Olongapo City, Zambales'.substring(0, 42) +
                '...'
            }
          </Text.Label>

          <FontAwesomeIcon
            icon={faAngleDown}
            color={Constants.Colors.Text.secondary}
          />
        </View>
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 32,
            borderBottomWidth: 1,
            paddingVertical: 8,
            borderBottomColor: 'lightgrey'
          }
        }
      >
        <Text.Header
          color={Constants.Colors.Text.tertiary}
          font='Highman'
          size={36}
        >
          MY CART
        </Text.Header>

        <Text.Label
          size={14}
          color={Constants.Colors.Text.secondary}
        >
          {user.cart.size.toString()} product{user.cart.size === 1 ? '' : 's'}
        </Text.Label>
      </View>

      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1
          }
        }
      >
        <ScrollView
          contentContainerStyle={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 32,
              gap: 32,
              paddingVertical: 8
            }
          }
        >
          {
            items && merchants ? (
              items.map(
                (item, idx) => (
                  <View
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }
                    }
                    key={idx}
                  >
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
                          { uri: item.image ?? '' }
                        }
                        style={
                          {
                            width: 64,
                            height: 64,
                            resizeMode: 'contain',
                            borderRadius: 10
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
                          color={Constants.Colors.Text.tertiary}
                        >
                          {item.name}
                        </Text.Label>
  
                        <Text.Label
                          color={Constants.Colors.Text.secondary}
                          style='italic'
                          size={14}
                        >
                          {merchants[item.merchant]?.name ?? 'No Merchant'}
                        </Text.Label>
                      </View>
                    </View>
  
                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between'
                        }
                      }
                    >
                      <Text.Label
                        color={Constants.Colors.Text.green}
                        weight='bold'
                        size={14}
                      >
                        ₱{item.price.toFixed(2)}
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
                        <Display.Button
                          bg={Constants.Colors.Layout.primary}
                          style={{ elevation: 4, paddingHorizontal: 8, paddingVertical: 8 }}
                          onPress={
                            () => NativeAppEventEmitter.emit('remove-cart', item.uid)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            color={Constants.Colors.Text.main}
                          />
                        </Display.Button>
  
                        <Text.Label>
                          {user.cart.get(item.uid).quantity.toString()}
                        </Text.Label>
  
                        <Display.Button
                          bg={Constants.Colors.Layout.primary}
                          style={{ elevation: 4, paddingHorizontal: 8, paddingVertical: 8 }}
                          onPress={
                            () => NativeAppEventEmitter.emit('add-cart', item.uid)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            color={Constants.Colors.Text.main}
                          />
                        </Display.Button>
                      </View>
                    </View>
                  </View>
                )
              )
            ) : null
          }
        </ScrollView>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              padding: 32,
              backgroundColor: Constants.Colors.All.whiteSmoke,
              borderTopWidth: 1,
              borderTopColor: 'lightgrey',
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
              font='Century Gothic Bold'
              color={Constants.Colors.Text.secondary}
              size={14}
            >
              Your Total
            </Text.Label>

            <Text.Label
              font='Century Gothic Bold'
              color={Constants.Colors.Text.green}
              size={18}
            >
              ₱{calculateTotalPrice(user.cart).toFixed(2)}
            </Text.Label>
          </View>

          <Display.Button
            style={
              {
                borderRadius: 10,
                paddingHorizontal: 32,
                paddingVertical: 14
              }
            }
            bg={Constants.Colors.All.main}
          >
            <Text.Label
              color={Constants.Colors.Text.alt}
              weight='bold'
              align='center'
              size={14}
            >
              Checkout
            </Text.Label>
          </Display.Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CheckoutPage