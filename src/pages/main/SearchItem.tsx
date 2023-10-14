import { App, Constants, Items } from 'app-types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, View } from 'react-native'
import { Display, Form, Text } from '../../../components'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'
import useStateRef from 'react-usestateref'

const http = new Http.Client(),
  dimensions = Dimensions.get('window'),
  imageHeight = Math.round(dimensions.width * 6 / 16)

const SearchItemPage = (props: App.UserAppData & App.PageProps) => {
  const [items, setItems] = useState<Items.Item[]>(),
    [modalShown, setModalShown] = useState(false),
    [query, setQuery, queryRef] = useStateRef(
      (props.route.params as { query: string })
        .query
    ),
    [queryCopy, setQueryCopy] = useState(query),
    navigation = useNavigation()

  const getSearchResults = async () => {
    setItems(undefined)

    const result = await http.request<Items.Item[]>(
      {
        method: 'get',
        url: Constants.Url.Routes.MERCHANT_SEARCH(queryRef.current),
        headers: {
          Authorization: props.token
        }
      }
    )

    setQueryCopy(queryRef.current)
    setItems(result.value)
  }

  useFocusEffect(
    useCallback(
      () => {
        getSearchResults()
          .catch(console.error)
      },
      []
    )
  )

  return (
    <>
      <Display.Modal
        show={modalShown}
        onDismiss={() => setModalShown(false)}
        container={
          {
            style: {
              backgroundColor: 'transparent',
              top: 0,
              position: 'absolute',
              paddingVertical: 32
            }
          }
        }
      >
        <Form.Input
          value={query}
          onValue={setQuery}
          onSubmit={
            () => {
              getSearchResults()
                .catch(console.error)

              setModalShown(false)
            }
          }
        />
      </Display.Modal>

      <SafeAreaView
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flex: 1
          }
        }
      >
        <View
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8
            }
          }
        >
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '80%',
                paddingHorizontal: 16
              }
            }
          >
            <Text.Header
              weight='bold'
              size={20}
              color={Constants.Colors.Text.tertiary}
            >
              Showing results for:
            </Text.Header>

            <Text.Label
              color={Constants.Colors.Text.secondary}
              size={14}
            >
              {queryCopy}
            </Text.Label>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                flexBasis: '20%'
              }
            }
          >
            <Display.Button
              icon={faSearch}
              bg='transparent'
              text={
                { color: Constants.Colors.Text.tertiary }
              }
              onPress={() => setModalShown(true)}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={
            {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              gap: 8
            }
          }
          style={
            { margin: 16 }
          }
          showsVerticalScrollIndicator={false}
        >
          {
            Array.isArray(items) && items.length >= 1 ? (
              items.map(
                (item, idx) => (
                  <Pressable
                    key={idx}
                    style={
                      {
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }
                    }
                    onPress={
                      () => (navigation.navigate as any)(
                        'ViewItem',
                        { uid: item.uid }
                      )
                    }
                  >
                    <Image
                      style={
                        {
                          width: '100%',
                          height: imageHeight,
                          borderRadius: 10
                        }
                      }
                      source={
                        { uri: item.banner }
                      }
                    />

                    <View
                      style={
                        {
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          width: '100%',
                          height: imageHeight,
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
                  </Pressable>
                )
              )
            ) : (
              items ? (
                <Text.Label
                  color={Constants.Colors.Text.secondary}
                  style='italic'
                >
                  Can't find any items that match.
                </Text.Label>
              ) : (
                <ActivityIndicator
                  color={Constants.Colors.All.main}
                  size={32}
                />
              )
            )
          }
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default SearchItemPage