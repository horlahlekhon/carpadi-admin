import { Button } from '@material-ui/core'
import classes from '../../styles/components/Button.module.css'
import { t } from '../../styles/theme'

const Btn = ({
  text,
  width,
  marginTop,
  bgColor = t.primaryDarkBlue,
  color = t.white
}) => {
  return (
    <Button
      variant="contained"
      className={classes.btn}
      disableElevation
      style={{
        width: width,
        marginTop: marginTop,
        backgroundColor: bgColor,
        color
      }}
    >
      {text || 'Button'}
    </Button>
  )
}

export default Btn
