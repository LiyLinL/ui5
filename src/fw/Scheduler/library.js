sap.ui.define(
	[
		"sap/ui/core/Core",
		"sap/ui/core/library",
		"./libs/dhtmlxscheduler",
		"./libs/ext/dhtmlxscheduler_limit",
		"./libs/ext/dhtmlxscheduler_timeline",
		"./libs/ext/dhtmlxscheduler_treetimeline",
		"./libs/ext/dhtmlxscheduler_tooltip",
		"./libs/ext/dhtmlxscheduler_minical",
		"./libs/ext/dhtmlxscheduler_collision",
	],
	function (Cores, library) {
		"use strict";

		sap.ui.getCore().initLibrary({
			name: "fw.Scheduler",
			version: "${version}",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			noLibraryCSS: false,
			controls: ["fw.Scheduler.Scheduler"],
			elements: [],
		});

		return fw.Scheduler;
	}
);
