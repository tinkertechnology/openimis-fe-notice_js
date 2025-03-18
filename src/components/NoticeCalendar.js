// src/components/NoticeCalendar.js
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";

const styles = (theme) => ({
  calendarBox: {
    width: 80, // Increased width to accommodate year
    height: 80, // Increased height for better spacing
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.grey[50],
    marginRight: theme.spacing(4), // Keeps the 30px+ gap
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
  calendarYear: {
    fontSize: "1rem", // Slightly smaller than day but still prominent
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
});

const NoticeCalendar = ({ classes, createdAt }) => {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return (
    <Box className={classes.calendarBox}>
      <Typography className={classes.calendarDay}>{day}</Typography>
      <Typography className={classes.calendarMonth}>{month}</Typography>
      <Typography className={classes.calendarYear}>{year}</Typography>
    </Box>
  );
};

export default withStyles(styles)(NoticeCalendar);