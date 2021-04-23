sap.ui.define(
	[],
	function () {
		"use strict";

		var SchedulerRenderer = {};

		SchedulerRenderer.render = function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			oRm.addClass("dhx_cal_container");
			oRm.writeClasses();
			oRm.write(">");
			// container start
			oRm.write("<div");
			oRm.addClass("dhx_cal_navline");
			oRm.writeClasses();
			oRm.write(">");
			// navline start

			oRm.write("<div");
			oRm.addClass("dhx_cal_prev_button");
			oRm.writeClasses();
			oRm.write("></div>");

			oRm.write("<div");
			oRm.addClass("dhx_cal_next_button");
			oRm.writeClasses();
			oRm.write("></div>");

			oRm.write("<div");
			oRm.addClass("dhx_cal_today_button");
			oRm.writeClasses();
			oRm.write("></div>");

			oRm.write("<div");
			oRm.addClass("dhx_cal_date");
			oRm.writeClasses();
			oRm.addStyle("color", "#CCE7F6");
			oRm.writeStyles();
			oRm.write("></div>");

			oRm.write('<div id="dhx_minical_icon"');
			oRm.addClass("dhx_minical_icon");
			oRm.writeClasses();
			oRm.write("></div>");

			// navline end
			oRm.write("</div>");
			// header
			oRm.write("<div");
			oRm.addClass("dhx_cal_header");
			oRm.writeClasses();
			oRm.write("></div>");
			// data
			oRm.write("<div");
			oRm.addClass("dhx_cal_data");
			oRm.writeClasses();
			oRm.write("></div>");
			// container end
			oRm.write("</div>");
		};

		return SchedulerRenderer;
	},
	/* bExport= */ true
);
