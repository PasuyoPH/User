import { useFocusEffect } from '@react-navigation/native'
import { Http } from 'app-structs'
import { App, Constants, Items } from 'app-types'
import { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Display, Text } from '../../../components'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

const http = new Http.Client()

const ViewLikedPage = (user: App.UserAppData) => {
  const [items, setItems] = useState<Items.Item[]>()

  const removeFromLike = async (uid: string) => {
    const copyOfItems = [...items]
      .filter(
        (item) => item.uid !== uid
      )

    // send request to remove from like
    await http.request(
      {
        method: 'post',
        url: Constants.Url.Routes.ITEM_LIKE(uid),
        headers: {
          Authorization: user.token
        },
        data: {
          remove: true
        }
      }
    )

    setItems(copyOfItems)
  }

  useFocusEffect(
    useCallback(
      () => {
        const getLikes = async () => {
          const res = await http.request<Items.Item[]>(
            {
              url: Constants.Url.Routes.USER_LIKES,
              method: 'get',
              headers: {
                Authorization: user.token
              }
            }
          )
          
          setItems(res.value ?? [])
        }

        getLikes()
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
          flex: 1
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
          color={Constants.Colors.Text.tertiary}
          weight='bold'
          size={28}
        >
          Hey {user.data.fullName.split(/ +/g)[0]}!
        </Text.Header>

        <Text.Label
          color={Constants.Colors.Text.secondary}
        >
          Here's what you've liked so far.
        </Text.Label>
      </View>

      <View
        style={
          { paddingHorizontal: 32 }
        }
      >
        <Text.Label
          color={Constants.Colors.Text.secondary}
          size={14}
        >
          Double click to remove from this list.
        </Text.Label>
      </View>

      <ScrollView
        contentContainerStyle={
          {
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingVertical: 8
          }
        }
      >
        {
          Array.isArray(items) ? (
            items.length >= 1 ? (
              items.map(
                (item, idx) => (
                  <Display.Button
                    key={idx}
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        width: '30%'
                      }
                    }
                    bg={Constants.Colors.All.whiteSmoke}
                    paddingHorizontal={0}
                    paddingVertical={0}
                    onDoublePress={
                      () => removeFromLike(item.uid)
                    }
                  >
                    <Image
                      style={
                        {
                          width: '100%',
                          height: 190,
                          borderRadius: 10,
                        }
                      }
                      source={
                        { uri: item.image }
                      }
                    />

                    <View
                      style={
                        {
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          width: '100%',
                          height: 190,
                          position: 'absolute',
                          borderRadius: 10
                        }
                      }
                    />

                    <View
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'absolute',
                          width: '100%',
                          height: '100%'
                        }
                      }
                    >
                      <Text.Label
                        color={Constants.Colors.Text.alt}
                        size={28}
                        font='normal'
                        weight='bold'
                      >
                        {item.name}
                      </Text.Label>

                      <Text.Label
                        font='monospace'
                        color={Constants.Colors.All.lightGreen}
                        size={14}
                      >
                        ₱{item.price.toFixed(2)}
                      </Text.Label>
                    </View>
                  </Display.Button>
                )
              )
            ) : (
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }
                }
              >
                <Text.Label
                  color={Constants.Colors.Text.danger}
                  size={14}
                  align='center'
                  style='italic'     
                >
                  Oops! There doesn't seem to be any items you've liked so far.
                </Text.Label>
              </View>
            )
          ) : (
            <ActivityIndicator
              color={Constants.Colors.Text.main}
              size={32}
            />
          )
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default ViewLikedPage