import { View, Pressable, Image, ActivityIndicator } from 'react-native'
import * as Text from '../Text'
import { Constants } from 'app-types'
import UploadSvg from '../../assets/upload.svg'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faUpload } from '@fortawesome/free-solid-svg-icons'
import * as ImagePicker from 'expo-image-picker'
import * as Display from '../Display'
import useStateRef from 'react-usestateref'
import { Http } from 'app-structs'

interface File {
  uri: string
  width: number
  height: number
}

interface UploadImageProps {
  gallery?: boolean
  camera?: boolean
  onUpload?: (url: string, original?: string) => void
  onCancel?: () => void
  token: string
}

const http = new Http.Client()

const UploadImage = (props: UploadImageProps) => {
  const [img, setImg, imgRef] = useStateRef<File>(),
    [isLoading, setIsLoading, isLoadingRef] = useStateRef(false),
    [
      [error, message],
      setResult
    ] = useState([false, ''])

  const onPress = async () => {
      const result = await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            allowsMultipleSelection: false,
            quality: 1.0
          }
        ),
        [chosenFile] = (result.assets ?? [])

      console.log(chosenFile)

      if (result.canceled || !chosenFile) {
        if (typeof props.onCancel === 'function') props.onCancel()
      } else setImg(
        {
          uri: chosenFile.uri,
          width: chosenFile.width,
          height: chosenFile.height
        }
      )
    },
    submit = async () => {
      setResult([false, ''])

      if (isLoadingRef.current) return
      setIsLoading(true)

      const form = new FormData()
      form.append(
        'photo',
        {
          name: `${Date.now().toString()}.jpg`,
          type: 'image/' + img.uri.split('.').pop(),
          uri: img.uri
        } as any
      )

      // upload to server
      const result = await http.request<string>(
        {
          method: 'post',
          url: Constants.Url.Routes.PROFILE,
          data: form,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: props.token
          }
        }
      )

      setResult(
        [
          result.error,
          result.message ?? (
            result.error ?
              'Error: Something happened. Please try again.' :
              'Upload successful.'
          )
        ]
      )

      if (
        !result.error &&
        typeof result.value === 'string' &&
        typeof props.onUpload === 'function'
      )
        props.onUpload(result.value, imgRef.current.uri)  
      
      setIsLoading(false)
    }

  return (
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
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center'
          }
        }
      >
        <UploadSvg
          width={48}
          height={48}
        />

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column'
            }
          }
        >
          <Text.Header
            color={Constants.Colors.Text.tertiary}
            size={18}
            weight='bold'
            font='normal'
          >
            Upload Image
          </Text.Header>

          <Text.Label
            size={14}
            font='normal'
            style='italic'
            color={Constants.Colors.Text.tertiary}
          >
            Upload this image to the cloud.
          </Text.Label>
        </View>
      </View>

      <Pressable
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Constants.Colors.Text.secondary + '80',
            ...(
              img ? (
                {
                  height: img.height / 2,
                  width: '100%'
                }
              ) : { padding: 32 }
            )
          }
        }
        onPress={onPress}
      >
        {
          img ? (
            <Image
              source={
                { uri: img.uri }
              }
              style={
                {
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover'
                }
              }
            />
          ) : (
            <FontAwesomeIcon
              icon={faPlus}
              color={Constants.Colors.Text.alt}
              size={32}
            />
          )
        }
      </Pressable>

      {
        img ? (
          <Display.Button
            inverted={
              { color: Constants.Colors.All.lightBlue }
            }
            icon={faUpload}
            onPress={submit}
          >
            {
              isLoading ? (
                <ActivityIndicator
                  color={Constants.Colors.All.lightBlue}
                  size={24}
                />
              ) : null
            }
          </Display.Button>
        ) : null
      }

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
  )
}

export default UploadImage