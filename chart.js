/*var config = {
    width: 550, //ширина графика
    height:430, //высота. Если их изменить то все отрисуется правильно.
	bottomLineColor: "#929292",
	middleLineColor: "rgb(133,205,250)",
	axisX: {
			max: 50,
			points: [15, 20, 25, 30, 35, 40, 45, 50],
			min: 15
			
	},
	axisY: {
			max:3,
			min:0,
			middle: 2.2,
			points: [0, 1, 2, 3],
			points2:[
			         {val:0,   lbl:"<i class='tick first'>0</i>"},
			         {val:0.6, lbl:"<i class='tick'>20</i>"},
			         {val:1.2, lbl:"<i class='tick'>40</i>"},
			         {val:1.8, lbl:"<i class='tick'>60</i>"},
			         {val:2.4, lbl:"<i class='tick'>80</i>"},
			         {val:3,   lbl:"<i class='tick last'>100%</i>"}
				]
	},
		
	data: [
		          {
		       	      color: "rgb(102,217,2)",
		       		  label: "Менеджмент", //пусть при наведении на точку появится подсказочка кому эта точка принадлежит
		       		  id: "someid",
		       		  points: [
		       		      {x: 18, y: 1.2,  percent:42}, 
		       			  {x: 28.4, y: 2, percent: 70},
		       			  {x: 40.4, y: 0.8, percent: 10}
		       		  ]
		       		},
		       		{
		       			color: "rgb(0,150,245)",
		       			label: "Менеджер",
		       			id: "someid2",
		       			points: [{x: 28, y: 2.2, percent: 15}]
		       		},
		       		{
		       			color: "rgb(241,220,45)",
		       			label: "Программист",
		       			id: "someid3",
		       			points: [
		       			         {x: 19 , y: 0.2, percent: 12}, 
		       			         {x: 24, y:0.6, percent: 15}, 
		       			         {x: 28, y:3, percent: 1}]
		       		}
		       		
    ]
}

var canvas = document.getElementById('container');	
var ctx = canvas.getContext('2d');
ctx.lineWidth = .6;

function Chart(selector, config) {
	this.width = config.width;
	this.height = config.height;
	this.el = $(selector);
	
	this.initialize();	
}

Chart.prototype.initialize = function() {
	this.setSize();
		
	this.determineCoordinate();
	
	this.drawAsix();
	this.drawHints();
	this.drawPoints();
	
}

Chart.prototype.setSize = function() {
	this.el.css({'width': this.width+'px', 'height': this.height+'px'});

	//this.el.css({'border': '1px solid red'});
}

Chart.prototype.determineCoordinate = function() {
    this.x = $(this.el).offset().left;	
    this.y = $(this.el).offset().top;	
}

CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;
    
    this.beginPath();
    this.moveTo(x1, y1);
    
    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;
    
    var q = 0;
    while (q++ < dashes) {
     x1 += dashX;
     y1 += dashY;
     this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
    
    this.stroke();
    this.closePath();
};

Chart.prototype.drawAsix = function() {
    	
	//x bottom
	ctx.beginPath();
	ctx.moveTo(this.x,this.height-20);
	ctx.lineTo(this.x,this.height-20);
	ctx.lineTo(0,this.height-20);
	ctx.strokeStyle = config.bottomLineColor;
	
	ctx.stroke();
	
	
	//x top
	ctx.strokeStyle = config.middleLineColor;
	var x0=0,y0=1,
	x1=this.width, y1=1;
	var yPoints = config.axisY.points;
	var lines = yPoints.length-2;
	var yStep = this.height / (yPoints.length-1);
	ctx.dashedLine(x0, y0, x1, y1, 1.5);
	for (var i = 0; i<lines; i++){
		x0 = 0, y0 = y1= y0+yStep;
		ctx.dashedLine(x0, y0, x1, y1, 1.5);
	}
}
Chart.prototype.drawHints = function() {
	ctx.beginPath();
	ctx.textBaseline = 'top';
	ctx.fillStyle = config.bottomLineColor;
	ctx.font = 'normal normal 13px sans-serif';
	
	var yPoint = this.height-15;
	var points = config.axisX.points;
	for (var point in config.axisX.points){
		point = config.axisX.points[point];
		var step  = (this.width - 68) / (points[points.length-1] - points[0]);	
		//console.log(step);
		var xPoint = (point - config.axisX.points[0])*step;
		ctx.fillText (point, xPoint, yPoint);
	}	
}


Chart.prototype.pointXToPixesl=function(value){
	return (this.width/(config.axisX.max-config.axisX.min))*(value - config.axisX.min)
}

Chart.prototype.pointYToPixesl=function(value){
	return this.height-(this.height/(config.axisY.max-config.axisY.min))*(value - config.axisY.min);
}


Chart.prototype.drawPoints = function() {
	ctx.beginPath();
	ctx.fillStyle   = '#000';
	
	var chartProfessional = config.data[0];
	var color = chartProfessional.color;	
    var radius=4;
	
	for ( var i in chartProfessional.points) {
		var _i = chartProfessional.points[i];
		var x = this.pointXToPixesl(_i.x);
		var y = this.pointYToPixesl(_i.y);
		
		var markX = x-21;
		var markY = y-25;
		this.el.parents('.container-wrap').append('<i class="mark" style="left:'+ markX +'px; top:'+ markY +'px"/>');
		$('.container-wrap .mark').css('border-color',color);
		
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;	
		ctx.stroke();
		ctx.beginPath();
	}
    $('.container-wrap .mark').append('<span class="mark-arrow-border" />').append('<span class="mark-arrow" />');
	
	// ctx.beginPath();
	// ctx.moveTo(point0.x+dx,this.height-y0-1);
	// ctx.lineTo(point0.x+dx,this.height-y0-1);
	// ctx.lineWidth = 2;
	// 
	//	ctx.beginPath();
	// var y1 = ((this.height)*point1.percent)/100;
	// ctx.arc(point1.x+dx, this.height-y1+dy, radius, 0, 2 * Math.PI, false);	
	// ctx.stroke();
	
		  		
	/*ctx.font = 'normal normal 13px sans-serif';
	ctx.fillText (point0.percent + '%', point0.x, y);	
	
	ctx.font = 'bold normal 13px sans-serif';
	ctx.fillText (point0.y, point0.x, y);
}

Chart.prototype.renderFromData = function() {
	
}

chart = new Chart('#container', config);*/



//drawChartProffesional - first
/*function drawChartProffesional () {
	
};*/

/*d3_rgbPrototype.brighter = function(k) {
  k = Math.pow(0.7, arguments.length ? k : 1);
  var r = this.r,
      g = this.g,
      b = this.b,
      i = 30;
  if (!r && !g && !b) return d3_rgb(i, i, i);
  if (r && r < i) r = i;
  if (g && g < i) g = i;
  if (b && b < i) b = i;
  return d3_rgb(
      Math.min(255, Math.floor(r / k)),
      Math.min(255, Math.floor(g / k)),
      Math.min(255, Math.floor(b / k)));
};*/


var linearChart = function (container, config) {
	this.config = config;
	this.containerEl = document.querySelector(container);

	this.init();

	document.querySelector('.navPanel').addEventListener('click', this.onclickNav.bind(this));

	var selected;
	for(var i = 0, l = config.data.length; i < l; i++) {
		this.generateChart(config.data[i]);
		if(config.data[i].selected)
			selected = true;
	}
	if(!selected)
		this.selectChart(config.data[0].id);

	this.gMain.appendChild(this.spotsEl);
};

linearChart.prototype = {
	svgNS: 'http://www.w3.org/2000/svg',
	init: function () {
		this.createSVGContainer();
		this.initAxisX();
		this.initAxisYLeft();
		this.initAxisYRight();
		this.initBasicWrappers();
		this.initMainLine();
		this.initDefsElements();
		this.initSpotElements();
		this.initVLineElements();
	},
	createSVGContainer: function () {
		var svgEl = document.createElementNS(this.svgNS, 'svg'),
			gMain = document.createElementNS(this.svgNS, 'g');

		svgEl.setAttribute('width', this.config.width + 65);
		svgEl.setAttribute('height', this.config.height + 80);
		gMain.setAttribute('transform', 'translate(20,60)');
		svgEl.appendChild(gMain);
		this.containerEl.appendChild(svgEl);

		this.gMain = gMain;
	},
	initAxisX: function () {
		var x, i,
			points = this.config.axisX.points,
			axisLength = points.length - 1,
			stepX = this.config.width / axisLength,
			el = document.createElementNS(this.svgNS, 'g'),
			tickText = document.createElementNS(this.svgNS, 'text'),
			tickLine = document.createElementNS(this.svgNS, 'line'),
			axisLine = document.createElementNS(this.svgNS, 'path'),
			tick;

		this.singleStepX = this.config.width / (points[axisLength] - points[0]);

		el.classList.add('axis');
		el.classList.add('x');
		el.setAttribute('transform', 'translate(0,' + (this.config.height - 1) + ')');

		tickLine.setAttribute('y2', 4);
		tickText.setAttribute('dy', 17);

		axisLine.classList.add('axisLine');
		axisLine.setAttribute('d', 'M0,1 H' + this.config.width);

		x = 0;
		for (i = 0; i <= axisLength; i++) {
			tickText = tickText.cloneNode();
			tickText.textContent = points[i];

			tick = document.createElementNS(this.svgNS, 'g');
			tick.setAttribute('transform', 'translate(' + x + ',0)');

			tick.appendChild(tickLine.cloneNode());
			tick.appendChild(tickText);

			el.appendChild(tick);
			x += stepX;
		}
		el.appendChild(axisLine);

		this.gMain.appendChild(el);
	},
	initAxisYLeft: function () {
		var i,
			points = this.config.axisY.points,
			axisLength = points.length - 1,
			el = document.createElementNS(this.svgNS, 'g'),
			tickLine = document.createElementNS(this.svgNS, 'line'),
			tickText = document.createElementNS(this.svgNS, 'text'),
			tick;

		this.stepY = this.config.height / axisLength;

		el.classList.add('axis');
		el.classList.add('yLeft');

		tickLine.setAttribute('x2', this.config.width);
		tickLine.style.stroke = this.config.middleLineColor;

		tickText.setAttribute('y', 4);
		tickText.setAttribute('x', -20);
		tickText.style.fill = this.config.middleLineColor;

		for (i = axisLength; i > 0; i--) {
			tick = document.createElementNS(this.svgNS, 'g');
			tick.setAttribute('transform', 'translate(0,' + (this.config.height - points[i] * this.stepY) + ')');

			tickText = tickText.cloneNode();
			tickText.textContent = points[i];

			tick.appendChild(tickLine.cloneNode());
			tick.appendChild(tickText);
			el.appendChild(tick);
		}

		this.gMain.appendChild(el);
	},
	initAxisYRight: function () {
		var axisLength = this.config.axisY.points2.length,
			el = document.createElementNS(this.svgNS, 'g'),
			tick, i, point;

		el.classList.add('axis');
		el.classList.add('yRight');
		el.setAttribute('transform', 'translate(' + (this.config.width + 5) + ',5)');

		for (i = axisLength; i > 0; i--) {
			point = this.config.axisY.points2[i - 1];

			tick = document.createElementNS(this.svgNS, 'text');
			tick.setAttribute('transform', 'translate(0,' + (this.config.height - point.val * this.stepY) + ')');
			tick.textContent = point.lbl;

			el.appendChild(tick);
		}

		this.gMain.appendChild(el);
	},
	initBasicWrappers: function () {
		this.spotsEl = document.createElementNS(this.svgNS, 'g');
		this.vLines = document.createElementNS(this.svgNS, 'g');
		this.defs = document.createElementNS(this.svgNS, 'defs');

		this.spotsEl.classList.add('spots');
		this.vLines.classList.add('vLines');
		this.vLines.setAttribute('transform', 'translate(0,' + this.config.height + ')');

		this.gMain.appendChild(this.vLines);
		this.gMain.appendChild(this.defs);
	},
	initMainLine: function () {
		this.mainLine = document.createElementNS(this.svgNS, 'path');
		this.mainLine.classList.add('mainLine');
	},
	initDefsElements: function () {
		var el = document.createElementNS(this.svgNS, 'linearGradient'),
			stopEl = document.createElementNS(this.svgNS, 'stop'),
			stopEl1;

		el.setAttribute('x', 0);
		el.setAttribute('y', 0);
		el.setAttribute('x2', 0);
		el.setAttribute('y2', 1);

		stopEl.setAttribute('stop-color', '#fff');
		stopEl.setAttribute('offset', 0);
		stopEl.setAttribute('stop-opacity', 0.1);

		stopEl1 = stopEl.cloneNode();
		stopEl1.setAttribute('offset', 1);
		stopEl1.classList.add('gradientColor');

		el.appendChild(stopEl);
		el.appendChild(stopEl1);

		this.linearGradient = el;
	},
	initSpotElements: function () {
		var spot = document.createElementNS(this.svgNS, 'g'),
			circle = document.createElementNS(this.svgNS, 'circle'),
			hintText = document.createElementNS(this.svgNS, 'text'),
			hint = document.createElementNS(this.svgNS, 'path'),
			hintTextX, hintBG;

		circle.setAttribute('r', 5);

		hintText.setAttribute('transform', 'translate(0,-21)');
		hintTextX = hintText.cloneNode();
		hintText.classList.add('percentageValue');
		hintTextX.classList.add('yValue');
		hintTextX.setAttribute('transform', 'translate(0,-35)');

		hint.setAttribute('d',
			'M0,-10 l-19,-10    h  -1 ' +
			'a 3,3 0 0,1 -3, -3 v -28 ' +
			'a 3,3 0 0,1  3, -3 h  40 ' +
			'a 3,3 0 0,1  3,  3 v  28 ' +
			'a 3,3 0 0,1 -3,  3 h  -1 z');
		hintBG = hint.cloneNode();
		hintBG.classList.add('hintWhiteBG');
		hint.classList.add('hint');

		spot.appendChild(circle);
		spot.appendChild(hintBG);
		spot.appendChild(hint);
		spot.appendChild(hintTextX);
		spot.appendChild(hintText);

		this.spot = spot;
	},
	initVLineElements: function () {
		var el = document.createElementNS(this.svgNS, 'g'),
			path = document.createElementNS(this.svgNS, 'path'),
			textEl = document.createElementNS(this.svgNS, 'g'),
			textBG = document.createElementNS(this.svgNS, 'path'),
			text = document.createElementNS(this.svgNS, 'text');

		path.classList.add('vLine');
		textEl.setAttribute('transform', 'translate(0,-7)');

		textBG.classList.add('vLineBG');
		textBG.setAttribute('d', 'M0,0 V-15');

		text.setAttribute('y', -4);

		textEl.appendChild(textBG);
		textEl.appendChild(text);
		el.appendChild(path);
		el.appendChild(textEl);

		this.vLineEl = el;
	},
	generateChart: function (chartConfig) {
		var j, k,
			mainLine = this.mainLine.cloneNode(),
			linearGradient = this.linearGradient.cloneNode(true),
			lineCoords = 'M',
			styleEl = this.containerEl.querySelector('style');

		mainLine.style.stroke = chartConfig.color;
		mainLine.classList.add(chartConfig.id);

		this.gMain.appendChild(mainLine);

		// defs
		linearGradient.querySelector('.gradientColor').setAttribute('stop-color', chartConfig.color);
		linearGradient.setAttribute('id', chartConfig.id + '_gradient');
		this.defs.appendChild(linearGradient);

		for (j = 0, k = chartConfig.points.length; j < k; j++)
			lineCoords += this.generateSpot(chartConfig.id, chartConfig.color, chartConfig.points[j]);

		mainLine.setAttribute('d', lineCoords);

		if (!styleEl) {
			styleEl = document.createElement('style');
			this.containerEl.appendChild(styleEl);
		}
		styleEl.innerHTML += '.showChart_' + chartConfig.id + ' .' + chartConfig.id + ' {display: block}';

		if (chartConfig.selected)
			this.selectChart(chartConfig.id);
	},
	generateSpot: function (id, color, point) {
		var spot, vLine,
		x = this.singleStepX * (point.x - this.config.axisX.points[0]),
		y = this.config.height - this.stepY * point.y;

		spot = this.spot.cloneNode(true);
		spot.classList.add(id);
		spot.setAttribute('transform', 'translate(' + x + ',' + y + ')');
		spot.style.stroke = color;
		spot.querySelector('.hint').style.fill = 'url(#' + id + '_gradient)';
		spot.querySelector('.yValue').textContent = point.y;
		spot.querySelector('.percentageValue').textContent = point.percent + '%';

		this.spotsEl.appendChild(spot);
		//label here

		vLine = this.vLineEl.cloneNode(true);
		vLine.classList.add(id);
		vLine.setAttribute('transform', 'translate(' + x + ',0)');
		vLine.querySelector('.vLine').setAttribute('d', 'M0,0 V-' + (this.config.height - y - 10));
		vLine.querySelector('text').textContent = point.x;

		this.vLines.appendChild(vLine);

		return x + ',' + y + ' ';
	},
	selectChart: function (id) {
		id = id || 'none';
		var chartClassList = this.containerEl.classList;

		var toRemove = [], i;
		for(i in chartClassList)
			if(chartClassList.hasOwnProperty(i) && !isNaN(i))
				if(chartClassList[i].match(/showChart_(\S)+/))
					toRemove.push(chartClassList[i]);
		if(toRemove)
			for(i = 0; i < toRemove.length; i++)
				chartClassList.remove(toRemove[i]);

		this.containerEl.classList.add('showChart_' + id);
		if(document.querySelector('.current'))
			document.querySelector('.current').classList.remove('current');
		if(document.querySelector('#' + id))
			document.querySelector('#' + id).classList.add('current');
	},
	onclickNav: function (e) {
		if (e.target.tagName == 'SPAN')
			this.selectChart(e.target.parentNode.id);
	}
};