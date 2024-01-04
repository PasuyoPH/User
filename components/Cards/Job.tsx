import { Constants, Deliveries, Orders } from 'app-types'
import { Pressable, View } from 'react-native'
import * as Text from '../Text'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBoxOpen, faBurger } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'

type Jobs = Deliveries.Data | Orders.Order

const JobDisplayData = [
  {
    name: 'Delivery',
    icon: faBoxOpen,
    color: Constants.Colors.All.main
  },

  {
    name: 'Order',
    icon: faBurger,
    color: Constants.Colors.All.brown
  }
]

interface JobCardProps {
  data: Jobs
  onPress?: () => void
}

const JobCard = (props: JobCardProps) => {
  const navigation = useNavigation()

  return (
    <Pressable
      style={
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Constants.Colors.Text.alt,
          paddingHorizontal: 16,
          paddingVertical: 16,
          elevation: 4,
          gap: 8,
          borderRadius: 10
        }
      }
      onPress={
        () => (navigation.navigate as any)('ViewJob', { uid: props.data.uid, type: props.data.type })
      }
    >
      <FontAwesomeIcon
        size={32}
        icon={JobDisplayData[props.data?.type]?.icon}
        color={JobDisplayData[props.data?.type]?.color}
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
          size={16}
        >
          {JobDisplayData[props.data?.type]?.name}
        </Text.Label>

        <Text.Label
          color={Constants.Colors.Text.green}
          font='monospace'
          size={14}
        >
          {props.data?.distance?.toFixed(2) ?? '0'} km
        </Text.Label>
      </View>
    </Pressable>
  )
}

export default JobCard