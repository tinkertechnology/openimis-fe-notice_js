// src/components/TextColorControl.js
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Typography } from "@material-ui/core";

const styles = (theme) => ({
  colorPickerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  colorPickerLabel: {
    fontSize: "0.75rem", // Smaller font (12px)
    color: theme.palette.text.secondary,
  },
  colorPicker: {
    width: 30, // Smaller size
    height: 30,
    padding: 0,
    "& .MuiInputBase-input": {
      padding: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer",
      borderRadius: 4, // Rounded corners
    },
  },
});

class TextColorControl extends Component {
  render() {
    const { classes, textColor, onTextColorChange } = this.props;

    return (
      <div className={classes.colorPickerContainer}>
        <Typography className={classes.colorPickerLabel}>Text Color</Typography>
        <TextField
          type="color"
          value={textColor}
          onChange={onTextColorChange}
          className={classes.colorPicker}
          variant="outlined"
          InputProps={{ style: { padding: 0 } }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TextColorControl);