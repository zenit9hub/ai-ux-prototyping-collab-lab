import {
  deviceGroups,
  devices,
  firmwareVersions,
  initialAlerts,
  initialCampaigns,
  sites,
} from "./data.js";

const shell = document.getElementById("app-shell");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main-content");
const toastRegion = document.getElementById("toast-region");

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "◫" },
  { id: "devices", label: "Device List", icon: "▤" },
  { id: "alerts", label: "Alerts", icon: "●" },
  { id: "firmware", label: "Firmware Campaign", icon: "↟" },
  { id: "reports", label: "Reports", icon: "▥" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

const state = {
  alertSeverity: "all",
  alertStatus: "all",
  alerts: initialAlerts.map((alert) => ({ ...alert })),
  campaigns: initialCampaigns.map((campaign) => ({ ...campaign })),
  dashboardSite: "all",
  deviceGroup: "all",
  deviceQuery: "",
  deviceSite: "all",
  deviceStatus: "all",
  drawer: null,
  mobileMenuOpen: false,
  pendingCommand: null,
  screen: "dashboard",
  sidebarCollapsed: false,
};

let lastFocusedElement = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return characters[character];
  });
}

function titleCase(value) {
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function deviceById(id) {
  return devices.find((device) => device.id === id);
}

function alertById(id) {
  return state.alerts.find((alert) => alert.id === id);
}

function statusClass(status) {
  return "status-" + String(status).replace(/\s+/g, "-");
}

function statusBadge(status) {
  return (
    '<span class="status-badge ' +
    statusClass(status) +
    '">' +
    escapeHtml(titleCase(status)) +
    "</span>"
  );
}

function option(value, label, selectedValue) {
  const selected = value === selectedValue ? " selected" : "";
  return (
    '<option value="' +
    escapeHtml(value) +
    '"' +
    selected +
    ">" +
    escapeHtml(label) +
    "</option>"
  );
}

function percentage(part, total) {
  if (!total) {
    return 0;
  }
  return Math.round((part / total) * 100);
}

function scopedDevices() {
  if (state.dashboardSite === "all") {
    return devices;
  }
  return devices.filter((device) => device.site === state.dashboardSite);
}

function filteredDevices() {
  return devices.filter((device) => {
    const query = state.deviceQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      device.name.toLowerCase().includes(query) ||
      device.id.toLowerCase().includes(query);
    const matchesStatus =
      state.deviceStatus === "all" || device.status === state.deviceStatus;
    const matchesSite =
      state.deviceSite === "all" || device.site === state.deviceSite;
    const matchesGroup =
      state.deviceGroup === "all" || device.group === state.deviceGroup;
    return matchesQuery && matchesStatus && matchesSite && matchesGroup;
  });
}

function filteredAlerts() {
  return state.alerts
    .filter((alert) => {
      const severityMatches =
        state.alertSeverity === "all" || alert.severity === state.alertSeverity;
      const statusMatches =
        state.alertStatus === "all" || alert.status === state.alertStatus;
      return severityMatches && statusMatches;
    })
    .sort((first, second) => {
      const priority = { critical: 0, warning: 1, info: 2 };
      return priority[first.severity] - priority[second.severity];
    });
}

function renderSidebar() {
  const navigationMarkup = navigation
    .map((item) => {
      const active = state.screen === item.id ? " is-active" : "";
      const current = state.screen === item.id ? ' aria-current="page"' : "";
      return (
        '<button class="nav-button' +
        active +
        '" type="button" data-action="navigate" data-screen="' +
        item.id +
        '"' +
        current +
        ">" +
        '<span class="nav-icon" aria-hidden="true">' +
        item.icon +
        "</span>" +
        '<span class="nav-label">' +
        item.label +
        "</span>" +
        "</button>"
      );
    })
    .join("");

  return (
    '<a class="brand" href="./index.html" aria-label="AIoT Platform home">' +
    '<span class="brand-mark" aria-hidden="true">◒</span>' +
    '<span class="brand-copy"><strong>AIoT Platform</strong><small>Operations console</small></span>' +
    "</a>" +
    '<nav class="side-nav" aria-label="Platform screens">' +
    navigationMarkup +
    "</nav>" +
    '<div class="sidebar-footer">' +
    "<p>Prototype workspace<br />Mock data only · July 2026</p>" +
    '<button class="sidebar-toggle" type="button" data-action="toggle-sidebar"><span aria-hidden="true">⇤</span><span>Collapse navigation</span></button>' +
    "</div>"
  );
}

function renderHeader(title, subtitle, actionMarkup) {
  const actions =
    '<div class="head-actions">' +
    '<span class="demo-badge">Prototype data · no live device control</span>' +
    '<button class="icon-button" type="button" data-action="toggle-menu" aria-label="Open navigation">☰</button>' +
    (actionMarkup || "") +
    "</div>";
  return (
    '<header class="page-head">' +
    "<div>" +
    '<p class="page-kicker">AIoT operations</p>' +
    "<h1 class=\"page-title\">" +
    escapeHtml(title) +
    "</h1>" +
    '<p class="page-subtitle">' +
    escapeHtml(subtitle) +
    "</p>" +
    "</div>" +
    actions +
    "</header>"
  );
}

function renderSelectField(label, inputName, value, values, allLabel) {
  const options = [option("all", allLabel, value)]
    .concat(values.map((item) => option(item, item, value)))
    .join("");
  return (
    '<div class="field">' +
    '<label for="' +
    inputName +
    '">' +
    label +
    "</label>" +
    '<select id="' +
    inputName +
    '" data-input="' +
    inputName +
    '">' +
    options +
    "</select>" +
    "</div>"
  );
}

function renderMetricCard(label, value, note, icon, className) {
  return (
    '<article class="metric-card ' +
    className +
    '">' +
    '<div class="metric-label"><span aria-hidden="true">' +
    icon +
    "</span>" +
    escapeHtml(label) +
    "</div>" +
    '<p class="metric-value">' +
    escapeHtml(value) +
    "</p>" +
    '<p class="metric-note">' +
    escapeHtml(note) +
    "</p>" +
    "</article>"
  );
}

function renderDashboard() {
  const scoped = scopedDevices();
  const online = scoped.filter((device) => device.connectivity === "online");
  const critical = scoped.filter((device) => device.status === "critical");
  const upToDate = scoped.filter((device) => device.firmware === "v3.2.1");
  const riskRows = [...scoped]
    .sort((first, second) => second.risk - first.risk)
    .slice(0, 5)
    .map((device) => {
      return (
        '<button class="risk-row" type="button" data-device="' +
        device.id +
        '">' +
        "<span>" +
        '<span class="row-title">' +
        escapeHtml(device.name) +
        "</span>" +
        '<span class="row-meta">' +
        escapeHtml(device.site + " · " + device.group) +
        "</span>" +
        '<span class="risk-track" aria-hidden="true"><span class="risk-fill" style="width:' +
        device.risk +
        '%"></span></span>' +
        "</span>" +
        '<span class="risk-number">' +
        device.risk +
        "</span>" +
        "</button>"
      );
    })
    .join("");
  const alertRows = state.alerts
    .filter((alert) => alert.status !== "resolved")
    .slice(0, 5)
    .map((alert) => {
      const device = deviceById(alert.deviceId);
      return (
        '<button class="alert-row" type="button" data-alert="' +
        alert.id +
        '">' +
        "<span>" +
        '<span class="row-title"><span class="severity-dot severity-' +
        alert.severity +
        '"></span>' +
        escapeHtml(alert.title) +
        "</span>" +
        '<span class="row-meta">' +
        escapeHtml(device.name + " · " + alert.createdAt) +
        "</span>" +
        "</span>" +
        statusBadge(alert.status) +
        "</button>"
      );
    })
    .join("");

  return (
    renderHeader(
      "Fleet overview",
      "A fleet-level operational view across the selected sites. Use filters to review risk before drilling into a device or alert.",
      '<button class="secondary-button" type="button" data-action="refresh">↻ Refresh demo</button>'
    ) +
    '<section class="panel filter-panel" aria-label="Fleet filters">' +
    renderSelectField(
      "Site scope",
      "dashboard-site",
      state.dashboardSite,
      sites,
      "All sites · Fleet"
    ) +
    '<div class="field"><label for="dashboard-scope">Review scope</label><select id="dashboard-scope" disabled><option>Fleet view</option></select></div>' +
    '<div class="field"><label for="dashboard-range">Time range</label><select id="dashboard-range" disabled><option>Last 24 hours</option></select></div>' +
    '<div class="field"><label for="dashboard-note">Data state</label><input id="dashboard-note" value="Prototype simulation" readonly /></div>' +
    "</section>" +
    '<section class="metrics-grid" aria-label="Fleet summary">' +
    renderMetricCard(
      "Devices in scope",
      String(scoped.length),
      state.dashboardSite === "all" ? "Fleet across 4 sites" : state.dashboardSite,
      "▦",
      "metric-fleet"
    ) +
    renderMetricCard(
      "Critical alerts",
      String(critical.length),
      critical.length ? "Requires operator review" : "No critical device state",
      "!",
      "metric-critical"
    ) +
    renderMetricCard(
      "Devices online",
      percentage(online.length, scoped.length) + "%",
      String(online.length) + " of " + String(scoped.length) + " connected",
      "◌",
      "metric-online"
    ) +
    renderMetricCard(
      "Firmware compliance",
      percentage(upToDate.length, scoped.length) + "%",
      String(upToDate.length) + " on v3.2.1",
      "↟",
      "metric-firmware"
    ) +
    "</section>" +
    '<section class="dashboard-grid">' +
    '<article class="panel"><div class="panel-head"><div><h2>Highest operational risk</h2><p>Risk scores are prototype data for review.</p></div><button class="panel-link" type="button" data-action="show-devices">Open device list →</button></div><div class="device-risk-list">' +
    riskRows +
    "</div></article>" +
    '<article class="panel"><div class="panel-head"><div><h2>Open alerts</h2><p>Prioritized by severity.</p></div><button class="panel-link" type="button" data-action="show-alerts">Open alerts →</button></div><div class="alert-list">' +
    alertRows +
    "</div></article>" +
    "</section>"
  );
}

function renderDeviceTable(deviceList) {
  if (!deviceList.length) {
    return (
      '<div class="empty-state"><strong>No devices match these filters.</strong>Adjust the search or filter values to continue.</div>'
    );
  }
  const rows = deviceList
    .map((device) => {
      return (
        "<tr>" +
        "<td><button class=\"table-link\" type=\"button\" data-device=\"" +
        device.id +
        "\">" +
        escapeHtml(device.name) +
        "</button><div class=\"row-meta\">" +
        escapeHtml(device.id) +
        "</div></td>" +
        "<td>" +
        escapeHtml(device.site) +
        "</td>" +
        "<td>" +
        escapeHtml(device.group) +
        "</td>" +
        "<td>" +
        statusBadge(device.status) +
        "</td>" +
        "<td>" +
        statusBadge(device.connectivity === "online" ? "healthy" : "offline") +
        "</td>" +
        "<td>" +
        escapeHtml(device.firmware) +
        "</td>" +
        "<td>" +
        device.risk +
        "</td>" +
        "</tr>"
      );
    })
    .join("");
  return (
    '<div class="table-scroll"><table><thead><tr><th scope="col">Device</th><th scope="col">Site</th><th scope="col">Group</th><th scope="col">Health</th><th scope="col">Connection</th><th scope="col">Firmware</th><th scope="col">Risk</th></tr></thead><tbody>' +
    rows +
    "</tbody></table></div>"
  );
}

function renderDevices() {
  const list = filteredDevices();
  return (
    renderHeader(
      "Device list",
      "Search and filter the prototype fleet. Selecting a row opens a review drawer with local-only command simulations."
    ) +
    '<section class="panel filter-panel" aria-label="Device filters">' +
    '<div class="field"><label for="device-query">Search</label><input id="device-query" data-input="device-query" value="' +
    escapeHtml(state.deviceQuery) +
    '" placeholder="Device name or ID" /></div>' +
    renderSelectField(
      "Health",
      "device-status",
      state.deviceStatus,
      ["healthy", "warning", "critical"],
      "All health states"
    ) +
    renderSelectField("Site", "device-site", state.deviceSite, sites, "All sites") +
    renderSelectField(
      "Group",
      "device-group",
      state.deviceGroup,
      deviceGroups,
      "All groups"
    ) +
    "</section>" +
    '<section class="panel table-panel"><div class="panel-head"><div><h2>' +
    list.length +
    " devices in view</h2><p>Click a device to review its latest simulated status.</p></div></div>" +
    renderDeviceTable(list) +
    "</section>"
  );
}

function renderAlerts() {
  const list = filteredAlerts();
  const rows = list
    .map((alert) => {
      const device = deviceById(alert.deviceId);
      return (
        "<tr>" +
        "<td><button class=\"table-link\" type=\"button\" data-alert=\"" +
        alert.id +
        "\">" +
        '<span class="severity-dot severity-' +
        alert.severity +
        '"></span>' +
        escapeHtml(alert.title) +
        "</button><div class=\"row-meta\">" +
        escapeHtml(alert.id) +
        "</div></td>" +
        "<td>" +
        escapeHtml(device.name) +
        "</td>" +
        "<td>" +
        statusBadge(alert.severity) +
        "</td>" +
        "<td>" +
        statusBadge(alert.status) +
        "</td>" +
        "<td>" +
        escapeHtml(alert.owner) +
        "</td>" +
        "<td class=\"muted-cell\">" +
        escapeHtml(alert.createdAt) +
        "</td>" +
        "</tr>"
      );
    })
    .join("");
  const table = list.length
    ? '<div class="table-scroll"><table><thead><tr><th scope="col">Alert</th><th scope="col">Device</th><th scope="col">Severity</th><th scope="col">Status</th><th scope="col">Owner</th><th scope="col">Created</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></div>"
    : '<div class="empty-state"><strong>No alerts match these filters.</strong>Change the severity or status scope.</div>';
  return (
    renderHeader(
      "Alerts",
      "Review operational exceptions by severity and hand off a clear owner/status before resolving an issue."
    ) +
    '<section class="panel filter-panel" aria-label="Alert filters">' +
    renderSelectField(
      "Severity",
      "alert-severity",
      state.alertSeverity,
      ["critical", "warning", "info"],
      "All severities"
    ) +
    renderSelectField(
      "Lifecycle status",
      "alert-status",
      state.alertStatus,
      ["open", "in-progress", "resolved"],
      "All statuses"
    ) +
    '<div class="field"><label for="alert-source">Source</label><input id="alert-source" value="Prototype alert stream" readonly /></div>' +
    '<div class="field"><label for="alert-rule">Rule state</label><input id="alert-rule" value="Policy simulation" readonly /></div>' +
    "</section>" +
    '<section class="panel table-panel"><div class="panel-head"><div><h2>' +
    list.length +
    " alerts in view</h2><p>Opening an alert shows the device context and safe local-only actions.</p></div></div>" +
    table +
    "</section>"
  );
}

function renderFirmware() {
  const campaigns = state.campaigns
    .map((campaign) => {
      const progress = percentage(campaign.completed, campaign.total);
      return (
        '<article class="campaign-card">' +
        "<div><h3>" +
        escapeHtml(campaign.name) +
        "</h3><p>" +
        escapeHtml(campaign.version + " · " + campaign.group + " · " + campaign.updatedAt) +
        "</p></div>" +
        '<div class="progress-block"><div class="progress-meta"><span>' +
        statusBadge(campaign.status) +
        "</span><span>" +
        campaign.completed +
        "/" +
        campaign.total +
        " devices</span></div><div class=\"progress-track\"><span style=\"width:" +
        progress +
        '%"></span></div></div>' +
        '<button class="secondary-button" type="button" data-action="inspect-campaign" data-campaign="' +
        campaign.id +
        '">Inspect</button>' +
        "</article>"
      );
    })
    .join("");
  return (
    renderHeader(
      "Firmware campaigns",
      "Review a staged deployment plan before connecting this experience to approved update APIs and audit records.",
      '<button class="primary-button" type="button" data-action="new-campaign">＋ Create demo campaign</button>'
    ) +
    '<section class="screen-grid">' +
    '<article class="panel"><div class="panel-head"><div><h2>Campaign activity</h2><p>All status changes below are simulated for this prototype.</p></div></div>' +
    campaigns +
    "</article>" +
    '<aside class="panel chart-panel"><div class="panel-head"><div><h2>Readiness by group</h2><p>Devices on the latest version.</p></div></div><div class="bar-chart">' +
    deviceGroups
      .map((group, index) => {
        const groupDevices = devices.filter((device) => device.group === group);
        const ready = groupDevices.filter(
          (device) => device.firmware === "v3.2.1"
        ).length;
        const height = 30 + index * 15 + percentage(ready, groupDevices.length) * 0.8;
        return (
          '<div class="bar-group"><span class="bar" style="height:' +
          height +
          'px"></span><small>' +
          escapeHtml(group) +
          "</small></div>"
        );
      })
      .join("") +
    "</div></aside>" +
    "</section>"
  );
}

function renderReports() {
  const reportingSites = sites
    .map((site, index) => {
      const siteDevices = devices.filter((device) => device.site === site);
      const healthy = siteDevices.filter((device) => device.status === "healthy").length;
      const openAlerts = state.alerts.filter((alert) => {
        const device = deviceById(alert.deviceId);
        return device.site === site && alert.status !== "resolved";
      }).length;
      const uptime = [96.8, 98.9, 94.2, 99.1][index];
      return (
        "<tr><td>" +
        escapeHtml(site) +
        "</td><td>" +
        uptime +
        "%</td><td>" +
        healthy +
        "/" +
        siteDevices.length +
        "</td><td>" +
        openAlerts +
        "</td><td class=\"muted-cell\">Jul 22, 2026</td></tr>"
      );
    })
    .join("");
  return (
    renderHeader(
      "Reports",
      "A static reporting view that translates operational data into a reviewable handoff. Export is intentionally disabled until an approved data path exists.",
      '<button class="secondary-button" type="button" data-action="export-report">⇩ Export demo report</button>'
    ) +
    '<section class="report-stat-grid">' +
    '<article class="report-stat"><small>Fleet uptime</small><b>98.4%</b></article>' +
    '<article class="report-stat"><small>Alerts resolved</small><b>142</b></article>' +
    '<article class="report-stat"><small>Open reviews</small><b>' +
    state.alerts.filter((alert) => alert.status !== "resolved").length +
    "</b></article>" +
    '<article class="report-stat"><small>Avg. response</small><b>12 min</b></article>' +
    "</section>" +
    '<section class="panel table-panel" style="margin-top:18px"><div class="panel-head"><div><h2>Site health summary</h2><p>Example values only. No production reporting data is present.</p></div></div><div class="table-scroll"><table><thead><tr><th scope="col">Site</th><th scope="col">Uptime</th><th scope="col">Healthy devices</th><th scope="col">Open alerts</th><th scope="col">Last report</th></tr></thead><tbody>' +
    reportingSites +
    "</tbody></table></div></section>"
  );
}

function renderSettings() {
  return (
    renderHeader(
      "Settings",
      "Configuration is displayed to clarify the information architecture. Editing remains disabled in this public prototype."
    ) +
    '<section class="settings-grid">' +
    '<article class="panel"><div class="panel-head"><div><h2>Access roles</h2><p>Role boundaries for future authenticated workflows.</p></div></div><div class="settings-list">' +
    '<div class="settings-row"><div><b>Operations Manager</b><span>Fleet review and campaign approval</span></div><button class="disabled-button" disabled>Demo policy</button></div>' +
    '<div class="settings-row"><div><b>Field Engineer</b><span>Device diagnostics and alert response</span></div><button class="disabled-button" disabled>Demo policy</button></div>' +
    '<div class="settings-row"><div><b>System Administrator</b><span>Site, notification, and role settings</span></div><button class="disabled-button" disabled>Demo policy</button></div>' +
    "</div></article>" +
    '<article class="panel"><div class="panel-head"><div><h2>Notification channels</h2><p>Shown as policy concepts, not live delivery channels.</p></div></div><div class="settings-list">' +
    '<div class="settings-row"><div><b>Email escalation</b><span>Configured in a production integration</span></div>' +
    statusBadge("healthy") +
    "</div>" +
    '<div class="settings-row"><div><b>SMS escalation</b><span>Requires approved provider and consent flow</span></div>' +
    statusBadge("warning") +
    "</div>" +
    '<div class="settings-row"><div><b>Webhook integration</b><span>Requires endpoint authentication and audit policy</span></div>' +
    statusBadge("warning") +
    "</div></div></article>" +
    '<article class="panel"><div class="panel-head"><div><h2>Danger zone</h2><p>Protected examples; real actions require authorization and audit logs.</p></div></div><div class="settings-list">' +
    '<div class="settings-row"><div><b>Firmware approval threshold</b><span>Change requires policy owner approval.</span></div><button class="disabled-button" disabled>Protected</button></div>' +
    '<div class="settings-row"><div><b>Remove site</b><span>Production action requires data retention review.</span></div><button class="disabled-button" disabled>Protected</button></div>' +
    "</div></article>" +
    '<article class="panel"><div class="panel-head"><div><h2>Prototype boundary</h2><p>This deployment intentionally contains no API key, authentication, or live device connection.</p></div></div><div class="settings-list">' +
    '<div class="settings-row"><div><b>Data source</b><span>Local mock data in assets/js/data.js</span></div></div>' +
    '<div class="settings-row"><div><b>Deployment</b><span>GitHub Pages static artifact</span></div></div>' +
    "</div></article>" +
    "</section>"
  );
}

function renderDeviceDrawer(device) {
  const recentActivity =
    '<div class="activity-list">' +
    '<div class="activity-row activity-good"><b>Routine health check completed</b><span>12 min ago</span></div>' +
    '<div class="activity-row activity-warning"><b>Signal quality reviewed</b><span>38 min ago</span></div>' +
    '<div class="activity-row activity-info"><b>Firmware version verified</b><span>1 h ago</span></div>' +
    "</div>";
  const commandBox = state.pendingCommand
    ? '<section class="drawer-section command-confirm"><h3>Confirm demo command</h3><p>“' +
      escapeHtml(state.pendingCommand) +
      '” will not contact a live device. It only demonstrates the confirmation step.</p><button class="danger-button" type="button" data-action="confirm-command">Confirm local simulation</button><button class="panel-link" type="button" data-action="cancel-command">Cancel</button></section>'
    : "";
  return (
    '<div class="drawer-scrim" data-action="close-drawer"></div>' +
    '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">' +
    '<header class="drawer-head"><div><h2 id="drawer-title">' +
    escapeHtml(device.name) +
    "</h2><p>" +
    escapeHtml(device.id + " · " + device.site + " · " + device.group) +
    '</p></div><button class="icon-button" type="button" data-action="close-drawer" data-autofocus aria-label="Close device review">×</button></header>' +
    '<div class="drawer-body">' +
    '<section class="drawer-section"><h3>Current status</h3><p>' +
    statusBadge(device.status) +
    " " +
    statusBadge(device.connectivity === "online" ? "healthy" : "offline") +
    "</p></section>" +
    '<section class="drawer-section"><div class="summary-grid" style="padding:0"><div class="summary-item"><small>Firmware</small><b>' +
    escapeHtml(device.firmware) +
    "</b></div><div class=\"summary-item\"><small>Risk score</small><b>" +
    device.risk +
    "</b></div><div class=\"summary-item\"><small>Signal</small><b>" +
    device.signal +
    "%</b></div><div class=\"summary-item\"><small>Last seen</small><b>" +
    escapeHtml(device.lastSeen) +
    "</b></div></div></section>" +
    '<section class="drawer-section"><h3>Safe command simulation</h3><p>Commands are intentionally local-only in this prototype.</p><div class="action-grid" style="padding:12px 0 0"><button class="secondary-button" type="button" data-action="request-command" data-command="Restart device">Restart</button><button class="secondary-button" type="button" data-action="request-command" data-command="Run diagnostic">Diagnose</button><button class="secondary-button" type="button" data-action="request-command" data-command="Push firmware update">Update</button></div></section>' +
    commandBox +
    '<section class="drawer-section"><h3>Recent activity</h3>' +
    recentActivity +
    "</section></div></aside>"
  );
}

function renderAlertDrawer(alert) {
  const device = deviceById(alert.deviceId);
  const actions =
    alert.status === "resolved"
      ? '<p>This alert is already resolved in the prototype state.</p>'
      : '<div class="action-grid" style="padding:12px 0 0"><button class="secondary-button" type="button" data-action="mark-in-progress" data-alert="' +
        alert.id +
        '">Mark in progress</button><button class="danger-button" type="button" data-action="resolve-alert" data-alert="' +
        alert.id +
        '">Resolve demo alert</button></div>';
  return (
    '<div class="drawer-scrim" data-action="close-drawer"></div>' +
    '<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">' +
    '<header class="drawer-head"><div><h2 id="drawer-title">' +
    escapeHtml(alert.title) +
    "</h2><p>" +
    escapeHtml(alert.id + " · " + device.name) +
    '</p></div><button class="icon-button" type="button" data-action="close-drawer" data-autofocus aria-label="Close alert review">×</button></header>' +
    '<div class="drawer-body"><section class="drawer-section"><h3>Severity and status</h3><p>' +
    statusBadge(alert.severity) +
    " " +
    statusBadge(alert.status) +
    "</p></section>" +
    '<section class="drawer-section"><h3>Operational context</h3><p>Device: ' +
    escapeHtml(device.name) +
    "<br />Site: " +
    escapeHtml(device.site) +
    "<br />Owner: " +
    escapeHtml(alert.owner) +
    "</p></section>" +
    '<section class="drawer-section"><h3>Response action</h3><p>These actions update only the local review state and make no external request.</p>' +
    actions +
    "</section>" +
    '<section class="drawer-section"><h3>Review reminder</h3><p>When a real product decision changes, create a tracked Issue or CR before revising upstream requirements, flow, or visual design.</p></section></div></aside>"
  );
}

function renderDrawer() {
  if (!state.drawer) {
    return "";
  }
  if (state.drawer.kind === "device") {
    const device = deviceById(state.drawer.id);
    return device ? renderDeviceDrawer(device) : "";
  }
  if (state.drawer.kind === "alert") {
    const alert = alertById(state.drawer.id);
    return alert ? renderAlertDrawer(alert) : "";
  }
  return "";
}

function renderScreen() {
  if (state.screen === "devices") {
    return renderDevices();
  }
  if (state.screen === "alerts") {
    return renderAlerts();
  }
  if (state.screen === "firmware") {
    return renderFirmware();
  }
  if (state.screen === "reports") {
    return renderReports();
  }
  if (state.screen === "settings") {
    return renderSettings();
  }
  return renderDashboard();
}

function applyShellState() {
  shell.classList.toggle("is-sidebar-collapsed", state.sidebarCollapsed);
  shell.classList.toggle("is-mobile-menu-open", state.mobileMenuOpen);
}

function render() {
  applyShellState();
  sidebar.innerHTML = renderSidebar();
  main.innerHTML = renderScreen() + renderDrawer();
  const autoFocus = document.querySelector("[data-autofocus]");
  if (autoFocus) {
    window.setTimeout(() => autoFocus.focus(), 0);
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 3400);
}

function openDrawer(kind, id) {
  lastFocusedElement = document.activeElement;
  state.drawer = { kind, id };
  state.mobileMenuOpen = false;
  state.pendingCommand = null;
  render();
}

function closeDrawer() {
  state.drawer = null;
  state.pendingCommand = null;
  render();
  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    window.setTimeout(() => lastFocusedElement.focus(), 0);
  }
}

function navigate(screen) {
  state.screen = screen;
  state.drawer = null;
  state.mobileMenuOpen = false;
  state.pendingCommand = null;
  render();
  main.focus();
}

function updateAlert(id, status) {
  state.alerts = state.alerts.map((alert) => {
    if (alert.id !== id) {
      return alert;
    }
    return {
      ...alert,
      owner: status === "in-progress" && alert.owner === "Unassigned" ? "Review team" : alert.owner,
      status,
    };
  });
}

function handleClick(event) {
  const deviceTarget = event.target.closest("[data-device]");
  if (deviceTarget) {
    openDrawer("device", deviceTarget.dataset.device);
    return;
  }

  const alertTarget = event.target.closest("[data-alert]");
  if (alertTarget && !event.target.closest("[data-action]")) {
    openDrawer("alert", alertTarget.dataset.alert);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }
  const action = actionTarget.dataset.action;

  if (action === "navigate") {
    navigate(actionTarget.dataset.screen);
    return;
  }
  if (action === "toggle-sidebar") {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    render();
    return;
  }
  if (action === "toggle-menu") {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    applyShellState();
    return;
  }
  if (action === "close-drawer") {
    closeDrawer();
    return;
  }
  if (action === "show-devices") {
    navigate("devices");
    return;
  }
  if (action === "show-alerts") {
    navigate("alerts");
    return;
  }
  if (action === "refresh") {
    showToast("Prototype dashboard refreshed. Data remains simulated.");
    return;
  }
  if (action === "request-command") {
    state.pendingCommand = actionTarget.dataset.command;
    render();
    return;
  }
  if (action === "cancel-command") {
    state.pendingCommand = null;
    render();
    return;
  }
  if (action === "confirm-command") {
    const command = state.pendingCommand;
    state.pendingCommand = null;
    render();
    showToast(command + " simulated. No live device command was sent.");
    return;
  }
  if (action === "mark-in-progress") {
    updateAlert(actionTarget.dataset.alert, "in-progress");
    render();
    showToast("Alert moved to in-progress in the local prototype.");
    return;
  }
  if (action === "resolve-alert") {
    updateAlert(actionTarget.dataset.alert, "resolved");
    closeDrawer();
    showToast("Alert resolved in local prototype state only.");
    return;
  }
  if (action === "new-campaign") {
    showToast("Campaign creation needs approved API, authorization, and audit integration.");
    return;
  }
  if (action === "inspect-campaign") {
    showToast("Campaign " + actionTarget.dataset.campaign + " is shown as prototype data.");
    return;
  }
  if (action === "export-report") {
    showToast("Report export is disabled until an approved data export path exists.");
  }
}

function handleInput(event) {
  const input = event.target.dataset.input;
  if (input === "device-query") {
    state.deviceQuery = event.target.value;
    render();
  }
}

function handleChange(event) {
  const input = event.target.dataset.input;
  if (input === "dashboard-site") {
    state.dashboardSite = event.target.value;
  } else if (input === "device-status") {
    state.deviceStatus = event.target.value;
  } else if (input === "device-site") {
    state.deviceSite = event.target.value;
  } else if (input === "device-group") {
    state.deviceGroup = event.target.value;
  } else if (input === "alert-severity") {
    state.alertSeverity = event.target.value;
  } else if (input === "alert-status") {
    state.alertStatus = event.target.value;
  } else {
    return;
  }
  render();
}

document.addEventListener("click", handleClick);
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (state.drawer) {
      closeDrawer();
    } else if (state.mobileMenuOpen) {
      state.mobileMenuOpen = false;
      applyShellState();
    }
  }
});

render();
