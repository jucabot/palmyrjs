Array.prototype.removeIndex = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
Array.prototype.remove = function(item) {
	var i = this.indexOf(item);
	if (i >= 0) {
		return this.removeIndex(i);
	}
	else {
		return this;
	}
};

function capFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function limit_size(text,limit) {
	
	if (text.length > limit) {
		text = text.substring(0,limit-3) + '...';
	}
	return text;
	
}
function translate_status(status) {
	var text = status;
	if (status == 'success') {
		text = "Succ&egrave;s";
	}
	else if (status == 'error') {
		text = "Erreur";
	}

	
	return capFirstLetter(text);
}

function formatZeroNumber(num) {
	
	if (num < 10) {
		return '0' + num;
	}
	else {
		return num + '';
	}
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function stack_list(list) {
	var stacked_list = [];
	for (var i=0;i<list.length;i++)
	{
		var stack = list[i] + (i>0 ? stacked_list[i-1] : 0.0);
		stacked_list.push(stack);
	}
	return stacked_list;
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function serie_std(serie)
{
	var mean = 0;
	var count = 0;
	var total = 0;
	var std_serie = [];
	var std = 0;

	jQuery.each(serie, function(i, item) {
		count += 1;
		total += item[1];
	});
	
	mean = total/(count*1.0);
	
	$.each(serie, function(i, item) {
		
		std += Math.pow(item[1] - mean,2);
	});
	
	std = Math.sqrt(std/(count-1)*1.0);
	
	$.each(serie, function(i, item) {
		
		std_serie.push([item[0], (item[1]-mean)/std] );
	});
	
	
	return std_serie;

}

function lag_timeserie(serie,month_lag) {
	
    $.each(serie, function (i,item) {
    	date = new Date(item[0]);
        
        if (date != null) {
            
        	if (date.getMonth()*1+1 - month_lag > 0) {
        		item[0] = date.getFullYear() + '-' + formatZeroNumber(date.getMonth()*1+1 - month_lag) + '-' + formatZeroNumber(date.getDate());
        	}
        	else {
        		delta_year = Math.abs(Math.floor((date.getMonth()+1 - month_lag)/12));
        		if ((date.getMonth()+1 - month_lag) == 0) {
        			delta_month = 1;
        		}
        		else {
        			delta_month = 12 - Math.abs(date.getMonth()+1 - month_lag)%12;
        		}
        		item[0] = (date.getFullYear()-delta_year) + '-' + formatZeroNumber(delta_month) + '-' + formatZeroNumber(date.getDate());
        	}
            
        }
    });
    return serie;
	
}

function convert_dict_to_tuples(dictionary)
{
	var serie = [];
	
	for (var key in dictionary)
	{
		
		serie.push([key, dictionary[key]]);
	}
	return serie;
}

function Template(template_id) {

	this.template_id = template_id;
	this.template_function;
	
	this.init = function() {
		this.template_function = doT.template($(this.template_id).text());
	};
	
	this.apply = function (id,data) {
		$(id).html(this.template_function(data));
	}
	
	
	this.init();

}

function Slider()
{
	
	
	this.slides = [];
	this.current = 0;
	
	this.init = function() {

	}
	
	this.add_slide = function (id) {
	
		this.slides.push(id);
		
	};
	
	this.start = function () {
		this.hide_all();
		this.show(this.slides[0]);
		
	};
	
	this.show = function (id) {
		this.hide_all();
		$(id).show();
		this.current = this.slides.indexOf(id);
		
		
	};
	
	this.hide_all = function () {
		$.each(this.slides,function (index,value) { $(value).hide(); });
	};
	
	
	this.next = function (callback) {
		var self = this;
		$(this.slides[this.current]).hide("slide",{direction:'left'}, function () {self._show_next();});
		
	};
	
	this._show_next = function() {
		
		var next_index = (this.current + 1) % this.slides.length;
		$(this.slides[next_index]).show("slide",{direction:'right'});
		this.current = next_index;
	};
	
	this.previous = function () {
		var self = this;
		$(this.slides[this.current]).hide("slide",{direction:'right'}, function() {self._hide_previous();});
		
	};
	
	this._hide_previous = function() {
		var next_index = (this.current-1) % this.slides.length;
		$(this.slides[next_index]).show("slide",{direction:'left'});
		this.current = next_index;
	};
	
	this.has_slide = function(id) {
		return this.slides.indexOf(id) > 0;
	}


	this.init();
}




function set_message(status,message) {
	$('#message').html('<div class="alert alert-' + status + '"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>' + translate_status(status) + '!</strong><br/>' + message + '</div>');
	
}
function reset_message() {
	$('#message').html('');
	
}

function Command(api_url)
{
	this.url = api_url;
	
	this.init = function() {

	}
	
	this._call_api = function (data, done) {
		$("body").css("cursor", "progress");
		return $.getJSON(
			this.url,
			data,
			function(data) {
				if (data.status == 'success' && done != null) {
					done(data);
					$('#message').html('');
				}
				
				if (typeof data.message != "undefined" && data.message != '') {
					$('#message').html('<div class="alert alert-' + data.status + '"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>' + translate_status(data.status) + '!</strong><br/>' + data.message + '</div>');
				}
				$("body").css("cursor", "auto");
			});

	}
	
	this.list_data_files = function (path, done) {
		var cmd = 'list-data-files';
		this._call_api(
			{ 'cmd':cmd, 'path': path},
			function(response) {
				done(response.directories,response.files);
			});
		
	}
	
	this.init();

}
function SearchCommand(api_url)
{
	this.url = api_url;
	
	this.init = function() {

	}
	
	this._call_api = function (data, done) {
		$("body").css("cursor", "progress");
		return $.getJSON(
			this.url,
			data,
			function(data) {
				if (data.status == 'success' && done != null) {
					done(data);
					$('#message').html('');
				}
				
				if (typeof data.message != "undefined" && data.message != '') {
					$('#message').html('<div class="alert alert-' + data.status + '"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>' + translate_status(data.status) + '!</strong><br/>' + data.message + '</div>');
				}
				$("body").css("cursor", "auto");
			});

	}
	
	this.search = function (query,from, done) {
		var cmd = 'search';
		this._call_api(
			{ 'cmd':cmd, 'query': query, 'from':from},
			function(response) {
				done(response.type,response.data,response.query,{total:response.total,took:response.took,from:response.es_from});
			});
		
	}
	
	this.correlate = function (query,serie_data,filters,done) {
		var cmd = 'correlate';
		this._call_api(
			{ 'cmd':cmd, 'query': query,'filters':filters},
			function(response) {
				done(response.data,response.took);
			});
		
	}
	
	this.open_workspace = function (serie_id,name,done) {
		var cmd = 'open-workspace';
		this._call_api(
			{ 'cmd':cmd, 'serie_id': serie_id,'name':name},
			function(response) {
				done(response.id,response.serie_id,response.name,response.data,response.options);
			});
		
	}
	
	
	this.remove_workspace = function (id,done) {
		var cmd = 'remove-workspace';
		this._call_api(
			{ 'cmd':cmd, 'id': id},
			function(response) {
				done();
			});
		
	}
	
	this.save_workspace = function (id,workspace,done) {
		var cmd = 'save-workspace';
		this._call_api(
			{ 'cmd':cmd, 'id': id, 'options': JSON.stringify(workspace.options)},
			function(response) {
				done();
			});
		
	}
	
	this.get_workspaces = function (done) {
		var cmd = 'get-workspaces';
		this._call_api(
			{ 'cmd':cmd, },
			function(response) {
				done(response.workspaces);
			});
		
	}

	this.init();
}


function FeatureTableCommand(api_url,ftable_name)
{
	this.url = api_url;
	this.ftable_name = ftable_name;
	
	this.init = function() {

	}
	
	this._call_api = function (data, done) {
		$("body").css("cursor", "progress");
		return $.getJSON(
			this.url,
			data,
			function(data) {
				if (data.status == 'success' && done != null) {
					done(data);
					$('#message').html('');
				}
				if (typeof data.message != "undefined" && data.message != '') {
					$('#message').html('<div class="alert alert-' + data.status + '"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>' + translate_status(data.status) + '!</strong><br/>' + data.message + '</div>');
				}
				$("body").css("cursor", "auto");
			});

	}

	this.get_featureset = function (done) {
		var cmd = 'get-featureset';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd },
			function(response) {
					done(response.data);
			});
	}
	
	

	this.set_class = function (fname,is_class,done) {
		var cmd = 'set-class';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'feature_name': fname, 'cmd' : cmd, 'is_class': is_class },
			function(response) {
					done();
			});
	}


	this.get_distribution_function = function(fname,draw_func) {
	
		var cmd = 'get-distribution-function';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'feature_name': fname, 'cmd' : cmd },
			function(response) {
					draw_func(fname,response.data);
			});
	
	}
	
	
	
	this.add_feature = function(name,type,code,done) {
	
		var cmd = 'add-feature';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name':name, 'type':type,'code':code },
			function(response) {
					done();
			});
	}
	
	this.get_feature = function(name,done) {
	
		var cmd = 'get-feature';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name':name },
			function(response) {
					done(response.feature);
			});
	}
	this.edit_feature = function(name,virtual_function_code,default_function_code,done) {
	
		var cmd = 'edit-feature';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name':name,'virtual_function_code':virtual_function_code,'default_function_code':default_function_code },
			function(response) {
					done();
			});
	}
	this.remove_feature = function(name,done) {
	
		var cmd = 'remove-feature';
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name':name },
			function(response) {
					done();
			});
	}
	
	this.save = function (filename) {
		var cmd = 'save';
		
		if (filename == '')  {
			this._call_api(
				{ 'ftable' : this.ftable_name, 'cmd' : cmd });
		}
		else {
			this._call_api(
				{ 'ftable' : this.ftable_name, 'filename': filename, 'cmd' : cmd });
		}
	}
	
	
	
	
	
	this.nl_query = function (query,filter,filter_name,done) {
		var cmd = 'nl-query';
		
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'query': query, 'filter':filter, 'filter_name':filter_name },
			function(response) {
					done(response.type,response.data,response.query);
			});
		
	}
	
	this.add_filter = function (name,code,done) {
		var cmd = 'add-filter';
		
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name': name, 'code':code },
			function(response) {
					done(name,code);
			});
		
	}

	this.select_filter = function (name,done) {
		var cmd = 'select-filter';
		
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name': name },
			function(response) {
					done(name,response.data);
			});
		
	}
	
	this.clear_filter = function (done) {
		var cmd = 'clear-filter';
		
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd },
			function(response) {
					done();
			});
		
	}
	
	this.remove_filter = function (name,done) {
		var cmd = 'remove-filter';
		
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'name':name },
			function(response) {
					done();
			});
		
	}
	
	
	
	this.index_query = function (query, filter, done) {
		var cmd = 'index-query';
		
		this._call_api(
			{ 'ftable' : this.ftable_name, 'cmd' : cmd, 'query': query,'filter':filter },
			function(response) {
					done(response.id);
			});
		
	}
	
	
	
	this.init();

}


function remove_serie(id, result_hook) {
	
	queries.splice(queries.indexOf(id),1);
	$("#" + result_hook).remove();
	
}

function draw_result(id,type,data,query,result_hook) {
	
	var drawing = null;
	
	$('#' + result_hook)[0].style.marginLeft = 0;
	
	if (type == 'table') {
		drawing = draw_table('',data,result_hook,'');
	}
	else if (type == 'box-plot') {
		
		drawing = draw_box_plot('',data,result_hook);
	}
	else if (type == 'stacked-bar') {
		drawing = draw_percent_stacked_bar('',data,result_hook,query,'');
		
	}
	else if (type == 'scatter') {
		drawing = draw_scatter('',data,result_hook,query,'');
	}
	else if (type == 'pie') {
		drawing = draw_pie('',data,result_hook,query);
	}
	else if (type == 'bar') {
		drawing = draw_bar('',data,result_hook,query,'');
	}
	else if (type == 'wordcloud') {
		drawing = draw_wordcloud('',data,result_hook,query);
	}
	else if (type == 'timeline') {
		
		if (typeof current_workspace != "undefined") {
			if (current_workspace != null) {
		
				if (current_workspace.serie_id != id) {
					var current_workspace_data = current_workspace.data;
					data.series.push(current_workspace_data.series[0]);
				}
			}
		}
		drawing = draw_timeline('',data,result_hook,query);
	}
	else {
		$('#result').html('Oops! Il n\'y a pas de visualisation pour cette requête');
		return;
	}
	
	
	$('#' + result_hook).prepend('<div class="pull-right" id="btn-box-' + result_hook +  '"><a href="#" title="Exporter" onclick="$(\'#' +result_hook+'\').highcharts().exportChart();return false;"><i class="icon-picture"></i></a><a href="#" title="Retirer" onclick="remove_serie(\'' + id + '\',\'' +result_hook+'\');return false;"><i class="icon-remove"></i></a></div>');
	return drawing;

}

function draw_pie(name,data,render_to,title) {
	var chart;
		
	var options;
	
	options = {
		chart: {
			renderTo: render_to,
			height: 400,
		},
		credits: {
			enabled: false
		},
		title: {
			text: title,
			x: -20 //center
		},
		navigation: {
            buttonOptions: {
                enabled: false
            }
		},
	    plotOptions: {
	                pie: {
	                    
	                    dataLabels: {
	                        enabled: true,
	                        color: '#000000',
	                        connectorColor: '#000000',
	                        formatter: function() {
	                            return '<b>' + name + ' ' + this.key +'</b> : (' + roundNumber(this.percentage,1) + '%)' ;
	                        }
	                    }
	                }
	    },
		series: [
			{
				type: 'pie',
				name: title,
			  	data : [],
			  	
			 }
		]
		
	};

	var x = [];
	
	for (var i=0; i<data.categories.length; i++) {
		
		x.push([String(data.categories[i]),data.series[0].data[i]]);
	}
	
	options.series[0].data = x.sort(function(a,b) {return a[1]-b[1];}).reverse();
	
	chart = new Highcharts.Chart(options);
	

}

function draw_bar(name,data,render_to,title,yTitle,min,show_label) {
	var chart;
	
	var options;
	
	show_label = typeof show_label !== 'undefined' ? show_label : false;
	min = typeof min !== 'undefined' ? min : 0;
	
	options = {
		chart: {
			renderTo: render_to,
			type: 'column',
			zoomType: 'x',
			height : 400,
		},
		credits: {
			enabled: false
		},
		navigation: {
            buttonOptions: {
                enabled: false
            }
		},
		title: {
			text: title,
			x: -20 //center
		},
		xAxis: {
			categories: [],
			labels: {
          		enabled: true,
          		rotation: -45,
          		align: 'right',          
            },
		},
		yAxis: {
				min : min,
                title: {
                    text: yTitle,
                },
                minorTickInterval: 1.0,
        },
		tooltip: {
            formatter: function() {
                return '<b>'+ name + ' ' + this.x +'</b> : '+ this.y;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        legend: {
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                shadow: true
            },
        series: [],
	
	};
	
	options.xAxis.categories = data.categories;
	options.series = data.series;
	
	chart = new Highcharts.Chart(options);

}

function draw_percent_stacked_bar(name,data,render_to,title,yTitle,min,show_label) {
	var chart;
	
	var options;
	
	show_label = typeof show_label !== 'undefined' ? show_label : false;
	min = typeof min !== 'undefined' ? min : 0;
	
	options = {
		chart: {
			renderTo: render_to,
			type: 'column',
			zoomType: 'x',
			height : 400,
		},
		credits: {
			enabled: false
		},
		navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	    },
		title: {
			text: title,
			x: -20 //center
		},
		xAxis: {
			categories: [],
			labels: {
          		enabled: true,
          		rotation: -45,
          		align: 'right',          
            },
            title: {
                    text: data.label_x,
                },
		},
		yAxis: {
				min : min,
                title: {
                    text: 'Distribution of ' + data.label_y,
                },
                minorTickInterval: 1.0,
        },
		tooltip: {
            formatter: function() {
                return '<b>'+ name + ' ' + this.series.name +'</b> : '+ Math.round(this.percentage,2)  +'%';
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                stacking: 'percent'
                
            }
        },
        legend: {
                layout: 'horizontal',
                backgroundColor: '#FFFFFF',
                align: 'center',
               
                
                shadow: true
            },
        series: [],
	
	};
	
	options.xAxis.categories = data.categories;
	options.series = data.series;
	
	chart = new Highcharts.Chart(options);

}


function draw_wordcloud(name,data,render_to,query) {

	if (typeof data.description != 'undefined')
		$('#' + render_to).html('<p class="text-center lead">' + query + '</p>');
	
	var fill = d3.scale.category20b();
	var w = 470;
	var h = 400;
	var max_words = 100;
	var scale_factor = 128; //100% --> font size
	
	
	function fade(opacity,text) {
	   
	     d3.selectAll(".word")
	         .filter(function(d) {
	           return d.text != text;
	         })
	       .transition()
	         .style("opacity", opacity);
	   
	}
	
	function text(d) {
		return d.text;
	}

	var words_data = [], word_dict= {} ;
	
	var max_size = 0;
	
	$.each(data.categories, function(i) {
		max_size =  Math.max(max_size,data.series[0].data[i]);
				
								
	});
	
	$.each(data.categories, function(i) {
		word = {text: data.categories[i], size: data.series[0].data[i]* scale_factor/max_size};
				
		words_data.push(word);
								
	});
	
	
	d3.layout.cloud().size([w, h])
	      .words(words_data)
	      .rotate(function() { return ~~(Math.random() * 2) * 90; })
	      .fontSize(function(d) { return d.size; })
	      .on("end", draw)
	      .start();
	
	
	 function draw(words) {
    	d3.select("#" + render_to).append("svg")
	        .attr("width",w )
	        .attr("height", h)
	      .append("g")
	        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")")
	      .selectAll("text")
	        .data(words)
	      .enter().append("text")
	        .style("font-size", function(d) { return d.size + "px"; })
	        .style("cursor","pointer")
	        .style("fill", function(d) { return fill(d.text); })
	        .attr("class","word")
	        .attr("text-anchor", "middle")
	        .attr("transform", function(d) {
	          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	        })
	        .text(function(d) { return d.text; })
	        .on("mouseout", function(d) {
	        	fade(1,d.text);
	        	})
	        .on("mouseover", function(d) {
	        	fade(.1,d.text);
	        	
	        	})
	        ;
	  }
	  
	  
}

function draw_table(name,data,render_to,title) {

	var html = '';
	html += '<table class="table table-condensed">';
	html += '<thead><tr>';
	$.each(data.features,function (i) {
		html += '<th>' +  data.features[i] + '</th>';
	});
	html += '</tr></thead>';
	
	
	$.each(data.rows,function (i) {
		html += '<tr>';
		$.each(data.rows[i],function (j) {
			
			html += '<td>' + data.rows[i][j] + '</td>';
			
			});
			html += '</tr>';
		});
		
		
	html += '</table>';
	
	var query = '';
	html += '<div class="pagination">';
  	html += '<ul>';
  	if (data.has_prev) {
  		query = '(num_page:' + (data.page_num - 1) + ')';

  		html += '<li><a href="#top" onclick="ftcmd.nl_query(\'' + query + '\',current_filter,current_filter_name, display_result);">&laquo;</a></li>'
  	}
    $.each(data.list_pages,function (i) {
    	var num_page = 0;
    	num_page = data.list_pages[i]+1;
    	query = '(num_page:' + i + ')';
    	if (i == data.page_num) {
	    	html += '<li class="active"><a href="#top" onclick="ftcmd.nl_query(\'' + query + '\',current_filter,current_filter_name, display_result);">' + num_page + '</a></li>'
	    }
	    else {
	    	html += '<li><a href="#top" onclick="ftcmd.nl_query(\'' + query + '\',current_filter,current_filter_name, display_result);">' + num_page + '</a></li>'
	    }
    });
  	if (data.has_next) {
  		query = '(num_page:' + (data.page_num + 1) + ')';
  		html += '<li><a href="#top" onclick="ftcmd.nl_query(\'' + query + '\',current_filter,current_filter_name, display_result);">&raquo;</a></li>'
  	}

    html += '</ul>';
	html += '<div class="pull-right">';
	html += 'page ' + (data.page_num + 1) +'/' + data.page_total;
	html += '&nbsp; total rows ' + data.num_rows + '/' + data.num_total_rows;
	html += '</div>';
	html += '</div><br/>';
	
	$('#'+render_to).html(html);
	
}

function draw_scatter(name,data,render_to,title,xTitle,yTitle,show_label) {
	var chart;
	
	var options;
	
	show_label = typeof show_label !== 'undefined' ? show_label : false;
	
	
	options = {
		chart: {
			renderTo: render_to,
			type: 'scatter',
            zoomType: 'xy',
            height : 400,
		},
		credits: {
			enabled: false
		},
		navigation: {
            buttonOptions: {
                enabled: false
            }
		},
		title: {
			text: title,
			x: -20 //center
		},
		xAxis: {
			title: {
                    enabled: true,
                    text: data.label_x
                },
	        
		},
		yAxis: {
				
                title: {
                    text: data.label_y,
                },
                
        },
		tooltip: {
            formatter: function() {
                return  data.label_x + ' = ' + this.x +' : ' + data.label_y + ' = ' + this.y;
            }
        },
        plotOptions: {
            scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        },
                        
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    }
                }
        },
       
        series: [],
	
	};
	data.series[0]['color'] = 'rgba(68,136,187,0.5)';
	options.series = data.series; 
	
	
	
	chart = new Highcharts.Chart(options);

}

function draw_box_plot(name,data,render_to,title)
{
	var options = {
			chart: {
		        type: 'boxplot',
		        renderTo: render_to,
		        zoomType:'xy',
		        height : 400,
		    },
		    
		    title: {
		        text: 'Distribution of ' + data.label_y + ' by ' + data.label_x
		    },
		    credits: {
		        enabled: false
		    },
		    navigation: {
	            buttonOptions: {
	                enabled: false
	            }
		    },
		    legend: {
		        enabled: false
		    },
		
		    
		    xAxis: {
		        categories: data.categories,
		        title: {
		            text: data.label_x
		        }
		    },
		    
		    yAxis: {
		        title: {
		            text: data.label_y
		        },
		        
		        
		    },
		
		    series: [{
		        name: data.label_y,
		        data: data.series,
		        tooltip: {
		            headerFormat: '<em>' + data.label_y + ' {point.key}</em><br/>'
		        }
		    },
		    
		    /* {
		        name: 'Outlier',
		        color: Highcharts.getOptions().colors[0],
		        type: 'scatter',
		        data: [ // x, y positions where 0 is the first category
		            [0, 644],
		            [4, 718],
		            [4, 951],
		            [4, 969]
		        ],
		        marker: {
		            fillColor: 'white',
		            lineWidth: 1,
		            lineColor: Highcharts.getOptions().colors[0]
		        },
		        tooltip: {
		            pointFormat: 'Observation: {point.y}'
		        }
		    }
		    */
		    ]
	
		};

	var chart = new Highcharts.Chart(options);
}

function draw_timeline(name,data,render_to,title) {
	var chart;
	
	var options;
	
	
	options = {
		chart: {
			renderTo: render_to,
			type: 'spline',
            zoomType: 'x',
            height : 400,
		},
		credits: {
			enabled: false
		},
		navigation: {
            buttonOptions: {
                enabled: false
            }
		},
		title: {
			text: title,
			
		},
		subtitle: {
			text:  ''
			
		},

		xAxis: {
			title: {
                    enabled: true,
                    text: data.label_x
                },
	        type: 'datetime',
	        dateTimeLabelFormats: {
	        	day: '%d/%m/%Y',
                month: '%b %Y',
                year: '%Y'
            },
	        
		},
		yAxis: {
				
                title: {
                    text: data.label_y,
                },
             
        },
		tooltip: {
			formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                Highcharts.dateFormat('%Y-%m-%d', this.x) +': '+ this.y;
			}
        },
        
       
        series: [],
	
	};
	
	var series = [];
	
	for (var i=0;i<data.series.length;i++)
	{
		serie = data.series[i];
		series.push({ 'name' : serie.name, 'data' : parse_dateserie(serie.data)});
		
		if (data.series.length  > 1) {
			series[i].data = serie_std(series[i].data);
			
		}
		
	}
	
	options.series = series;
	
	if (typeof data.description != 'undefined')
		options.subtitle.text = data.description;
	
	chart = new Highcharts.Chart(options);
	
	if (typeof data.description != 'undefined')
		$('#'+render_to).append('<p class="pull-right"><i>source : ' + data.source + ' / zone : ' +  data.zone + '</i></p>');
	

}

function parse_dateserie(data) { 
	var date_data = [];
	for (var i=0;i<data.length;i++)
	{
		date_data.push([Date.parse(data[i][0]),data[i][1]]);
	}
	return date_data.sort(function (a,b) { return a[0] - b[0]; });
}

function Heatmap(options)
{
	this.options = options;
	
	
	this.init = function() {
	
		var html = '<p class="text-center lead">' + this.options.title + '<br/>'; 
		html += '<small><i>' + this.options.subtitle + '</i></small></p>';
		html += '<table width="100%"><tr><th></th>';
		var cat_len = options.categories.length;
		
		for (var i=0; i<cat_len; i++)
		{
			html += "<th>" + options.categories[i] + " mois</th>";
		}
		html += "</tr>";
		
		series_len = options.series.length;
		
		for (var i=0; i<series_len; i++)
		{
			html += '<tr><td><a href=\"#\" onclick=\"search_serie(\'' +options.series[i].id+ '\',\'' +options.series[i].name+ '\');return false;">' + options.series[i].name +  '</a></td>' ;
			
		
			for (var j=0; j<cat_len; j++)
			{
				result = options.series[i].data[j];
				if (result == null)
				{
					html += "<td></td>";
				}
				else
				{
					
					if (result.r2 >= 0.7 )
					{
						html += '<td title="R²=' + roundNumber(result.r2 * 100,2) + "%\" style=\"cursor:pointer;background-color:rgb(0," + Math.round(255-Math.abs(result.r2)*125) + "," + Math.round(255-Math.abs(result.r2)*125) + ')" onclick="get_lagged_serie(\'' + options.series[i].id + '\',' + options.categories[j] + ');"></td>';
					}
					else if (result.r2 > 0.5)
					{
						html += '<td title="R²=' + roundNumber(result.r2 * 100,2) + "%\" style=\"cursor:pointer;background-color:rgb(" + Math.round(255-Math.abs(result.r2)*255) + "," + Math.round(255-Math.abs(result.r2)*255) + ',255)" onclick="get_lagged_serie(\'' + options.series[i].id + '\',' + options.categories[j] + ');"></td>';					
					}
					else {
						html += '<td title="R²=' + roundNumber(result.r2 * 100,2) + '%\" style=\"background-color:white;" onclick="get_lagged_serie(\'' + options.series[i].id + '\',' + options.categories[j] + ');"></td>';						
					}
				}
			}
			
			html += "</tr>";
		}
		
		html += "</table>";
		
		$(options.renderTo).html(html);
	
	};
	
	this.init();

}

function draw_heatmap(name,data,render_to,title,subtitle) {
	
		var options = {
			renderTo : '#' + render_to,
			categories : [],
			series : [], 
			title: (title || ''),
			subtitle: (subtitle || '')
		};
		
		$.each(data, function(i,result) {
			var serie = {
					id : result.id,
					name : result.name,
					data : result.results 
			};						
			options.series.push(serie);
			
		});
		
		for (category in options.series[0].data)
		{
			if (!isNaN(category))
				options.categories.push(parseInt(category));
		}
		
		heatmap = new Heatmap(options);	
}