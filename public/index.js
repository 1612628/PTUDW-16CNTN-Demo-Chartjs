var chart = null;

$(document).ready(function () {
    $.ajax('/bao-cao-so-luong-ghe-1-2017-12-2017.json').done(function (json) {
        line(json);
    });
});

function chartColors(chartin, palette) {

    console.log('chartColor() called');
    /*Gradients
      The keys are percentage and the values are the color in a rgba format.
      You can have as many "color stops" (%) as you like.
      0% and 100% is not optional.*/
    var gradient;
    switch (palette) {
        case 'cool':
            gradient = {
                0: [255, 255, 255, 1],
                20: [220, 237, 200, 1],
                45: [66, 179, 213, 1],
                65: [26, 39, 62, 1],
                100: [0, 0, 0, 1]
            };
            break;
        case 'warm':
            gradient = {
                0: [255, 255, 255, 1],
                20: [254, 235, 101, 1],
                45: [228, 82, 27, 1],
                65: [77, 52, 47, 1],
                100: [0, 0, 0, 1]
            };
            break;
        case 'neon':
            gradient = {
                0: [255, 255, 255, 1],
                20: [255, 236, 179, 1],
                45: [232, 82, 133, 1],
                65: [106, 27, 154, 1],
                100: [0, 0, 0, 1]
            };
            break;
    }
    console.log(gradient);

    //Get a sorted array of the gradient keys
    var gradientKeys = Object.keys(gradient);
    gradientKeys.sort(function (a, b) {
        return +a - +b;
    });

    //Find datasets and length
    var chartType = chartin.config.type;
    var datasets;
    var setsCount;
    switch (chartType) {
        case "pie":
        case "doughnut":
            datasets = chartin.config.data.datasets[0];
            setsCount = datasets.data.length;
            break;
        case "bar":
        case "line":
            datasets = chartin.config.data.datasets;
            setsCount = datasets.length;
            break;
    }

    //Calculate colors
    var chartColors = [];
    for (i = 0; i < setsCount; i++) {
        var gradientIndex = (i + 1) * (100 / (setsCount + 1)); //Find where to get a color from the gradient
        for (j = 0; j < gradientKeys.length; j++) {
            var gradientKey = gradientKeys[j];
            if (gradientIndex === +gradientKey) { //Exact match with a gradient key - just get that color
                chartColors[i] = 'rgba(' + gradient[gradientKey].toString() + ')';
                break;
            } else if (gradientIndex < +gradientKey) { //It's somewhere between this gradient key and the previous
                var prevKey = gradientKeys[j - 1];
                var gradientPartIndex = (gradientIndex - prevKey) / (gradientKey - prevKey); //Calculate where
                var color = [];
                for (k = 0; k < 4; k++) { //Loop through Red, Green, Blue and Alpha and calculate the correct color and opacity
                    color[k] = gradient[prevKey][k] - ((gradient[prevKey][k] - gradient[gradientKey][k]) * gradientPartIndex);
                    if (k < 3) color[k] = Math.round(color[k]);
                }
                chartColors[i] = 'rgba(' + color.toString() + ')';
                break;
            }
        }
    }

    //Copy colors to the chart
    for (i = 0; i < setsCount; i++) {
        switch (chartType) {
            case "pie":
            case "doughnut":
                if (!datasets.backgroundColor) datasets.backgroundColor = [];
                datasets.backgroundColor[i] = chartColors[i];
                if (!datasets.borderColor) datasets.borderColor = [];
                datasets.borderColor[i] = "rgba(255,255,255,1)";
                break;
            case "bar":
                datasets[i].backgroundColor = chartColors[i];
                datasets[i].borderColor = "rgba(255,255,255,0)";
                break;
            case "line":
                datasets[i].borderColor = chartColors[i];
                datasets[i].backgroundColor = "rgba(255,255,255,0)";
                break;
        }
    }

    //Update the chart to show the new colors
    chartin.update();
}

function changeFunc() {
    var selectBox = document.getElementById("selectbasic");
    var selectvalue = selectBox.options[selectBox.selectedIndex].value;
    if (chart != null) {
        chart.destroy();
    }

    $.ajax('/bao-cao-so-luong-ghe-1-2017-12-2017.json').done(function (json) {
        switch (selectvalue) {
            case '1':
                line(json);
                break;
            case '2':
                bar(json);
                break;
            case '3':
                radar(json);
                break;
            case '4':
                pie(json);
                break;
            case '5':
                polar(json);
                break;
            case '6':
                bubble(json);
                break;
            case '7':
                scatter(json);
                break;
            case '8':
                area(json);
                break;
            case '9':
                mixed(json);
                break;

        }
    });
}

function line(json) {

    var x_so_luong_labels = [];
    var data_ghe_dat = [];
    var data_ghe_trong = [];

    for (var i = 0; i < json.baocaosoluongghe.ket_qua_tung_thang.length; ++i) {
        x_so_luong_labels.push("" + json.baocaosoluongghe.ket_qua_tung_thang[i].thang + "/" +
            json.baocaosoluongghe.ket_qua_tung_thang[i].nam);
        data_ghe_dat.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.ghengoi);
        data_ghe_trong.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.ghengoi);
    }

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'line',
        data: {
            labels: x_so_luong_labels,
            datasets: [{
                    label: "Số lượng ghế đặt hàng tháng",
                    data: data_ghe_dat,
                    backgroundColor: 'rgba(20, 112, 173,0.5)',
                    borderCapStyle: 'square',
                    // borderColor:'rgba(173, 20, 20, 0.91)',
               
                    pointBackgroundColor: 'rgba(227, 230, 45, 0.91)',
                    spanGaps: true,
                },
                {
                    label: "Số lượng ghế trống hàng tháng",
                    data: data_ghe_trong,
                    backgroundColor: 'rgba(173, 87, 20, 0.91)',
                    borderCapStyle: 'square',
              

                }
            ]
        },
        options: {
            plugins: {
                filler: {
                    propagate: true
                }
            }
        }
    });
}

function bar(json) {
    var x_so_luong_labels = [];
    var data_ghe_dat = [];
    var data_ghe_trong = [];

    for (var i = 0; i < json.baocaosoluongghe.ket_qua_tung_thang.length; ++i) {
        x_so_luong_labels.push("" + json.baocaosoluongghe.ket_qua_tung_thang[i].thang + "/" +
            json.baocaosoluongghe.ket_qua_tung_thang[i].nam);
        data_ghe_dat.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.ghengoi);
        data_ghe_trong.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.ghengoi);
    }

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'bar',
        data: {
            labels: x_so_luong_labels,
            datasets: [{
                    label: "Số lượng ghế đặt hàng tháng",
                    data: data_ghe_dat,
                    backgroundColor: 'rgba(20, 112, 173,0.5)',
                    // borderColor:'rgba(173, 20, 20, 0.91)',
                    // borderWidth: '5',
                    hoverBackgroundColor: 'rgba(114, 20, 255, 1)',
                    borderSkipped: 'bottom',
                },
                {
                    label: "Số lượng ghế trống hàng tháng",
                    data: data_ghe_trong,
                    backgroundColor: 'rgba(173, 87, 20, 0.91)',
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    barPercentage: 0.5,
                    categoryPercentage: 1.0,
                    barThickness: 40,

                }],
                yAxes: [{

                }]
            }
        }
    });
}

function radar(json) {
    var x_so_luong_labels = [];
    var data_ghe_dat = [];
    var data_ghe_trong = [];

    for (var i = 0; i < json.baocaosoluongghe.ket_qua_tung_thang.length; ++i) {
        x_so_luong_labels.push("" + json.baocaosoluongghe.ket_qua_tung_thang[i].thang + "/" +
            json.baocaosoluongghe.ket_qua_tung_thang[i].nam);
        data_ghe_dat.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.ghengoi);
        data_ghe_trong.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.ghengoi);
    }

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'radar',
        data: {
            labels: x_so_luong_labels,
            datasets: [{
                    label: "Số lượng ghế đặt hàng tháng",
                    data: data_ghe_dat,
                    backgroundColor: 'rgba(20, 112, 173,0.5)',
                    // borderColor:'rgba(173, 20, 20, 0.91)',
                    // borderWidth: '5',
                    hoverBackgroundColor: 'rgba(114, 20, 255, 1)',
                    borderSkipped: 'bottom',
                },
                {
                    label: "Số lượng ghế trống hàng tháng",
                    data: data_ghe_trong,
                    backgroundColor: 'rgba(173, 87, 20, 0.91)',
                }
            ]
        },
        options: {
            scale: {
                display: true,
            }
        }
    });
}

function pie(json) {
    var x_so_luong_labels = [];
    var data_ghe_dat = [];
    var data_ghe_trong = [];

    for (var i = 0; i < json.baocaosoluongghe.ket_qua_tung_thang.length; ++i) {
        x_so_luong_labels.push("" + json.baocaosoluongghe.ket_qua_tung_thang[i].thang + "/" +
            json.baocaosoluongghe.ket_qua_tung_thang[i].nam);
        data_ghe_dat.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.ghengoi);
        data_ghe_trong.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.ghengoi);
    }

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'pie',
        data: {
            labels: x_so_luong_labels,
            datasets: [{
                label: "Số lượng ghế đặt hàng tháng",
                data: data_ghe_dat,
                // borderColor:'rgba(173, 20, 20, 0.91)',
                // borderWidth: '5',
                hoverBackgroundColor: 'rgba(114, 20, 255, 1)',
            }]
        },
        options: {}
    });
    chartColors(chart, "neon");
}

function polar(json) {
    var x_so_luong_labels = [];
    var data_ghe_dat = [];
    var data_ghe_trong = [];

    for (var i = 0; i < json.baocaosoluongghe.ket_qua_tung_thang.length; ++i) {
        x_so_luong_labels.push("" + json.baocaosoluongghe.ket_qua_tung_thang[i].thang + "/" +
            json.baocaosoluongghe.ket_qua_tung_thang[i].nam);
        data_ghe_dat.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.ghengoi);
        data_ghe_trong.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.ghengoi);
    }

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'polarArea',
        data: {
            labels: x_so_luong_labels,
            datasets: [{
                label: "Số lượng ghế đặt hàng tháng",
                data: data_ghe_dat,
                backgroundColor: 'rgba(20, 112, 173,0.5)',
                // borderColor:'rgba(173, 20, 20, 0.91)',
                // borderWidth: '5',
                hoverBackgroundColor: 'rgba(114, 20, 255, 1)',
            }]
        },
        options: {}
    });
}

function bubble(json) {


    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'bubble',
        data: {
            datasets: [{
                label: ["China"],
                backgroundColor: "rgba(255,221,50,0.2)",
                borderColor: "rgba(255,221,50,1)",
                data: [{
                    x: 21269017,
                    y: 5.245,
                    r: 50
                }]
            }, {
                label: ["Denmark"],
                backgroundColor: "rgba(60,186,159,0.2)",
                borderColor: "rgba(60,186,159,1)",
                data: [{
                    x: 258702,
                    y: 7.526,
                    r: 30
                }]
            }, {
                label: ["Germany"],
                backgroundColor: "rgba(0,0,0,0.2)",
                borderColor: "#000",
                data: [{
                    x: 23790803,
                    y: 6.994,
                    r: 80
                }]
            }, {
                label: ["Japan"],
                backgroundColor: "rgba(193,46,12,0.2)",
                borderColor: "rgba(193,46,12,1)",
                data: [{
                    x: 49318377,
                    y: 5.921,
                    r: 50
                }]
            }]
        },
        options: {
            title: {
                display: true,
                text: 'World GDP over Happiness in 2050'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Happiness"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "GDP (Money money money)"
                    }
                }]
            }
        }
    });
}

function scatter(json) {

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'scatter',
        data: {
            datasets: [{
                pointBackgroundColor: 'rgba(173, 20, 20, 0.91)',
                label: 'Scatter Dataset',
                data: [{
                    x: -10,
                    y: 0
                }, {
                    x: 0,
                    y: 10
                }, {
                    x: 10,
                    y: 5
                },
                {
                    x: 10,
                    y: 20
                }, {
                    x: 15,
                    y: 10
                }]
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });
}

function area(json) {

    var x_so_luong_labels = [];
    var data_ghe_dat = [];
    var data_ghe_trong = [];

    for (var i = 0; i < json.baocaosoluongghe.ket_qua_tung_thang.length; ++i) {
        x_so_luong_labels.push("" + json.baocaosoluongghe.ket_qua_tung_thang[i].thang + "/" +
            json.baocaosoluongghe.ket_qua_tung_thang[i].nam);
        data_ghe_dat.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_dat.ghengoi);
        data_ghe_trong.push(json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.giuongnam +
            json.baocaosoluongghe.ket_qua_tung_thang[i].ghe_trong.ghengoi);
    }

    var context = document.getElementById('bieu-do').getContext('2d');

    chart = new Chart(context, {
        type: 'line',
        data: {
            labels: x_so_luong_labels,
            datasets: [{
                    label: "Số lượng ghế đặt hàng tháng",
                    data: data_ghe_dat,
                    backgroundColor: 'rgba(20, 112, 173,0.5)',
                    borderCapStyle: 'square',
                    // borderColor:'rgba(173, 20, 20, 0.91)',
                    fill: '1',
                    pointBackgroundColor: 'rgba(227, 230, 45, 0.91)',
                    spanGaps: true,
                },
                {
                    label: "Số lượng ghế trống hàng tháng",
                    data: data_ghe_trong,
                    backgroundColor: 'rgba(173, 87, 20, 0.91)',
                    borderCapStyle: 'square',
                    fill: 'origin',

                }
            ]
        },
        options: {
            plugins: {
                filler: {
                    propagate: true
                }
            }
        }
    });
}

function mixed(json){
    var context = document.getElementById('bieu-do').getContext('2d');
    chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: ["1900", "1950", "1999", "2050"],
          datasets: [{
              label: "Europe",
              type: "line",
              borderColor: "#8e5ea2",
              data: [408,547,675,734],
              fill: false
            }, {
              label: "Africa",
              type: "line",
              borderColor: "#3e95cd",
              data: [133,221,783,2478],
              fill: false
            }, {
              label: "Europe",
              type: "bar",
              backgroundColor: "rgba(0,0,0,0.2)",
              data: [408,547,675,734],
            }, {
              label: "Africa",
              type: "bar",
              backgroundColor: "rgba(173, 87, 20, 0.91)",
              backgroundColorHover: "#3e95cd",
              data: [133,221,783,2478]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Population growth (millions): Europe & Africa'
          },
          legend: { display: false }
        }
    });
}