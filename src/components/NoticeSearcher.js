import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import {
  withModulesManager, formatMessageWithValues, historyPush,
  withHistory, Searcher, coreAlert, PublishedComponent
} from "@openimis/fe-core";
import EmailIcon from '@material-ui/icons/Email';
import SmsIcon from '@material-ui/icons/Sms';
import { fetchNotices, fetchNotice, sendNoticeEmail, sendNoticeSMS, toggleNoticeStatus } from "../actions";
import NoticeFilter from "./NoticeFilter";
import { IconButton, Switch, Tooltip, CircularProgress } from "@material-ui/core";
import PriorityChip from "./PriorityChip";
import EditIcon from "@material-ui/icons/Edit";

const NOTICE_SEARCHER_CONTRIBUTION_KEY = "notice.NoticeSearcher";

class NoticeSearcher extends Component {
  state = {
    open: false,
    id: null,
    confirmedAction: null,
    reset: 0,
  }

  constructor(props) {
    super(props);
    this.rowsPerPageOptions = props.modulesManager.getConf("fe-notice", "noticeFilter.rowsPerPageOptions", [10, 20, 50, 100]);
    this.defaultPageSize = props.modulesManager.getConf("fe-notice", "noticeFilter.defaultPageSize", 10);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      if (this.props.errorMutation) {
        this.props.coreAlert(
          "Error",
          formatMessageWithValues(this.props.intl, "notice", "mutationError", { error: this.props.errorMutation.message })
        );
      } else {
        const label = this.props.mutation.clientMutationLabel;
        if (label === "Toggle Notice Status") {
          this.props.coreAlert(
            "Success",
            formatMessageWithValues(this.props.intl, "notice", "toggleSuccess")
          );
          // Fetch the updated notice for this specific row
          this.props.fetchNotice(this.props.modulesManager, this.props.mutation.uuid);
        } else if (label === "Send Notice Email") {
          this.props.coreAlert(
            "Success",
            formatMessageWithValues(this.props.intl, "notice", "emailSent", { title: this.props.mutation.title })
          );
        } else if (label === "Send Notice SMS") {
          this.props.coreAlert(
            "Success",
            formatMessageWithValues(this.props.intl, "notice", "smsSent", { title: this.props.mutation.title })
          );
        }
      }
    }
  }

  fetch = (prms) => {
    this.props.fetchNotices(this.props.modulesManager, prms);
  }

  sendEmail = (notice) => {
    this.props.sendNoticeEmail(this.props.modulesManager, notice.uuid, "Send Notice Email", null, { title: notice.title });
  }

  sendSMS = (notice) => {
    this.props.sendNoticeSMS(this.props.modulesManager, notice.uuid, "Send Notice SMS", null, { title: notice.title });
  }

  toggleStatus = (notice) => {
    const newStatus = !notice.isActive;
    this.props.toggleNoticeStatus(this.props.modulesManager, notice.uuid, newStatus);
  }

  rowIdentifier = (r) => r.id

  filtersToQueryParams = (state) => {
    let prms = Object.keys(state.filters)
      .filter(f => !!state.filters[f]['filter'])
      .map(f => state.filters[f]['filter']);

    prms.push(`first: ${state.pageSize}`);
    if (state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
    }
    if (state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
    }
    return prms;
  }

  canSelectAll = (selection) => this.props.notices.map(s => s.id).filter(s => !selection.map(s => s.id).includes(s)).length
  rowLocked = (selection, notice) => !!notice.clientMutationId

  headers = () => [
    "notice.uuid",
    "notice.title",
    "notice.description",
    "notice.priority",
    "notice.health_facility",
    "notice.created_at",
    "notice.updated_at",
    "notice.is_active",
    "notice.actions",
  ];

  sorts = () => [
    ['uuid', true],
    ['title', true],
    ['description', true],
    ['priority', true],
    ['health_facility', true],
    ['created_at', true],
    ['updated_at', true],
    ['is_active', true],
  ];

  itemFormatters = () => [
    e => e.uuid,
    e => e.title,
    e => e?.description ?? "",
    e => <PriorityChip priority={e.priority} />,
    e => e.healthFacility?.name || e.healthFacility?.id || "",
    e => e.createdAt,
    e => e.updatedAt,
    e => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            checked={e.isActive}
            onChange={() => this.toggleStatus(e)}
            color="primary"
            disabled={this.props.submittingMutation || this.props.fetchingNotice}
          />
          {(this.props.submittingMutation || this.props.fetchingNotice) && this.props.mutation.clientMutationLabel === "Toggle Notice Status" && (
            <CircularProgress size={20} style={{ marginLeft: 8 }} />
          )}
        </div>
      );
    },
    e => (
      <div>
        <Tooltip title={formatMessageWithValues(this.props.intl, "notice", "sendEmail")}>
          <IconButton
            onClick={() => this.sendEmail(e)}
            disabled={this.props.submittingMutation && this.props.mutation.clientMutationLabel === "Send Notice Email"}
          >
            <EmailIcon style={{ color: "#000000" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={formatMessageWithValues(this.props.intl, "notice", "sendSMS")}>
          <IconButton
            onClick={() => this.sendSMS(e)}
            disabled={this.props.submittingMutation && this.props.mutation.clientMutationLabel === "Send Notice SMS"}
          >
            <SmsIcon style={{ color: "#000000" }}/>
          </IconButton>
        </Tooltip>
        <Tooltip title={formatMessageWithValues(this.props.intl, "notice", "sendSMS")}>
          <IconButton onClick={() => historyPush(this.props.modulesManager, this.props.history, "notice.route.noticeEdit", [e.uuid])}>
            <EditIcon />
          </IconButton>

        </Tooltip>
      </div>
    ),
  ];

  editNotice = c => historyPush(this.props.modulesManager, this.props.history, "notice.route.noticeEdit", [c.uuid])

  render() {
    const { intl, notices, noticesPageInfo, fetchingNotices, fetchedNotices, errorNotices, filterPaneContributionsKey, cacheFiltersKey, FilterExt } = this.props;
    let count = noticesPageInfo.totalCount ?? 0;

    return (
      <Fragment>
        <PublishedComponent>
          <div id="notice.route.allNotices"> </div>
        </PublishedComponent>
        <Searcher
          module="notice"
          // canSelectAll={this.canSelectAll}
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={NoticeFilter}
          FilterExt={FilterExt}
          filterPaneContributionsKey={filterPaneContributionsKey}
          items={notices}
          itemsPageInfo={noticesPageInfo}
          fetchingItems={fetchingNotices}
          fetchedItems={fetchedNotices}
          errorItems={errorNotices}
          tableTitle={formatMessageWithValues(intl, "notice", "notices_table.count", { count })}
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="-created_at"
          rowLocked={this.rowLocked}
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          onDoubleClick={this.editNotice}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  rights: state.core?.user?.i_user?.rights || [],
  fetchingNotices: state.notice.fetchingNotices,
  fetchedNotices: state.notice.fetchedNotices,
  notices: state.notice.notices,
  noticesPageInfo: state.notice.noticesPageInfo,
  errorNotices: state.notice.errorNotices,
  submittingMutation: state.notice.submittingMutation,
  mutation: state.notice.mutation,
  errorMutation: state.notice.errorMutation,
  fetchingNotice: state.notice.fetchingNotice,
  fetchedNotice: state.notice.fetchedNotice,
  errorNotice: state.notice.errorNotice,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchNotices,
    fetchNotice,
    sendNoticeEmail,
    sendNoticeSMS,
    toggleNoticeStatus,
    coreAlert,
    journalize: (mutation) => ({ type: "JOURNALIZE", payload: mutation }),
  }, dispatch);
};

export default withModulesManager(
  withHistory(
    connect(mapStateToProps, mapDispatchToProps)(
      injectIntl(NoticeSearcher)
    )
  )
);