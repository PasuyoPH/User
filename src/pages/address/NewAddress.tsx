import { Region } from 'react-native-maps'
import { Animated, Easing, Image, Pressable, View, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import MarkerSvg from '../../../assets/marker.svg'
import { useState } from 'react'
import { Display, Form, Text } from '../../../components'
import { faCheck, faCity, faPenToSquare, faSave, faUser } from '@fortawesome/free-solid-svg-icons'
import { Address, App, Constants } from 'app-types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { Http } from 'app-structs'
import useStateRef from 'react-usestateref'
import { useNavigation } from '@react-navigation/native'
import Checkbox from 'expo-checkbox'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable),
  http = new Http.Client()

interface AddressForm {
  text?: string
  template?: string
  landmark?: string
  contactPhone?: string
  contactName?: string
  useUserData?: boolean
}

const NewAddressPage = (user: App.UserAppData) => {
  const scaleValue = new Animated.Value(1),
    [_, setLocation, locationRef] = useStateRef<Region>(null),
    [modalShown, setModalShown] = useState(false),
    [mapLoaded, setMapLoaded] = useState(false),
    [form, setForm, formRef] = useStateRef<AddressForm>({}),
    [
      [error, message],
      setResult
    ] = useState([false, '']),
    navigation = useNavigation()

  const reverseLocationGeocode = async () => {
      if (formRef.current.text) return
      const result = await http.request<string>(
        {
          url: Constants.Url.Routes.GEOCODE,
          method: 'post',
          data: {
            lat: locationRef.current.latitude,
            long: locationRef.current.longitude
          },
          headers: {
            Authorization: user.token
          }
        }
      )
      
      setForm(
        (currentForm) => (
          { ...currentForm, text: result.value ?? '' }
        )
      )
    },
    saveAddress = async (data: AddressForm) => {
      const result = await http.request<Address.AddressData>(
        {
          url: Constants.Url.Routes.ADDRESSES,
          method: 'post',
          headers: { Authorization: user.token },
          data: {
            address: {
              ...data,
              latitude: locationRef.current.latitude,
              longitude: locationRef.current.longitude
            }
          }
        }
      )

      if (result.error)
        setResult(
          [
            result.error,
            result.message
          ]
        )
      else {
        setResult(
          [
            false,
            'Address successfully saved.'
          ]
        )

        navigation.goBack()
      }
    }

  return (
    <>
      <Display.Modal
        onDismiss={
          () => {
            setResult([false, ''])
            setModalShown(false)
            setForm({})
          }
        }
        show={modalShown}
        container={
          {
            style: {
              margin: 32
            }
          }
        }
      >
        {
          form.text ? (
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }
              }
            >
              { /* Address provided */ }
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
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    color={Constants.Colors.Text.tertiary}
                  />

                  <Text.Label
                    font='normal'
                    weight='bold'
                    size={18}
                    color={Constants.Colors.Text.tertiary}
                  >
                    Address
                  </Text.Label>
                </View>

                <Text.Label
                  size={12}
                  color={Constants.Colors.Text.secondary}
                >
                  {form.text}
                </Text.Label>
              </View>

              { /* Landmark */ }
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
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
                    <FontAwesomeIcon
                      icon={faCity}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Text.Label
                      font='normal'
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                    >
                      Landmark
                    </Text.Label>
                  </View>

                  <Text.Label
                    size={12}
                    color={Constants.Colors.Text.secondary}
                  >
                    Decide a landmark for the address.
                  </Text.Label>
                </View>

                <Form.Input
                  fontSize={12}
                  placeholder='Optional'
                  value={form.landmark}
                  onValue={
                    (value: string) => setForm(
                      (currentForm) => (
                        { ...currentForm, landmark: value ?? '' }
                      )
                    )
                  }
                />
              </View>

              { /* Contact */ }
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
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
                    <FontAwesomeIcon
                      icon={faUser}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Text.Label
                      font='normal'
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                    >
                      Contact
                    </Text.Label>
                  </View>

                  <Text.Label
                    size={12}
                    color={Constants.Colors.Text.secondary}
                  >
                    Set the person to contact when rider arrives at the location.
                  </Text.Label>
                </View>

                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 4
                    }
                  }
                >
                  <Form.Input
                    fontSize={12}
                    placeholder='Contact Name'
                    value={form.contactName}
                    onValue={
                      (value) => setForm(
                        (currentForm) => (
                          { ...currentForm, contactName: value ?? '' }
                        )
                      )
                    }
                    containerStyle={
                      { flex: 1 }
                    }
                  />

                  <Form.Input
                    fontSize={12}
                    placeholder='Contact Phone'
                    value={form.contactPhone}
                    onValue={
                      (value) => setForm(
                        (currentForm) => (
                          { ...currentForm, contactPhone: value ?? '' }
                        )
                      )
                    }
                    containerStyle={
                      { flex: 1 }
                    }
                    numberOnly
                  />
                </View>
                
                <View
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      width: '80%'
                    }
                  }
                >
                  <Checkbox
                    value={form.useUserData}
                    onValueChange={
                      (value) => setForm(
                        (currentForm) => (
                          { ...currentForm, useUserData: value }
                        )
                      )
                    }
                    color={Constants.Colors.All.main}
                  />

                  <Text.Label
                    color={Constants.Colors.Text.secondary}
                    size={12}
                  >
                    Use the same information as my account
                  </Text.Label>
                </View>
              </View>

              <Display.Divider
                color={Constants.Colors.Text.secondary + '33'}
                width={.3}
              />

              { /* Save As */ }
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
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
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      color={Constants.Colors.Text.tertiary}
                    />

                    <Text.Label
                      font='normal'
                      weight='bold'
                      size={18}
                      color={Constants.Colors.Text.tertiary}
                    >
                      Save As
                    </Text.Label>
                  </View>

                  <Text.Label
                    size={12}
                    color={Constants.Colors.Text.secondary}
                  >
                    Choose a name to save your address as.
                  </Text.Label>
                </View>

                <Form.Input
                  fontSize={12}
                  placeholder='Name Here'
                  value={form.template}
                    onValue={
                      (value) => setForm(
                        (currentForm) => (
                          { ...currentForm, template: value ?? '' }
                        )
                      )
                    }
                />
              </View>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }
                }
              >
                <Display.Button
                  inverted={
                    { color: Constants.Colors.Text.green }
                  }
                  text={
                    { content: 'Save' }
                  }
                  icon={faSave}
                  onPress={
                    () => {
                      console.log('Addr:', form.text)
                      console.log('Landmark:', form.landmark)
                      console.log('Name:', form.template)
                      setResult([false, ''])

                      // todo: send request to backend
                      saveAddress(form)
                    }
                  }
                />

                {
                  message ? (
                    <Text.Label
                      color={
                        error ?
                          Constants.Colors.Text.danger :
                          Constants.Colors.Text.green
                      }
                      align='center'
                      size={14}
                    >
                      {message}
                    </Text.Label>
                  ) : null
                }
              </View>
            </View>
          ) : (
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
              <ActivityIndicator
                color={Constants.Colors.All.main}
                size={32}
              />

              <Text.Label
                color={Constants.Colors.Text.tertiary}
                size={14}
              >
                Fetching address information...
              </Text.Label>
            </View>
          )
        }
      </Display.Modal>

      <KeyboardAvoidingView
        contentContainerStyle={
          { position: 'relative' }
        }
        behavior='height'
        enabled={false}
      >
        <Display.Map
          askForLocation
          onTouchStart={
            () => Animated.timing(
              scaleValue,
              {
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true,
                toValue: 1.1
              }
            ).start()
          }
          onTouchEnd={
            () => Animated.timing(
              scaleValue,
              {
                duration: 100,
                easing: Easing.ease,
                useNativeDriver: true,
                toValue: 1
              }
            ).start()
          }
          onRegionChangeComplete={
            (region: Region) => setLocation(region)
          }
          onMapReady={
            () => setMapLoaded(true)
          }
          header={
            {
              onBack: () => navigation.goBack(),
              onSearch: (address) => setForm(
                (currentForm) => (
                  { ...currentForm, text: address }
                )
              )
            }
          }
        />

        {
          mapLoaded ? (
            <>
              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'transparent'
                  }
                }
                pointerEvents='none'
              >
                <AnimatedPressable
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: [
                        { scale: scaleValue }
                      ]
                    }
                  }
                >
                  <MarkerSvg
                    width={32}
                    height={32}
                    style={{ position: 'absolute' }}
                  />

                  <Image
                    source={require('../../../assets/marker_pasuyo.png')}
                    style={
                      { width: 32, height: 32, position: 'absolute', resizeMode: 'contain' }
                    }
                  />
                </AnimatedPressable>
              </View>

              <View
                style={
                  {
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    padding: 32
                  }
                }
              >
                <Display.Button
                  bg={Constants.Colors.All.lightBlue}
                  text={
                    {
                      content: 'Confirm',
                      reverse: true
                    }
                  }
                  icon={faCheck}
                  onPress={
                    () => {
                      reverseLocationGeocode()
                      setModalShown(true)
                    }
                  }
                />
              </View>
            </>
          ) : null
        }
      </KeyboardAvoidingView>
    </>
  )
}

export default NewAddressPage