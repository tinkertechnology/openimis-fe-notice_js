import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { Fab, Badge } from "@material-ui/core";
import AttachIcon from "@material-ui/icons/AttachFile";
import ReplayIcon from "@material-ui/icons/Replay";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush, journalize,
    Form, ProgressOrError, formatMessage, coreAlert
} from "@openimis/fe-core";
import NoticeMasterPanel from "../components/NoticeMasterPanel";
import NoticeNotificationPanel from "../components/NoticeNotificationPanel";
import NoticeAttachmentsDialog from "../components/NoticeAttachmentsDialog";
import { createNotice, updateNotice, getNotice } from "../actions";
import { RIGHT_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    paperHeaderAction: theme.paper.action,
});

const NOTICE_FORM_CONTRIBUTION_KEY = "notice.NoticeForm";

class NoticeForm extends Component {
    state = {
        lockNew: false,
        reset: 0,
        notice_uuid: null,
        notice: this._newNotice(),
        newNotice: true,
        attachmentsNotice: null, 
        readOnlydevMode : false
    }

    _newNotice() {
        return {
            uuid: this.props.notice?.uuid ?? null,
            title: this.props.notice?.title ?? "",
            description: this.props.notice?.description ?? "",
            priority: this.props.notice?.priority ?? "MEDIUM",
            healthFacility: this.props.notice?.healthFacility ?? null,
            createdAt: this.props.notice?.createdAt ?? null,
            updatedAt: this.props.notice?.updatedAt ?? null,
            isActive: this.props.notice?.isActive ?? true,
            sendSms: this.props.notice?.sendSms ?? false,
            sendEmail: this.props.notice?.sendEmail ?? false,
            attachmentsCount: this.props.notice?.attachmentsCount ?? 0, // Track attachment count
        };
    }

    componentDidMount() {
        document.title = formatMessageWithValues(
            this.props.intl, "notice", "notices", { label: "Notices" }
        );
        if (this.props.notice_uuid) {
            this.setState(
                { notice_uuid: this.props.notice_uuid },
                () => this.props.getNotice(
                    this.props.modulesManager,
                    this.props.notice_uuid
                )
            );
        }
    }

    back = () => {
        const { modulesManager, history } = this.props;
        historyPush(modulesManager, history, "notice.route.notices");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fetchedNotice !== this.props.fetchedNotice && this.props.fetchedNotice) {
            const notice = this.props.notice;
            this.setState({
                notice,
                notice_uuid: notice.uuid,
                lockNew: false,
                newNotice: false
            });
        } else if (prevProps.notice_uuid && !this.props.notice_uuid) {
            document.title = formatMessage(this.props.intl, "notice", "NoticeForm.title.new");
            this.setState({
                notice: this._newNotice(),
                newNotice: true,
                lockNew: false,
                notice_uuid: null
            });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        }
    }

    _add = () => {
        this.setState(
            (state) => ({
                notice: this._newNotice(),
                newNotice: true,
                lockNew: false,
                reset: state.reset + 1,
            }),
            () => {
                this.props.add();
                this.forceUpdate();
            }
        );
    }

    reload = () => {
        this.props.getNotice(
            this.props.modulesManager,
            this.state.notice_uuid
        );
    }

    canSave = () => {
        const { notice } = this.state;
        if (!notice.title) return false;
        if (!notice.description) return false;
        if (!notice.priority) return false;
        if (!notice.healthFacility) return false;
        return true;
    }

    _save = (notice) => {
        if (!this.canSave()) {
            this.props.coreAlert(
                formatMessage(this.props.intl, "notice", "notice.missingAttachment"),
                formatMessage(this.props.intl, "notice", "notice.attachFile")
            );
            this.setState({ reset: this.state.reset + 1 });
            return;
        }
        this.setState(
            { lockNew: !notice.uuid },
            () => this.props.save(notice)
        );
    }

    onEditedChanged = notice => {
        this.setState({ notice, newNotice: false });
    }

    render() {
        const {
            intl, notice_uuid, fetchingNotice, fetchedNotice, errorNotice,
            add, save, rights, classes
        } = this.props;
        const { notice, lockNew } = this.state;

        const readOnly = ((lockNew || !rights.includes(RIGHT_ADD)) && this.state.readOnlydevMode); // Lock form after save or if no add rights
        console.log("readOnly", readOnly);

        const actions = [];
        if (notice_uuid) {
            actions.push({
                doIt: this.reload,
                icon: <ReplayIcon />,
                onlyIfDirty: !readOnly,
            });
        }
        if (!readOnly || notice.attachmentsCount > 0) {
            actions.push({
                doIt: () => this.setState({ attachmentsNotice: notice }),
                icon: (
                    <Badge badgeContent={notice.attachmentsCount || 0} color="primary">
                        <AttachIcon />
                    </Badge>
                ),
            });
        }

        return (
            <div>
                <ProgressOrError progress={fetchingNotice} error={errorNotice} />
                {(fetchedNotice || !notice_uuid) && (
                    <Fragment>
                        <NoticeAttachmentsDialog
                            notice={this.state.attachmentsNotice}
                            //readOnly={!rights.includes(RIGHT_ADD) || readOnly}
                            close={() => this.setState({ attachmentsNotice: null })}
                            onUpdated={() => {
                                this.setState((state) => ({
                                    notice: { ...state.notice, attachmentsCount: state.notice.attachmentsCount + 1 },
                                    forcedDirty: true
                                }));
                            }}
                        />
                        <Form
                            module="notice"
                            edited_id={notice_uuid}
                            edited={notice}
                            reset={this.state.reset}
                            title={notice_uuid ? "NoticeForm.title" : "NoticeForm.title.new"}
                            titleParams={{ code: notice_uuid || "" }}
                            back={this.back}
                            add={this._add}
                            save={save ? this._save : null}
                            canSave={this.canSave}
                            reload={notice_uuid && this.reload}
                            readOnly={readOnly}
                            HeadPanel={NoticeMasterPanel}
                            Panels={[NoticeNotificationPanel]}
                            onEditedChanged={this.onEditedChanged}
                            actions={actions}
                        />
                    </Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    fetchingNotice: state.notice?.fetchingNotice,
    errorNotice: state.notice?.errorNotice,
    fetchedNotice: state.notice?.fetchedNotice,
    notice: state.notice?.notice,
    submittingMutation: state.notice?.submittingMutation,
    mutation: state.notice?.mutation,
    rights: state.core?.user?.i_user?.rights || [],
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createNotice, updateNotice, getNotice, journalize, coreAlert }, dispatch);
};

export default withHistory(
    withModulesManager(
        connect(mapStateToProps, mapDispatchToProps)(
            injectIntl(withTheme(withStyles(styles)(NoticeForm)))
        )
    )
);