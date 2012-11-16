var config = {
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
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;	
		ctx.stroke();
		ctx.beginPath();
	}

	
	// ctx.beginPath();
	// ctx.moveTo(point0.x+dx,this.height-y0-1);
	// ctx.lineTo(point0.x+dx,this.height-y0-1);
	// ctx.lineWidth = 2;
	// 
	//	ctx.beginPath();
	// var y1 = ((this.height)*point1.percent)/100;
	// ctx.arc(point1.x+dx, this.height-y1+dy, radius, 0, 2 * Math.PI, false);	
	// ctx.stroke();
	
	//console.log(y1)
	
		  		
	/*ctx.font = 'normal normal 13px sans-serif';
	ctx.fillText (point0.percent + '%', point0.x, y);	
	
	ctx.font = 'bold normal 13px sans-serif';
	ctx.fillText (point0.y, point0.x, y);*/
}

Chart.prototype.renderFromData = function() {
	
}



chart = new Chart('#container', config);



//drawChartProffesional - first
function drawChartProffesional () {
	
};

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