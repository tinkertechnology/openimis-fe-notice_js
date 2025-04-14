// src/components/LogFilter.js
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import debounce from "lodash/debounce"; // Correct import
import { injectIntl } from "react-intl";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
  formatMessage,
  withModulesManager,
  ControlledField,
  PublishedComponent,
} from "@openimis/fe-core";

const LOG_FILTER_CONTRIBUTION_KEY = "requestLog.Filter";

const styles = (theme) => ({
  form: {
    padding: 0,
  },
  item: {
    padding: theme.spacing(1),
  },
});

class LogFilter extends Component {
  constructor(props) {
    super(props);
    this.debouncedOnChangeFilter = debounce(
      this.props.onChangeFilters,
      this.props.modulesManager.getConf("fe-requestLog", "debounceTime", 200)
    );
  }

  _filterValue = (k) => {
    const { filters } = this.props;
    return !!filters[k] ? filters[k].value : null;
  };

  _timeRangeFilter = (from, to) => {
    const filters = [];
    if (from) {
      filters.push({
        id: "timestampFrom",
        value: from,
        filter: `timestamp_Gte: "${from}"`,
      });
    }
    if (to) {
      filters.push({
        id: "timestampTo",
        value: to,
        filter: `timestamp_Lte: "${to}"`,
      });
    }
    return filters;
  };

  _durationFilter = (type, checked) => {
    if (!checked) return { id: type, value: null, filter: null };
    
    let filter;
    switch (type) {
      case "high":
        filter = `durationMs_Gte: 10000`; // > 10 seconds
        break;
      case "low":
        filter = `durationMs_Lte: 5000`; // < 5 seconds
        break;
      case "medium":
        filter = `durationMs_Gt: 5000 durationMs_Lt: 10000`; // 5-10 seconds
        break;
      default:
        filter = null;
    }
    return { id: type, value: checked, filter };
  };

  _onChangeTimeRange = (key, value) => {
    const currentFilters = this.props.filters;
    const from = key === "timestampFrom" ? value : this._filterValue("timestampFrom");
    const to = key === "timestampTo" ? value : this._filterValue("timestampTo");
    this.props.onChangeFilters(this._timeRangeFilter(from, to));
  };

  _onChangeDuration = (type, checked) => {
    this.debouncedOnChangeFilter([this._durationFilter(type, checked)]);
  };

  render() {
    const { intl, classes, filters, onChangeFilters } = this.props;

    return (
      <Grid container className={classes.form}>
        {/* Timestamp Filters */}
        <ControlledField
          module="requestLog"
          id="LogFilter.timestampFrom"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={this._filterValue("timestampFrom") || null}
                module="requestLog"
                label="LogFilter.timestampFrom"
                onChange={(d) => this._onChangeTimeRange("timestampFrom", d)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="requestLog"
          id="LogFilter.timestampTo"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={this._filterValue("timestampTo") || null}
                module="requestLog"
                label="LogFilter.timestampTo"
                onChange={(d) => this._onChangeTimeRange("timestampTo", d)}
              />
            </Grid>
          }
        />

        {/* Duration Filters */}
        <ControlledField
          module="requestLog"
          id="LogFilter.highDuration"
          field={
            <Grid item xs={2} className={classes.item}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={this._filterValue("high") || false}
                    onChange={(e) => this._onChangeDuration("high", e.target.checked)}
                  />
                }
                label={formatMessage(intl, "requestLog", "LogFilter.highDuration")}
              />
            </Grid>
          }
        />
        <ControlledField
          module="requestLog"
          id="LogFilter.mediumDuration"
          field={
            <Grid item xs={2} className={classes.item}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={this._filterValue("medium") || false}
                    onChange={(e) => this._onChangeDuration("medium", e.target.checked)}
                  />
                }
                label={formatMessage(intl, "requestLog", "LogFilter.mediumDuration")}
              />
            </Grid>
          }
        />
        <ControlledField
          module="requestLog"
          id="LogFilter.lowDuration"
          field={
            <Grid item xs={2} className={classes.item}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={this._filterValue("low") || false}
                    onChange={(e) => this._onChangeDuration("low", e.target.checked)}
                  />
                }
                label={formatMessage(intl, "requestLog", "LogFilter.lowDuration")}
              />
            </Grid>
          }
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  filters: state.notice.filters || {}, // Adjust based on your reducer structure
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch); // No specific actions needed yet
};

export default withModulesManager(
  injectIntl(
    withTheme(
      withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LogFilter))
    )
  )
);