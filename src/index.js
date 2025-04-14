
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import NoticesPage from "./pages/NoticesPage"
import NoticePage from "./pages/NoticePage";
const ROUTE_NOTICES = "notice/notices";
const ROUTE_NOTICE_EDIT = "notice/notice";
import NoticeMainMenu from "./menus/NoticeMainMenu";
import AllNoticePage from "./pages/AllNoticePage";
import NoticeAttachmentsDialog from "./components/NoticeAttachmentsDialog";
import Carousel from "./components/Carousel";
import RequestLogsPage from "./pages/RequestLogsPage";

const ROUTE_ALL_NOTICE_PAGE = "notice/allNotices";
const ROUTE_REQUEST_LOGS_PAGE = "notice/requestLogs";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: "notice", reducer }],
  "refs": [
    { key: "notice.route.notices", ref: ROUTE_NOTICES },
    { key: "notice.route.noticeEdit", ref: ROUTE_NOTICE_EDIT },
    { key: "notice.route.allNotices", ref: ROUTE_ALL_NOTICE_PAGE },
    { key: "notice.allNotices", ref: AllNoticePage },
    { key: "notice.AttachmentDialog", ref: NoticeAttachmentsDialog },
    { key: "notice.Carousel", ref: Carousel },
  ],
  "core.Router": [
    { path: ROUTE_NOTICES, component: NoticesPage },
    { path: ROUTE_NOTICE_EDIT + "/:notice_uuid?", component: NoticePage },
    { path: ROUTE_ALL_NOTICE_PAGE, component: AllNoticePage },
    {path: ROUTE_REQUEST_LOGS_PAGE, component: RequestLogsPage}
  ],
  "core.MainMenu": [NoticeMainMenu]
};

export const NoticeModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
