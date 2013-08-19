define([], function(){
	return {
        "category": "basics",
		"drop": { "mode": "palette", "src": "edit.html" },
		"edit": { "mode": "palette", "src": "edit.html" },
		"icon": "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",
		"key": "html",
		"lang": {
			"en-US": {
				"_description": "Html",
				"_name": "Html"
			}
		},
		"version": "0.0.1",
		"viewTypes": ["*"]
	};
});



