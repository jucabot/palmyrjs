function add_filter(name,code) {
	$('#add-filter-modal').modal('hide');
	$('.filter-item:last').after('<li class="filter-item"><span><a href="#" onclick="select_filter("' +  name +'"); return false;">' + name + '</a> <i class="icon-remove"></i></span></li>');
	$('#filter-info').html('<div class="alert alert-info"><strong>Filtre : ' + name + '</strong><br/><pre>' + code + '</pre><button class="pull-right btn btn-mini btn-info" onclick="clear_filter();">Retirer le filtre</button></div>');
	current_filter = code;
	current_filter_name = name;
}

function select_filter(name,code) {

	ftcmd.select_filter(name, function (name,code) {
			$('#filter-info').html('<div class="alert alert-info"><strong>Filtre : ' + name + '</strong><button class="pull-right btn btn-mini btn-info" onclick="clear_filter();">Clear filter</button><br/><br/><pre>' + code + '</pre></div>');
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
