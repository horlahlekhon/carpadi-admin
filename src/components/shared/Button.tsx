import {Button, Tooltip} from '@material-ui/core'
import classes from '../../styles/components/Button.module.css'
import {t} from '../../styles/theme'

const Btn = ({
                 text,
                 width,
                 height = 48,
                 marginTop = null,
                 marginBottom = null,
                 marginLeft = null,
                 marginRight = null,
                 bgColor = t.primaryDarkBlue,
                 color = t.white,
                 borderRadius = '12px',
                 outlined = false,
                 fontSize = '14px',
                 disabled = false,
                 title = '',
                 onClick = () => {
                 }
             }) => {
    return (
        <Tooltip title={disabled ? title : ''} placement='top'>
            <span><Button
                variant={outlined ? 'outlined' : 'contained'}
                className={classes.btn}
                disableElevation
                disabled={disabled}
                style={{
                    display: 'flex',
                    width: width,
                    height: height,
                    marginTop: marginTop,
                    marginBottom: marginBottom,
                    marginLeft: marginLeft,
                    marginRight: marginRight,
                    backgroundColor: `${outlined ? 'transparent' : disabled ? t.liteGrey : bgColor}`,
                    border: `2px solid ${outlined ? (disabled ? t.liteGrey : bgColor) : 'transparent'}`,
                    color: `${outlined ? (disabled ? t.lightGrey : bgColor) : color}`,
                    borderRadius: borderRadius,
                    fontSize: fontSize,
                    cursor: `${disabled ? 'not-allowed' : 'pointer'}`
                }}
                onClick={onClick}
            >
                {text || 'Button'}
            </Button></span>
        </Tooltip>
    )
}

export default Btn
