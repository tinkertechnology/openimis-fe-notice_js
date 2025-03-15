// src/components/NoticeCardContent.js
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from "@material-ui/core";
import NotificationImportantIcon from "@material-ui/icons/NotificationImportant";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import PriorityChip from "./PriorityChip";

const styles = (theme) => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    width: "100%",
    minWidth: 0,
    flexGrow: 1,
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
});

class NoticeCardContent extends Component {
  render() {
    const { classes, notice, textSize, textColor } = this.props;

    // Map textSize (0-100) to font sizes and variants
    const getTextStyles = (size) => {
      if (size <= 33) {
        return { title: { variant: "h6", fontSize: "1rem" }, description: { variant: "body2", fontSize: "0.875rem" }, metadata: { variant: "caption", fontSize: "0.75rem" } };
      } else if (size <= 66) {
        return { title: { variant: "h5", fontSize: "1.25rem" }, description: { variant: "h6", fontSize: "1rem" }, metadata: { variant: "body2", fontSize: "0.875rem" } };
      } else {
        return { title: { variant: "h4", fontSize: "1.5rem" }, description: { variant: "h5", fontSize: "1.25rem" }, metadata: { variant: "body1", fontSize: "1rem" } };
      }
    };

    const sizes = getTextStyles(textSize);

    return (
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.title}>
            <NotificationImportantIcon style={{ marginRight: 8, color: textColor || "#000000" }} />
            <Typography
              variant={sizes.title.variant}
              component={sizes.title.variant}
              style={{ color: textColor || "#000000", fontWeight: 500, fontSize: sizes.title.fontSize }}
            >
              {notice.title}
            </Typography>
          </Box>
          <Typography
            variant={sizes.description.variant}
            style={{ color: textColor || "#000000", fontSize: sizes.description.fontSize }}
          >
            {notice.description}
          </Typography>
          <Box className={classes.metadata}>
            <Box display="flex" alignItems="center">
              <LocalHospitalIcon fontSize="small" style={{ marginRight: 8, color: textColor || "#000000" }} />
              <Typography variant={sizes.metadata.variant} style={{ color: textColor || "#616161", fontSize: sizes.metadata.fontSize }}>
                {notice.healthFacility?.name || "No Facility"}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <PriorityHighIcon fontSize="small" style={{ marginRight: 8, color: textColor || "#000000" }} />
              <PriorityChip priority={notice.priority} />
            </Box>
            {notice.attachmentCount > 0 && (
              <Chip
                label={`${notice.attachmentCount} Attachment${notice.attachmentCount > 1 ? "s" : ""}`}
                size="small"
                className={classes.chip}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(NoticeCardContent);