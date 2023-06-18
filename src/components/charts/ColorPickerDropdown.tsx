import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@material-ui/core'
import { ColorLens } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
    width: 'fit-content'
  },
  colorIcon: {
    color: '#000'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px'
  },
  menuX: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    height: '300px',
    overflowY: 'auto',
    '& ul': {
      display: 'flex',
      flexDirection: 'column'
    }
  }
}))

const popularColors = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#808080' },
  { label: 'Silver', value: '#C0C0C0' },
  { label: 'Red', value: '#FF0000' },
  { label: 'Blue', value: '#0000FF' },
  { label: 'Brown', value: '#964B00' },
  { label: 'Green', value: '#008000' },
  { label: 'Beige', value: '#F5F5DC' },
  { label: 'Yellow', value: '#FFFF00' },
  { label: 'Gold', value: '#FFD700' },
  { label: 'Orange', value: '#FFA500' },
  { label: 'Tan', value: '#D2B48C' },
  { label: 'Burgundy', value: '#800020' },
  { label: 'Purple', value: '#800080' }
]

const ColorPickerDropdown = ({ value, onChange }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleColorPickerOpen = () => {
    setShowColorPicker(true)
    handleMenuClose()
  }

  const handleColorPickerClose = () => {
    setShowColorPicker(false)
  }

  const handleColorChange = (color) => {
    onChange(color)
    handleMenuClose()
  }

  return (
    <>
      <IconButton
        className={classes.button}
        onClick={handleMenuOpen}
        aria-controls="color-menu"
        aria-haspopup="true"
      >
        <ColorLens className={classes.colorIcon} />
      </IconButton>
      <Menu
        id="color-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        classes={{ paper: classes.menuX }}
        onClose={handleMenuClose}
        className="custom-menu-list"
      >
        {popularColors.map((color) => (
          <MenuItem
            key={color.value}
            className={classes.menuItem}
            onClick={() => handleColorChange(color.value)}
          >
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: color.value,
                marginRight: 10,
                border: '1px solid black'
              }}
            />
            <ListItemText primary={color.label} />
          </MenuItem>
        ))}
        <MenuItem onClick={handleColorPickerOpen} style={{ marginTop: '4px' }}>
          <ListItemIcon>
            <ColorLens />
          </ListItemIcon>
          <input
            type="color"
            onChange={(e) => handleColorChange(e.target.value)}
            name=""
            id=""
          />
        </MenuItem>
      </Menu>
    </>
  )
}

export default ColorPickerDropdown
