import { SafeAreaView } from 'react-native-safe-area-context'
import { Buttons, Form, Text } from '../../../components'
import { Constants, Filters, Items, Merchant } from 'app-types'
import { View, ScrollView, Image, Pressable, ActivityIndicator, BackHandler, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMagnifyingGlass, faNoteSticky, faSliders } from '@fortawesome/free-solid-svg-icons'
import { Display } from '../../../components'
import { UserAppData } from 'app-types/src/app'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Http } from 'app-structs'

const http = new Http.Client()

const HomePage = (user: UserAppData) => {
  const [recommended, setRecommended] = useState<Merchant.MerchantData[]>(),
    [newestItems, setNewestItems] = useState<Items.Item[]>(),
    [filters, setFilters] = useState<Filters.RestaurantFilter[]>(),
    [currentFilter, setCurrentFilter] = useState<number>(0),
    [query, setQuery] = useState(''),
    [isScrolling, setIsScrolling] = useState(false),
    [count, setCount] = useState(0),
    navigation = useNavigation()

  const onBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'No',
          onPress: () => {}
        },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp()
        }
      ],
      { cancelable: false }
    )

    return true
  }

  useFocusEffect(
    useCallback(
      () => {
        // fetch recommended list
        const getRecommendedList = async () => {
            if (!user.token) return

            const res = await http.request<Merchant.MerchantData[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.USER_MERCHANT_RECOMMENDED,
                headers: {
                  Authorization: user.token
                }
              }
            )

            setRecommended(res.value ?? [])
          },
          getNewestItems = async () => {
            if (!user.token) return

            const res = await http.request<Items.Item[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.ITEMS_NEW,
                headers: {
                  Authorization: user.token
                }
              }
            )

            setNewestItems(res.value ?? [])
          },
          getFilters = async () => {
            const res = await http.request<any[]>(
              {
                method: 'get',
                url: Constants.Url.Routes.FILTERS
              }
            )

            setFilters(res.value ?? [])
          },
          getActiveJobs = async () => {
            const res = await http.request<number>(
              {
                method: 'get',
                url: Constants.Url.Routes.USER_ACTIVE_JOBS,
                headers: {
                  Authorization: user.token
                }
              }
            )

            setCount(res.value ?? 0)
          }

        getFilters()
          .catch(console.error)

        getRecommendedList()
          .catch(console.error)

        getNewestItems()
          .catch(console.error)

        getActiveJobs()
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
      >
        { /* Main header */ }
        <Display.Header
          {...user.data}
        />

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingHorizontal: 32,
              gap: 32
            }
          }
        >
          {
            user.cart.size > 0 ? (
              <Display.FloatingCard
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }
                }
                color={Constants.Colors.Text.gold}
              >
                <Text.Label
                  color={Constants.Colors.Text.tertiary}
                >
                  Seems like you have items in your cart.
                </Text.Label>

                <View style={{ flexDirection: 'row' }}>
                  <Display.Button
                    bg={Constants.Colors.Text.tertiary}
                    onPress={
                      () => (navigation.navigate as any)('Checkout')
                    }
                    text={
                      { content: 'Checkout' }
                    }
                  />
                </View>
              </Display.FloatingCard>
            ) : null
          }

          {
            count > 0 ? (
              <Display.FloatingCard
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }
                }
                color={Constants.Colors.Text.green}
              >
                <Text.Label
                  color={Constants.Colors.Text.alt}
                >
                  You currently have active jobs!
                </Text.Label>

                <View style={{ flexDirection: 'row' }}>
                  <Display.Button
                    bg={Constants.Colors.Text.tertiary}
                    onPress={
                      () => (navigation.navigate as any)('Orders')
                    }
                    text={
                      { content: 'View Now' }
                    }
                  />
                </View>
              </Display.FloatingCard>
            ) : null
          }

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }
            }
          >
            <Text.Label color={Constants.Colors.Text.tertiary}>
              What do you want to order today?
            </Text.Label>

            <Form.Input
              placeholderColor={Constants.Colors.All.whiteSmoke}
              placeholder='Search...'
              style={
                {
                  borderTopRightRadius: 100,
                  borderBottomRightRadius: 100,
                  paddingVertical: 12,
                  paddingHorizontal: 0,
                  fontFamily: 'normal',
                  fontWeight: 'bold',
                  fontSize: 14
                }
              }
              leftStyle={
                {
                  borderTopLeftRadius: 100,
                  borderBottomLeftRadius: 100,
                  flexBasis: '15%'
                }
              }
              leftIcon={faMagnifyingGlass}
              inverted={
                { color: Constants.Colors.All.mainDesaturated }
              }
              onSubmit={
                () => {
                  console.log('Submti');
                  (navigation.navigate as any)(
                    'Search',
                    { query }
                  )
                }
              }
              value={query}
              onValue={setQuery}
            />
          </View>
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column'
            }
          }
        >
          { /* filters */ }
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
                  paddingHorizontal: 32,
                  gap: 4
                }
              }
            >
              <FontAwesomeIcon
                icon={faSliders}
                size={16}
                color={Constants.Colors.Text.tertiary}
              />

              <Text.Label
                color={Constants.Colors.Text.tertiary}
              >
                Filters
              </Text.Label>
            </View>

            {
              /*Array.isArray(filters) ? (
                <ScrollView
                  horizontal
                  snapToAlignment='start'
                  snapToInterval={200}
                  decelerationRate={0}
                  contentContainerStyle={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      gap: 8,
                      paddingLeft: 32,
                      paddingVertical: 12
                    }
                  }
                  style={
                    { marginRight: 8 }
                  }
                  showsHorizontalScrollIndicator={false}
                  onScrollBeginDrag={() => setIsScrolling(true)}
                  onScrollEndDrag={() => setIsScrolling(false)}
                >
                  {
                    filters.map(
                      (filter, idx) => (
                        <Buttons.FilterButton
                          filter={filter}
                          index={idx}
                          key={idx}
                          onSelect={() => setCurrentFilter(idx)}
                          selected={idx === currentFilter}
                          disabled={isScrolling}
                        />
                      )
                    )
                  }
                </ScrollView>
              ) : (
                <ActivityIndicator
                  color={Constants.Colors.Text.main}
                  size={32}
                />
              )
            */}

            {/*<View
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  paddingHorizontal: 32,
                  paddingVertical: 12,
                  gap: 12
                }
              }
            >
              {
                Array.isArray(filters) ? (
                  filters.map(
                    (filter, idx) => (
                      <Pressable
                        key={idx}
                        style={
                          {
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 4
                          }
                        }
                        onPress={
                          () => setCurrentFilter(idx)
                        }
                      >
                        <Checkbox
                          style={
                            {
                              width: 16,
                              height: 16
                            }
                          }
                          value={idx === currentFilter}
                        />
  
                        <Text.Label
                          color={Constants.Colors.Text.tertiary}
                        >
                          {filter.name}
                        </Text.Label>
                      </Pressable>
                    )
                  )
                ) : (
                  <ActivityIndicator
                    color={Constants.Colors.Text.main}
                    size={32}
                  />
                )
              }
            </View>*/}

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 16,
                  paddingLeft: 32,
                  paddingVertical: 12,
                }
              }
            >
              {
                Array.isArray(filters) ? (
                  filters.map(
                    (filter, idx) => (
                      <Pressable
                        key={idx}
                        onPress={
                          () => (navigation.navigate as any)(
                            'MerchantTypeFilter',
                            {
                              name: filter.name,
                              type: filter.type
                            }
                          )
                        }
                      >
                        <Display.FloatingCard
                          color={Constants.Colors.Text.alt}
                          style={
                            {
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 8,
                              height: 96
                            }
                          }
                        >
                          <FontAwesomeIcon
                            icon={filter.icon ?? 'question'}
                            color={Constants.Colors.All.mainDesaturated}
                            size={32}
                          />

                          <View
                            style={{ maxWidth: 64 }}
                          >
                            <Text.Label
                              color={Constants.Colors.Text.secondary}
                              align='center'
                            >
                              {filter.name}
                            </Text.Label>
                          </View>
                        </Display.FloatingCard>
                      </Pressable>
                    )
                  )
                ) : null
              }
            </View>
          </View>
          
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 32
              }
            }
          >
            { /* Recommended */ }
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingHorizontal: 32,
                  gap: 8
                }
              }
            >
              <Text.Header
                weight='bold'
                color={Constants.Colors.Text.tertiary}
                size={28}
              >
                Recommended
              </Text.Header>

              <ScrollView
                contentContainerStyle={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8
                  }
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={256 + 8}
                decelerationRate={0}
                snapToStart
              >
                {
                  (
                    () => {
                      const elements = (recommended ?? []).reduce(
                        (accumulator, item, idx) => {
                          if (
                            currentFilter !== Filters.RestaurantFilterTypes.ALL &&
                            !(item.types ?? []).includes(currentFilter)
                          ) return accumulator

                          accumulator.push(
                            currentFilter !== Filters.RestaurantFilterTypes.ALL &&
                              !(item.types ?? []).includes(currentFilter) ?
                                null : (
                                  <Pressable
                                    key={idx}
                                    style={
                                      {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: 256,
                                        gap: 8
                                      }
                                    }
                                    onPress={
                                      () => (navigation.navigate as any)(
                                        'ViewMerchant',
                                        { uid: item.uid }
                                      )
                                    }
                                  >
                                    <Image
                                      source={
                                        { uri: item.banner ?? '' }
                                      }
                                      style={
                                        {
                                          width: 256,
                                          height: 128,
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
                                      <View
                                        style={
                                          {
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: 4
                                          }
                                        }
                                      >
                                        <Text.Header
                                          font='Roboto Condensed Bold'
                                          color={Constants.Colors.Text.tertiary}
                                          size={18}
                                        >
                                          {item.name}
                                        </Text.Header>
                
                                        <Text.Label
                                          size={14}
                                          color={Constants.Colors.Text.secondary}
                                        >
                                          - {
                                            '₱'.repeat(
                                              (item.priceLevels ?? 0) + 1
                                            )
                                          }
                                        </Text.Label>
                
                                        {
                                          (item.tags ?? []).map(
                                            (text, idx2) => (
                                              <Display.Tag
                                                key={idx2}
                                                text={text}
                                              />
                                            )
                                          )
                                        }
                                      </View>
                
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
                                        <FontAwesomeIcon
                                          icon={faNoteSticky}
                                          color={Constants.Colors.Text.secondary}
                                        />
                
                                        <Text.Label
                                          color={Constants.Colors.Text.secondary}
                                        >
                                          {
                                            item.bio ?
                                              item.bio.substring(0, 20) + '...' :
                                              'No bio provided.'
                                          }
                                        </Text.Label>
                                      </View>
                                    </View>
                                  </Pressable>
                                )
                          )
                          return accumulator
                        },
                        []
                      )

                      return elements.length < 1 ? (
                        <Text.Label
                          color={Constants.Colors.Text.secondary}
                          size={14}
                          font='normal'
                          style='italic'
                        >
                          Sorry, we don't have anything to recommend.
                        </Text.Label>
                      ) : elements
                    }
                  )()
                }
              </ScrollView>
            </View>

            { /* Recently Added */ }
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingHorizontal: 32,
                  gap: 8
                }
              }
            >
              <Text.Header
                weight='bold'
                color={Constants.Colors.Text.tertiary}
                size={28}
              >
                What's New?
              </Text.Header>

              <ScrollView
                contentContainerStyle={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8
                  }
                }
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToAlignment='start'
                snapToInterval={200}
                decelerationRate={0}
              >
                {
                  (newestItems ?? []).map(
                    (item, idx) => (
                      <View
                        style={
                          { borderRadius: 10, overflow: 'hidden' }
                        }
                        key={idx}
                      >
                        <Pressable
                          style={
                            {
                              display: 'flex',
                              flexDirection: 'column',
                              maxWidth: 256,
                              gap: 4  
                            }
                          }
                          android_ripple={
                            { color: 'lightgrey' }
                          }
                          onPress={
                            () => (navigation.navigate as any)(
                              'ViewItem',
                              { uid: item.uid }
                            )
                          }
                        >
                          <Image
                            source={
                              { uri: item.banner ?? '' }
                            }
                            style={
                              {
                                width: 256,
                                height: 128,
                                borderRadius: 10
                              }
                            }
                          />

                          <View
                            style={
                              {
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 4
                              }
                            }
                          >
                            <View
                              style={
                                {
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 8
                                }
                              }
                            >
                              <View
                                style={{ flexBasis: '75%' }}
                              >
                                <Text.Label
                                  color={Constants.Colors.Text.tertiary}
                                  font='Roboto Condensed Bold'
                                  size={18}
                                >
                                  {item.name}
                                </Text.Label>
                              </View>

                              <View
                                style={{ flexBasis: '25%' }}
                              >
                                <Text.Label
                                  color={Constants.Colors.Text.green}
                                  style='italic'
                                  size={14}
                                >
                                  ₱{item.price.toFixed(2)}
                                </Text.Label>
                              </View>
                            </View>

                            <Text.Label
                              color={Constants.Colors.Text.secondary}
                              font='Roboto Condensed Italic'
                              size={18}
                            >
                              Added at: {new Date(Date.now()).toDateString()}
                            </Text.Label>
                          </View>
                        </Pressable>
                      </View>
                    )
                  )
                }
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomePage