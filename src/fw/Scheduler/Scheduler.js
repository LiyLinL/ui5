/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
sap.ui.define(
	["sap/ui/core/Control", "sap/ui/core/Element", "./library"],
	function (Control, Element, library) {
		"use strict";

		var oSched = Control.extend("fw.Scheduler.Scheduler", {
			metadata: {
				library: "fw.Scheduler",
				__Instance: undefined,
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

					beforeLightbox: {
						type: "boolean",
						group: "config",
						defaultValue: false,
					},

					beforeTodayDisplayed: {
						type: "boolean",
						group: "config",
						defaultValue: true,
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

					lightBoxSections: { type: "object", defaultValue: [] },
				},
				events: {
					onDblClick: {
						parameters: {
							id: { type: "string" },
							e: { type: "object" },
						},
					},
					onViewChange: {
						parameters: {
							new_mode: { type: "string" },
							new_date: { type: "object" },
						},
					},
					onDataRender: { parameters: {} },
					onBeforeLightbox: {
						parameters: {
							id: { type: "string" },
						},
					},
					onBeforeDrag: {
						parameters: {
							id: { type: "string" },
							mode: { type: "string" },
							e: { type: "Event" },
						},
					},
					onBeforeEventChanged: {
						parameters: {
							ev: { type: "object" },
							e: { type: "Event" },
							is_new: { type: "boolean" },
							original: { type: "object" },
						},
					},
					onBeforeTodayDisplayed: { parameters: {} },
					showLightbox: {
						parameters: { id: { type: "string" } },
					},
					onPickCalDate: {
						parameters: {
							date: { type: "date" },
						},
					},
				},
			},
			init: function () {
				var windowHeight = window.innerHeight - 100;
				this.setProperty("height", windowHeight + "px");
			},
			onAfterRendering: function (e) {
				scheduler.locale.labels.section_custom = "Section";

				// config
				this.setConfig();

				// create
				if (scheduler.getView(this.getName()) == null) {
					this.createTimeLine();

					// event
					this.onDblClick(); // 雙擊
					this.onViewChange();
					this.onDataRender(); // 資料渲染
					this.onBeforeLightbox();
					this.onBeforeDrag(); // 拖拉(伸縮)
					this.onBeforeEventChanged(); // 事件發生前
					this.onBeforeTodayDisplayed();
					this.showLightbox();
				}

				this.miniCalCreate(); // 迷你日曆

				var id = this.getId();
				var name = this.getName();
				// init
				scheduler.init(this.getId(), new Date(), this.getName());
				// 清除原有資料
				scheduler.clearAll();
				// 更新Head
				this.updateCollection(this.getYUnit());
				// data render
				this.parse(this.getDetail());
			},
			setConfig: function () {
				scheduler.config.default_date = this.getDefaultDate();
				scheduler.config.details_on_create = this.getDetailsOnCreate();
				scheduler.config.dblclick_create = this.getDblclickCreate();
				scheduler.config.drag_create = this.getDragCreate();
				scheduler.config.details_on_dblclick = this.getDetailsOnDblclick();
				scheduler.config.lightbox.sections = this.getLightBoxSections();
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
				var that = this;

				$("#dhx_minical_icon").click(function () {
					if (scheduler.isCalendarVisible()) {
						scheduler.destroyCalendar();
					} else {
						scheduler.renderCalendar({
							position: "dhx_minical_icon",
							date: scheduler.getState().date,
							navigation: true,
							handler: function (date, calendar) {
								that.fireOnPickCalDate({ date: date });
								scheduler.setCurrentView(date);
								scheduler.destroyCalendar();
							},
						});
					}
				});
			},
			// event
			onViewChange: function () {
				var that = this;

				scheduler.attachEvent("onViewChange", function (new_mode, new_date) {
					that.fireOnViewChange({ new_mode: new_mode, new_date: new_date });
				});
			},
			onDataRender: function () {
				var that = this,
					id = this.getId();

				scheduler.attachEvent("onDataRender", function () {
					var title = $("#" + id)
						.children("div.dhx_cal_navline")
						.children(".dhx_cal_date");
					var showText = title.text();
					if (showText.includes("–")) {
						title.text(showText.split("–")[0].replace(/\s*/g, ""));
					}

					that.fireOnDataRender();
				});
			},
			onBeforeLightbox: function () {
				var that = this;

				scheduler.attachEvent("onBeforeLightbox", function (id) {
					that.fireOnBeforeLightbox({ id: id });
					return that.getBeforeLightbox();
				});
			},
			onDblClick: function () {
				var that = this;

				scheduler.attachEvent("onDblClick", function (id, e) {
					that.fireOnDblClick({ id: id, e: e });
					return that.getEventOnDblclick();
				});
			},
			onBeforeDrag: function () {
				var that = this;

				scheduler.attachEvent("onBeforeDrag", function (id, mode, e) {
					that.fireOnBeforeDrag({
						id: id,
						mode: mode,
						e: e,
					});
					return that.getEventDrag();
				});
			},
			onBeforeEventChanged: function () {
				var that = this;

				scheduler.attachEvent(
					"onBeforeEventChanged",
					function (ev, e, is_new, original) {
						that.fireOnBeforeEventChanged({
							ev: ev,
							e: e,
							is_new: is_new,
							original: original,
						});
						return that.getBeforeEventChanged();
					}
				);
			},
			onBeforeTodayDisplayed: function () {
				var that = this;

				scheduler.attachEvent("onBeforeTodayDisplayed", function () {
					that.fireOnBeforeTodayDisplayed();
					return that.getBeforeTodayDisplayed();
				});
			},
			// method
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
			deleteMarkedTimespan: function (date) {
				if (date) {
					scheduler.deleteMarkedTimespan(date);
				} else {
					scheduler.deleteMarkedTimespan();
				}
			},
			addMarkedTimespan: function (obj) {
				scheduler.addMarkedTimespan(obj);
				return this;
			},
			showLightbox: function () {
				scheduler.showLightbox = function (id) {};
			},
		});

		return oSched;
	}
);
