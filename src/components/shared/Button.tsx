import { Button } from '@material-ui/core'
import classes from '../../styles/components/Button.module.css'
import { t } from '../../styles/theme'

const Btn = ({
  text,
  width,
  marginTop = null,
  marginBottom = null,
  marginLeft = null,
  marginRight = null,
  bgColor = t.primaryDarkBlue,
  color = t.white,
  borderRadius = '12px',
  outlined = false
}) => {
  return (
    <Button
      variant={outlined ? 'outlined' : 'contained'}
      className={classes.btn}
      disableElevation
      style={{
        width: width,
        marginTop: marginTop,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        marginRight: marginRight,
        backgroundColor: `${outlined ? 'transparent' : bgColor}`,
        border: `2px solid ${outlined ? bgColor : 'transparent'}`,
        color: `${outlined ? bgColor : color}`,
        borderRadius: borderRadius
      }}
    >
      {text || 'Button'}
    </Button>
  )
}

export default Btn
