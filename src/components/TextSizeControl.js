// src/components/TextSizeControl.js
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Slider, Typography } from "@material-ui/core";

const styles = (theme) => ({
  sliderContainer: {
    width: 100, // Smaller, fixed width
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: "0.75rem", // Smaller font (12px)
    color: theme.palette.text.secondary,
  },
  slider: {
    height: 4, // Thinner slider
    "& .MuiSlider-thumb": {
      width: 12, // Smaller thumb
      height: 12,
    },
    "& .MuiSlider-rail": {
      height: 2, // Thinner rail
    },
    "& .MuiSlider-track": {
      height: 2, // Thinner track
    },
  },
});

class TextSizeControl extends Component {
  render() {
    const { classes, textSize, onTextSizeChange } = this.props;

    return (
      <div className={classes.sliderContainer}>
        <Typography className={classes.sliderLabel}>Text Size</Typography>
        <Slider
          value={textSize}
          onChange={onTextSizeChange}
          min={0}
          max={100}
          step={1}
          className={classes.slider}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TextSizeControl);