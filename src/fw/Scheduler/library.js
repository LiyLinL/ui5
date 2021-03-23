sap.ui.define(
	["sap/ui/core/Core", "sap/ui/core/library"],
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
