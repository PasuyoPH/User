import { useFocusEffect } from '@react-navigation/native'
import { Http } from 'app-structs'
import { App, Constants, Items, Merchant } from 'app-types'
import { UserAppData } from 'app-types/src/app'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, Pressable, View } from 'react-native'
import { Display, Text } from '../../../components'
import { FloatingCard } from '../../../components/Display'
import { StatusBar } from 'expo-status-bar'

const http = new Http.Client(),
  hexIsLight = (color: string) => {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
  }

const ViewItemPage = (props: App.PageProps & UserAppData) => {
  const { uid = '?' } = props.route.params as { uid: string },
    [data, setData] = useState<{ item: Items.Item, merchant: Merchant.MerchantData }>(),
    [accent, setAccent] = useState<string>(Constants.Colors.Layout.main),
    [isInCart, setIsInCart] = useState(false)

  useFocusEffect(
    useCallback(
      () => {
        const getItemData = async () => {
          const res = await http.request<{ item: Items.Item, merchant: Merchant.MerchantData }>(
            {
              method: 'get',
              url: Constants.Url.Routes.ITEM(uid),
              headers: {
                Authorization: props.token
              }
            }
          )

          setData(res.value)
          
          if (res.value) {
            if (res.value.merchant.accent) setAccent(res.value.merchant.accent)
            if (props.cart.has(res.value.item.uid)) setIsInCart(true)
          }
        }

        getItemData()
          .catch(console.error)
      },
      []
    )
  )

  return data ? (
    <>
      <StatusBar
        style={
          hexIsLight(accent) ?
            'dark' :
            'light'
        }
      />

      <SafeAreaView
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: accent,
            alignItems: 'center',
            flexGrow: 1
          }
        }
      >
        { /* Image Header */ }
        <View
          style={
            {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 32
            }
          }
        >
          <Image
            source={
              { uri: data.item.image ?? '' }
            }
            style={
              {
                height: 256,
                resizeMode: 'contain',
                width: 256
              }
            }
          />
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              flexGrow: 1,
              flex: 1,
              width: '100%',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 32,
              gap: 32
            }
          }
        >
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
              }
            }
          >
            <Text.Header
              weight='bold'
              color={Constants.Colors.Text.tertiary}
              size={24}
            >
              {data.item.name}
            </Text.Header>

            <Text.Label
              style='italic'
              color={Constants.Colors.Text.secondary}
            >
              Signature Jollibee Chickenjoy with rice and gravy.
            </Text.Label>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }
            }
          >
            <Display.Divider
              width={.3}
              color='lightgrey'
            />

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
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 12
                  }
                }
              >
                <Image
                  source={
                    { uri: data.merchant.logo ?? '' }
                  }
                  style={
                    { width: 64, height: 64, borderRadius: 20 }
                  }
                />

                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }
                  }
                >
                  <Text.Label
                    color={Constants.Colors.Text.tertiary}
                    weight='bold'
                  >
                    {data.merchant.name}
                  </Text.Label>

                  <Text.Label
                    color={Constants.Colors.Text.secondary}
                    style='italic'
                  >
                    {data.merchant.bio ?? 'No bio provided'}
                  </Text.Label>
                </View>
              </View>

              <View
                style={
                  {
                    backgroundColor: accent,
                    borderRadius: 20,
                    paddingHorizontal: 24,
                    paddingVertical: 8
                  }
                }
              >
                <Text.Label
                  weight='bold'
                  color={
                    hexIsLight(accent) ?
                      Constants.Colors.Text.tertiary :
                      Constants.Colors.Text.alt
                  }
                >
                  Visit
                </Text.Label>
              </View>
            </View>

            <Display.Divider
              width={.3}
              color='lightgrey'
            />
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                flexGrow: 1
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
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8
                    }
                  }
                >
                  <Text.Label
                    color={Constants.Colors.Text.tertiary}
                    font='Century Gothic Bold'
                    size={18}
                  >
                    Price
                  </Text.Label>

                  <Text.Label
                    size={12}
                    color={Constants.Colors.Text.secondary}
                  >
                    Quantity: 1
                  </Text.Label>
                </View>

                <Text.Header>
                  ₱{data.item.price.toFixed(2)}
                </Text.Header>
              </View>

              <View>
                <Pressable
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: data.merchant.accent ?? Constants.Colors.All.main,
                      borderRadius: 24,
                      paddingHorizontal: 24,
                      paddingVertical: 10
                    }
                  }
                  onPress={
                    () => {
                      setIsInCart(!isInCart)
                      if (props.cart.has(data.item.uid))
                        props.cart.delete(data.item.uid)
                      else props.cart.set(data.item.uid, { quantity: 1 })
                    }
                  }
                >
                  <Text.Label
                    weight='bold'
                    color={
                      hexIsLight(accent) ?
                        Constants.Colors.Text.tertiary :
                        Constants.Colors.Text.alt
                    }
                    align='center' 
                    size={16}
                  >
                    {
                      isInCart ?
                        'Remove from Cart' :
                        'Add to Cart'
                    }
                  </Text.Label>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  ) : null
}

export default ViewItemPage