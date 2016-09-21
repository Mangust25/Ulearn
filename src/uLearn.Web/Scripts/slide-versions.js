﻿function updateExerciseVersionUrl(versionId) {
	var newSearch = $.query.set('version', versionId).toString();
	var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + newSearch;
	if (history.pushState)
		window.history.pushState({ path: newurl }, '', newurl);
}

function setExerciseVersion(versionId) {
	var url = $('.exercise__submission').data('version-update-url');
	url = url.replace('VERSION_ID', versionId);

	saveExerciseCodeDraft();

	$.get(url, function(data) {
		var $submission = $('.exercise__submission');
		$submission.html($(data).html());
		initCodeEditor($submission);
		selectSetAutoWidth($submission.find('.select-auto-width'));
		setAutoUpdater($submission.find('.js__auto-update'));
		refreshPreviousDraft();

		updateExerciseVersionUrl(versionId);
	});
}

$(document).ready(function () {
	$('.exercise__submission').on('click', '.exercise-version-link', function (e) {
		e.preventDefault();

		var $self = $(this);
		var versionId = $self.data('version-id');
		setExerciseVersion(versionId);
	});

	$('.exercise__submission').on('change', '[name=version]', function() {
		var $self = $(this);
		setExerciseVersion($self.val());
	});
});