/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
sap.ui.define(
	[
		"sap/ui/core/Control",
		"sap/ui/core/Element",
		"./libs/dhtmlxscheduler",
		"./libs/ext/dhtmlxscheduler_limit",
		"./libs/ext/dhtmlxscheduler_timeline",
		"./libs/ext/dhtmlxscheduler_treetimeline",
		"./libs/ext/dhtmlxscheduler_tooltip",
		"./libs/ext/dhtmlxscheduler_minical",
		"./libs/ext/dhtmlxscheduler_collision",
	],
	function (Control, Element, library) {
		"use strict";

		var oSched = Control.extend("fw.Scheduler.Scheduler", {
			metadata: {
				library: "fw.Scheduler",
				properties: {
					width: { type: "string", group: "appearance", defaultValue: "100%" },

					height: { type: "string", group: "appearance", defaultValue: "100%" },

					defaultDate: {
						type: "string",
						group: "config",
						defaultValue: "%Y/%m/%d",
					},

					detailsOnCreate: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					dblclickCreate: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					dragCreate: { type: "boolean", group: "config", defaultValue: false },

					detailsOnDblclick: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					eventOnDblclick: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					eventDrag: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					beforeEventChanged: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					name: { type: "string", defaultValue: "timeline" },

					xUnit: { type: "string", defaultValue: "minute" },

					xDate: { type: "string", defaultValue: "%H:%i" },

					xStep: { type: "int", defaultValue: 60 },

					xSize: { type: "int", defaultValue: 24 },

					xStart: { type: "int", defaultValue: 7 },

					xLength: { type: "int", defaultValue: 24 },

					yUnit: { type: "object", defaultValue: undefined },

					yProperty: { type: "string", defaultValue: "headKey" },

					render: { type: "string", defaultValue: "bar" },

					secondScale: {
						type: "object",
						defaultValue: undefined, //{ x_unit: "day", x_date: "%m/%d" }
					},

					detail: { type: "object", defaultValue: undefined },
				},
				events: {
					dblClick: {
						parameters: {
							id: { type: "string" },
							e: { type: "object" },
						},
					},
				},
			},
			onAfterRendering: function () {
				scheduler.locale.labels.section_custom = "Section";
				// config
				this.setConfig();
				// create
				this.createTimeLine();
				// event
				this.onDataRender(); // 資料渲染
				this.miniCalCreate(); // 迷你日曆
				this.onDblClick(); // 雙擊
				this.onBeforeDrag(); // 拖拉(伸縮)
				this.onBeforeEventChanged(); // 事件發生前
				this.showLightbox();
				// init
				scheduler.init(this.getId(), new Date(), this.getName());
				// 更新Head
				this.updateCollection([{ key: 1, label: "James Smith" }]);
				// data render
				this.parse(this.getDetail());
			},
			setConfig: function () {
				scheduler.config.default_date = this.getDefaultDate();
				scheduler.config.details_on_create = this.getDetailsOnCreate();
				scheduler.config.dblclick_create = this.getDblclickCreate();
				scheduler.config.drag_create = this.getDragCreate();
				scheduler.config.details_on_dblclick = this.getDetailsOnDblclick();
				scheduler.config.lightbox.sections = [];
			},
			createTimeLine: function () {
				var scale = this.getSecondScale();

				if (!scale) {
					scale = {
						x_unit: "day",
						x_date: "%m/%d",
					};
				}

				scheduler.createTimelineView({
					name: this.getName(), // ID
					x_unit: this.getXUnit(), // X軸的單位
					x_date: this.getXDate(), // X軸的格式
					x_step: this.getXStep(), // 時間線區間(依照x_unit調整)
					x_size: this.getXSize(), // 畫面顯示長度
					x_start: this.getXStart(), // 起始時間
					x_length: this.getXLength(), // next button 滾動時間線長度
					y_unit: scheduler.serverList("section", this.getYUnit()), // 表頭數據
					y_property: this.getYProperty(), // 綁定Key
					render: this.getRender(),
					section_autoheight: false, // 自動高度
					second_scale: scale,
					dx: 220, // 表頭寬度
				});
			},
			miniCalCreate: function () {
				$("#dhx_minical_icon").click(function () {
					if (scheduler.isCalendarVisible()) {
						scheduler.destroyCalendar();
					} else {
						scheduler.renderCalendar({
							position: "dhx_minical_icon",
							date: scheduler.getState().date,
							navigation: true,
							handler: function (date, calendar) {
								scheduler.setCurrentView(date);
								scheduler.destroyCalendar();
							},
						});
					}
				});
			},
			onDataRender: function () {
				var id = this.getId();
				scheduler.attachEvent("onDataRender", function () {
					var title = $("#" + id)
						.children("div.dhx_cal_navline")
						.children(".dhx_cal_date");
					var showText = title.text();
					if (showText.includes("–")) {
						title.text(showText.split("–")[0].replace(/\s*/g, ""));
					}
				});
			},
			showLightbox: function () {
				scheduler.attachEvent("onBeforeLightbox", function (id) {
					//any custom logic here
					return false;
				});
				// scheduler.showLightbox = function (id) {};
			},
			onDblClick: function () {
				var that = this;
				scheduler.attachEvent("onDblClick", function (id, e) {
					that.fireDblClick({ id: id, e: e });
					return that.getEventOnDblclick();
				});
			},
			onBeforeDrag: function () {
				var that = this;
				scheduler.attachEvent("onBeforeDrag", function (id, mode, e) {
					return that.getEventDrag();
				});
			},
			onBeforeEventChanged: function () {
				var that = this;
				scheduler.attachEvent(
					"onBeforeEventChanged",
					function (ev, e, is_new, original) {
						//any custom logic here
						return that.getBeforeEventChanged();
					}
				);
			},
			updateCollection: function (data) {
				scheduler.updateCollection("section", data);
				return this;
			},
			parse: function (data) {
				scheduler.parse(data);
				return this;
			},
			setCurrentView: function (date, name) {
				if (date && name) {
					scheduler.setCurrentView(date, name);
				} else {
					scheduler.setCurrentView();
				}
			},
		});

		return oSched;
	}
);
