import { Image, View } from 'react-native'
import { Account, Constants, Deliveries } from 'app-types'
import { Button, Divider } from '../Display'
import * as Text from '../Text'

interface DeliveryCardProps {
  delivery: Deliveries.Data
  rider: Account.RiderAccountData
}

const DeliveryCard = (props: DeliveryCardProps) => {
  return (
    <Button
      bg={Constants.Colors.All.whiteSmoke}
      style={
        { elevation: 4 }
      }
      paddingHorizontal={0}
      paddingVertical={0}
    >
      <View
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 256 + 32
          }
        }
      >
        { /* id of delivery? */ }
        <View
          style={
            {
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: Constants.Colors.All.main,
              width: '100%'
            }
          }
        >
          <Text.Label
            color={Constants.Colors.Text.alt}
            align='center'
            size={10}
          >
            # {props.delivery.uid}
          </Text.Label>
        </View>

        { /* header */ }
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
              { position: 'relative' }
            }
          >
            <Image
              style={
                {
                  width: '100%',
                  height: 128
                }
              }
              source={
                { uri: 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' }
              }
            />

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  width: '100%',
                  height: 128,
                  position: 'absolute',
                  padding: 8
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.alt}
                size={20}
              >
                {props.delivery.name}
              </Text.Label>
            </View>
          </View>
        </View>

        <View
          style={
            {
              display: 'flex',
              flexDirection: 'column',
              paddingVertical: 8,
              paddingHorizontal: 16,
              gap: 12
            }
          }
        >
          { /* rider */ }
          <View
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }
            }
          >
            <Text.Label
              size={12}
              color={Constants.Colors.Text.secondary}
              font='normal'
              weight='bold'
            >
              COURIER
            </Text.Label>

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
                  { uri: 'https://scontent.fmnl8-3.fna.fbcdn.net/v/t39.30808-6/322113042_513339527267490_2630672777140286584_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeFiDSKfujbnrZc5hkj-9TuxPaFvLbhzZq09oW8tuHNmreiVqOBaNvtPKm8TzYDZoiuKz86RhfjaaUo3FTJP-j2r&_nc_ohc=y96BBpUC-PwAX-VoXl5&_nc_ht=scontent.fmnl8-3.fna&oh=00_AfAZgFAGFT89KQIrskQJGS5Tzp38ko_KslehTT4k_nQDZQ&oe=64F43E95' }
                }
                style={
                  {
                    width: 48,
                    height: 48,
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
                  font='normal'
                >
                  Alexander Montoya
                </Text.Label>

                <Text.Label
                  style='italic'
                  font='normal'
                  color={Constants.Colors.Text.secondary}
                  size={12}
                >
                  +639456282634
                </Text.Label>
              </View>
            </View>
          </View>

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 16
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
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                WEIGHT
              </Text.Label>

              <Text.Label
                size={20}
                font='monospace'
              >
                {props.delivery.weight?.toString()}kg
              </Text.Label>
            </View>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                ARRIVAL TIME
              </Text.Label>

              <Text.Label
                size={20}
                font='monospace'
              >
                12:59pm
              </Text.Label>
            </View>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                DISTANCE
              </Text.Label>

              <Text.Label
                size={20}
                font='monospace'
              >
                {props.delivery.distance.toString()}km
              </Text.Label>
            </View>
          </View>

          <Divider
            color={Constants.Colors.Text.secondary + '40'}
            width={.3}
          />

          <View
            style={
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 16
              }
            }
          >
            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                FROM
              </Text.Label>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                  }
                }
              >
                <Text.Label
                  size={14}
                  color={Constants.Colors.Text.tertiary}
                >
                  Lot 19, Blk 6 Casoy St.
                </Text.Label>
              </View>
            </View>

            <View
              style={
                {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }
              }
            >
              <Text.Label
                color={Constants.Colors.Text.secondary}
                size={12}
                font='normal'
                weight='bold'
              >
                TO
              </Text.Label>

              <View
                style={
                  {
                    display: 'flex',
                    flexDirection: 'row'
                  }
                }
              >
                <Text.Label
                  size={14}
                  color={Constants.Colors.Text.tertiary}
                >
                  Lot 19, Blk 6 Casoy St.
                </Text.Label>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Button>
  )
}

export default DeliveryCard