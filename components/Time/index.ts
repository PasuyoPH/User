// for time
import moment from 'moment'
require('moment-duration-format')

const secondsToTime = (seconds: number) =>
  (moment.duration(seconds, 'seconds') as any)
    .format(
      'h [hours], m [minutes], s [seconds]'
    )

export { secondsToTime }