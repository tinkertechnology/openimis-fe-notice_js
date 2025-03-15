import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import {
  formatMessage,
  FormPanel,
  TextInput,
  Contributions,
  withModulesManager,
  ConstantBasedPicker,
  PublishedComponent,
  ControlledField,
} from "@openimis/fe-core";
import { NOTICE_PRIORITY_LEVELS } from "../constants";

const styles = (theme) => ({
  paper: theme.paper.paper,
  paperHeader: theme.paper.header,
  item: theme.paper.item, // This applies padding (e.g., 8px or 16px) from the theme
  fullHeight: {
    height: "100%",
  },
});

const NOTICE_MASTER_PANEL_CONTRIBUTION_KEY = "notice.MasterPanel";
const NOTICE_PANELS_CONTRIBUTION_KEY = "notice.panels";

class NoticeMasterPanel extends FormPanel {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      edited,
      title = "Notice",
      titleParams = { label: "" },
      readOnly = false,
      intl,
      reset,
    } = this.props;

    if (!edited) return null;

    return (
      <Grid container>
        <Grid container className={classes.paperHeader}>
          <Contributions
            {...this.props}
            updateAttribute={this.updateAttribute}
            contributionKey={NOTICE_MASTER_PANEL_CONTRIBUTION_KEY}
          />
        </Grid>

        <ControlledField
          module="notice"
          id="Notice.title"
          field={
            <Grid item xs={6} className={classes.item}>
              <TextInput
                module="notice"
                label="notice.title"
                value={edited.title}
                required={true}
                onChange={(v) => this.updateAttribute("title", v)}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="notice"
          id="Notice.createdAt"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={edited.createdAt || Date.now()}
                module="notice"
                label="notice.created_at"
                reset={reset}
                onChange={(d) => this.updateAttribute("dateFrom", d)}
                readOnly={readOnly}
                required={false}
              />
            </Grid>
          }
        />
        <ControlledField
          module="notice"
          id="Notice.priority"
          field={
            <Grid item xs={6} className={classes.item}>
              <ConstantBasedPicker
                module="notice"
                label="notice.priority"
                constants={NOTICE_PRIORITY_LEVELS}
                value={edited.priority}
                onChange={(v) => this.updateAttribute("priority", v)}
                required={true}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="notice"
          id="Notice.healthFacility"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="location.HealthFacilityPicker"
                module="notice"
                label="notice.health_facility"
                value={edited.healthFacility}
                onChange={(v) => this.updateAttribute("healthFacility", v)}
                required={true}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="notice"
          id="Notice.description"
          field={
            <Grid item xs={6} className={classes.item}>
              <TextInput
                module="notice"
                label="notice.description"
                value={edited.description}
                required={true}
                multiline
                rows={3}
                onChange={(v) => this.updateAttribute("description", v)}
                readOnly={readOnly}
              />
            </Grid>
          }
        />
        <ControlledField
          module="notice"
          id="Notice.isActive"
          field={
            <Grid item xs={6} className={classes.item}>
              <PublishedComponent
                pubRef="core.BooleanField"
                module="notice"
                label="notice.is_active"
                value={edited.isActive}
                onChange={(v) => this.updateAttribute("isActive", v)}
                readOnly={readOnly}
              />
            </Grid>
          }
        />

        <Contributions
          {...this.props}
          updateAttribute={this.updateAttribute}
          contributionKey={NOTICE_PANELS_CONTRIBUTION_KEY}
        />
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(NoticeMasterPanel)));