import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import { App, Constants, Items, Merchant } from 'app-types'
import { UserAppData } from 'app-types/src/app'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, Pressable, View } from 'react-native'
import { Display, Text } from '../../../components'
import { StatusBar } from 'expo-status-bar'
import { colorIsLight } from '../../../components/Display'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import useStateRef from 'react-usestateref'

const http = new Http.Client()

const ViewItemPage = (props: App.PageProps & UserAppData) => {
  const { uid = '?' } = props.route.params as { uid: string },
    [data, setData] = useState<{ item: Items.Item, merchant: Merchant.MerchantData }>(),
    [accent, setAccent] = useState<string>(Constants.Colors.Layout.main),
    [isInCart, setIsInCart] = useState(false),
    [liked, setLiked, likedRef] = useStateRef(false),
    navigation = useNavigation()

  const likeItem = async () => {
    setLiked(!likedRef.current)

    await http.request<Items.Likes>(
      {
        method: 'post',
        url: Constants.Url.Routes.ITEM_LIKE(uid),
        data: {
          remove: !likedRef.current
        },
        headers: {
          Authorization: props.token
        }
      }
    )
  }

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
          },
          getLikedItem = async () => {
            const res = await http.request<Items.Likes>(
              {
                method: 'get',
                url: Constants.Url.Routes.ITEM_LIKE(uid),
                headers: {
                  Authorization: props.token
                }
              }
            )

            setLiked(!!res.value)
          }

        getLikedItem()
          .catch(console.error)

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
          colorIsLight(accent) ?
            'dark' :
            'light'
        }
      />

      <Pressable
        style={
          {
            flexDirection: 'row',
            position: 'absolute',
            marginVertical: 32,
            zIndex: 2,
            padding: 32
          }
        }
        onPress={
          () => (navigation.navigate as any)('Home')
        }
      >
        <Display.Button
          icon={faAngleLeft}
          bg='transparent'
          text={
            {
              color: colorIsLight(accent) ?
                Constants.Colors.Text.tertiary :
                Constants.Colors.Text.alt
            }
          }
          paddingHorizontal={0}
          paddingVertical={0}
          onPress={
            () => (navigation.navigate as any)('Home')
          }
          iconSize={18}
        />
      </Pressable>

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
              <Text.Header
                weight='bold'
                color={Constants.Colors.Text.tertiary}
                size={24}
              >
                {data.item.name}
              </Text.Header>

              <Display.Button
                icon={
                  liked ?
                    faHeartSolid :
                    faHeart
                }
                bg='transparent'
                paddingHorizontal={0}
                paddingVertical={0}
                text={{ color: Constants.Colors.Text.danger }}
                onPress={likeItem}
              />
            </View>

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

              <Display.Button
                bg={accent}
                text={
                  {
                    content: 'Visit',
                    color: colorIsLight(accent) ?
                      Constants.Colors.Text.tertiary :
                      Constants.Colors.Text.alt,
                    size: 14
                  }
                }
                paddingHorizontal={20}
                paddingVertical={8}
                borderRadius={24}
                onPress={
                  () => (navigation.navigate as any)(
                    'ViewMerchant',
                    { uid: data.merchant.uid }
                  )
                }
              />
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
                    font='Wolf Sans'
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
                <Display.Button
                  onPress={
                    () => {
                      setIsInCart(!isInCart)
                      if (props.cart.has(data.item.uid))
                        props.cart.delete(data.item.uid)
                      else props.cart.set(data.item.uid, { quantity: 1 })
                    }
                  }
                  bg={accent}
                  text={
                    {
                      content: isInCart ?
                        'Remove from Cart' :
                        'Add to Cart',
                      size: 14
                    }
                  }
                  borderRadius={24}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  ) : null
}

export default ViewItemPage