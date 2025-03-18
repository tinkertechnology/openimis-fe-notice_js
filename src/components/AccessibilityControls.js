// src/components/AccessibilityControls.js
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import TextSizeControl from "./TextSizeControl";
import TextColorControl from "./TextColorControl";

const styles = (theme) => ({
  accessibilityControls: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1), // Smaller gap for compactness
  },
});

class AccessibilityControls extends Component {
  render() {
    const { classes, textSize, textColor, onTextSizeChange, onTextColorChange } = this.props;

    return (
      <Box className={classes.accessibilityControls}>
        <TextSizeControl textSize={textSize} onTextSizeChange={onTextSizeChange} />
        <TextColorControl textColor={textColor} onTextColorChange={onTextColorChange} />
      </Box>
    );
  }
}

export default withStyles(styles)(AccessibilityControls);