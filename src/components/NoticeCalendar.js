// src/components/NoticeCalendar.js
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";

const styles = (theme) => ({
  calendarBox: {
    width: 60,
    height: 60,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.grey[50],
    marginRight: theme.spacing(4), // Increased to ensure 30px+ gap
    flexShrink: 0,
  },
  calendarDay: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  calendarMonth: {
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
  },
});

const NoticeCalendar = ({ classes, createdAt }) => {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  return (
    <Box className={classes.calendarBox}>
      <Typography className={classes.calendarDay}>{day}</Typography>
      <Typography className={classes.calendarMonth}>{month}</Typography>
    </Box>
  );
};

export default withStyles(styles)(NoticeCalendar);