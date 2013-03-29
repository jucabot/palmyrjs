function add_filter(name,code) {
	$('#add-filter-modal').modal('hide');
	$('.filter-item:last').after('<li class="filter-item"><span><a href="#" onclick="select_filter("' +  name +'"); return false;">' + name + '</a> <i class="icon-remove"></i></span></li>');
	$('#filter-info').html('<div class="alert alert-info"><strong>Filter : ' + name + '</strong><br/><code>' + code + '</code><button class="pull-right btn btn-mini btn-info" onclick="clear_filter();">Clear filter</button></div>');
	current_filter = code;
	current_filter_name = name;
}

function select_filter(name,code) {

	ftcmd.select_filter(name, function (name,code) {
			$('#filter-info').html('<div class="alert alert-info"><strong>Filter : ' + name + '</strong><button class="pull-right btn btn-mini btn-info" onclick="clear_filter();">Clear filter</button><br/><br/><pre>' + code + '</pre></div>');
			current_filter = code;
			current_filter_name = name;
		 });
}

function clear_filter() {

	ftcmd.clear_filter(function () {
			$('#filter-info').html('');
			current_filter = undefined;
			current_filter_name = undefined;
		 });
}
