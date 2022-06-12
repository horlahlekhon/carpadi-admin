import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/styles'
import { t } from '../../styles/theme'

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 48,
    height: 24,
    padding: 0,
    display: 'flex',
    backgroundColor: t.liteGrey,
    borderRadius: 17
  },
  switchBase: {
    padding: 2,
    color: t.white,
    '&$checked': {
      transform: 'translateX(21px)',
      color: t.primaryDeepBlue,
      '& + $track': {
        opacity: 1,
        background: t.primaryLite
      }
    }
  },
  thumb: {
    width: 20,
    height: 20,
    boxShadow: 'none',
    marginLeft: 1,
    position: 'absolute'
  },
  track: {
    border: 'none',
    borderRadius: 2,
    opacity: 1,
    backgroundColor: t.white,
    width: '100%',
    position: 'absolute'
  },
  checked: {}
}))(Switch)

export default StyledSwitch
