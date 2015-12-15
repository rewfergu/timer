var arc = d3.svg.arc()
  .innerRadius(0)
  .outerRadius(240)
  .startAngle(0 * (Math.PI / 180))
  .endAngle(0 * (Math.PI / 180));

var timerFace = d3.select('#face');

var pie = timerFace.append('path')
    .attr('d', arc)
    .attr('fill', 'black')
    .attr('opacity', .15)
    .attr('transform', 'translate(250.5,250.5)');

var timerHand = d3.select('#arm');
var start = false;
var now;
var milliseconds = 1000;
var seconds = 60;
var minutes = 1;
var block = minutes * seconds * milliseconds;

var end;
var percentage;
var angle;
var pause = false;

var path = require('path');
var message = {
  title: 'Timer Notification',
  body: 'Times Up',
  icon: path.join(__dirname, 'timer.svg'),
};

$('#startBtn').click(function() {
  start = true;
  now = Date.now();
  $(this).addClass('btn-success');
  $('#stopBtn').removeClass('btn-danger');
  if (!pause) {
    end = now + block;
  } else {
    pause = false;
    end = now + (block * percentage);
  }
});

$('#stopBtn').click(function() {
  start = false;
  pause = true;
  $('#startBtn').removeClass('btn-success');
  $(this).addClass('btn-danger');
});

$('#resetBtn').click(function() {
  start = false;
  pause = false;
  pie.remove();
  angle = 0;
  arc.endAngle(angle * (Math.PI / 180));

  pie = timerFace.append('path')
    .attr('d', arc)
    .attr('fill', 'black')
    .attr('opacity', .15)
    .attr('transform', 'translate(250.5,250.5)');

  timerHand.style({transform: 'rotate(' + angle + 'deg)'});
});

$('#settingsBtn').click(function() {
  $('.settings').toggleClass('active');
});

$('#timeInput').val(minutes);
$('#timeInput').change(function() {
  minutes = $(this).val();
  block = minutes * seconds * milliseconds;
})

function animate(time) {
  if (start) {
    now = Date.now();
    percentage = (end - now) / block;

    pie.remove();

    angle = 360 - (360 * percentage);
    arc.endAngle(angle * (Math.PI / 180));

    pie = timerFace.append('path')
      .attr('d', arc)
      .attr('fill', 'black')
      .attr('opacity', .15)
      .attr('transform', 'translate(250.5,250.5)');

    timerHand.style({transform: 'rotate(' + angle + 'deg)'});

    if (angle >= 360) {
      start = false;
      pie.remove();
      $('#modal').modal('show');
      new Notification(message.title, message);
    }

  }

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
