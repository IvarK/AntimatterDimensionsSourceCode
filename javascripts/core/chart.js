Chart.defaults.global.defaultFontColor = 'black';
Chart.defaults.global.defaultFontFamily = 'Typewriter';
var ctx2 = document.getElementById("normalDimChart").getContext('2d');
var normalDimChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: ['Exponents of antimatter per second'],
            data: [],
            backgroundColor: [
                'rgba(0,0,0,1)'
            ],
            borderColor: [
                'rgba(0,0,0,1)'
            ],
            fill: false,
            lineTension: 0.1,
            borderWidth: 3,
            pointRadius: 0,
            pointBorderWidth: 0,
            pointHoverRadius: 0
        }]
    },
    options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        legend: {
            display: false,
            labels: {
                boxWidth: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: 100000000,
                    min: 1
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                    drawTicks: false
                },
                ticks: {
                    fontSize: 0
                }
            }]
        },
        layout: {
            padding: {
            top: 10
            }
        }
    }
});

function updateChartValues() {
    player.options.chart.duration = Math.min(Math.max(parseInt(document.getElementById("chartDurationInput").value), 1), 300);
    document.getElementById("chartDurationInput").value = player.options.chart.duration;
    player.options.chart.updateRate = Math.min(Math.max(parseInt(document.getElementById("chartUpdateRateInput").value), 50), 10000);
    document.getElementById("chartUpdateRateInput").value = player.options.chart.updateRate;
    if (Number.isInteger(player.options.chart.updateRate) === false) {
        player.options.chart.updateRate = 1000;
    }
    if ((player.options.chart.updateRate <= 200 && player.options.chart.duration >= 30) && player.options.chart.warning === 0) {
        alert("Warning: setting the duration and update rate too high can cause performance issues.");
        player.options.chart.warning = 1;
    }
    if (player.options.chart.duration / player.options.chart.updateRate * 1000 >= 1000 && player.options.chart.warning !== 2) {
        alert("Warning: you have set the duration and update rate quite high, make sure you know what you're doing or have a good computer");
        player.options.chart.warning = 2;
    }
}

function addData(chart, label, data) {
    var points = Math.ceil(player.options.chart.duration / player.options.chart.updateRate * 1000 - 1);
    if (chart.data.datasets[0].data.length > points) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    data = Math.max(data.log(10), 0.1);
    comp1 = Array.max(chart.data.datasets[0].data);
    comp2 = Array.min(chart.data.datasets[0].data);
    if (data > comp1) {
        chart.options.scales.yAxes[0].ticks.max = data;
    }
    if (chart.options.scales.yAxes[0].ticks.min < comp2 || chart.options.scales.yAxes[0].ticks.min == Infinity) {
        chart.options.scales.yAxes[0].ticks.min = comp2;
    }
    if (data < chart.options.scales.yAxes[0].ticks.min && player.options.chart.dips) {
        chart.options.scales.yAxes[0].ticks.min = data;
    }
    var preservedChartValues = false;
    let failSafe = 0;
    while (chart.data.datasets[0].data.length < points) {
        if (preservedChartValues) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach( function(dataset) {
                dataset.data.push(data);
            });
        } else {
            var temp = chart.data.datasets[0].data.slice();
            var tempData = data;
            preservedChartValues = true;
        }
        if (chart.data.datasets[0].data.length >= points) {
            var temp2 = chart.data.datasets[0].data.slice();
            for (i=0; i<temp.length; i++) {
                temp2[chart.data.datasets[0].data.length - temp.length + i] = temp[i];
                temp2[i] = data;
            }
            chart.data.datasets[0].data = temp2;
        }
    }
    while (chart.data.datasets[0].data.length > points && failSafe < 1000) {
        chart.data.labels.pop(label);
        chart.data.datasets.forEach( function(dataset) {
            dataset.data.pop(data);
        });
        failSafe++;
    }
    chart.data.labels.push(label);
    chart.data.datasets.forEach( function(dataset) {
        if (data < chart.data.datasets[0].data[chart.data.datasets[0].data.length-1] && !player.options.chart.dips) dataset.data.push(chart.data.datasets[0].data[chart.data.datasets[0].data.length-1]);
        else dataset.data.push(data);
    });
    if (document.getElementById("dimensions").style.display == "block" && document.getElementById("production").style.display == "block") chart.update(100);
    else chart.update(0);
}