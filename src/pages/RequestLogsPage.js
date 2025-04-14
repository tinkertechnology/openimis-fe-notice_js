// src/pages/RequestLogsPage.js
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { withModulesManager, withHistory, formatMessage } from "@openimis/fe-core";
import RequestLogSearcher from "../components/RequestLogSearcher";
import { Fab, Tooltip } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import LogFilter from "../components/LogFilter";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

class RequestLogsPage extends Component {
  state = {
    reset: 0,
  };

  refreshLogs = () => {
    this.setState((prevState) => ({
      reset: prevState.reset + 1,
    }));
  };

  render() {
    const { intl, classes } = this.props;
    return (
      <div className={classes.page}>
        <LogFilter />
        <RequestLogSearcher key={this.state.reset} />
        <Tooltip title={formatMessage(intl, "requestLogs", "refreshLogsTooltip")}>
          <div className={classes.fab}>
            <Fab color="primary" onClick={this.refreshLogs}>
              <RefreshIcon />
            </Fab>
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default injectIntl(
  withModulesManager(
    withHistory(
      connect()(withTheme(withStyles(styles)(RequestLogsPage)))
    )
  )
);