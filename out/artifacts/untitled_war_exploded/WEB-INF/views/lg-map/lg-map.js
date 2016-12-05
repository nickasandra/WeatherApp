$(function () {

    var r;

    var mouseX = 0;
    var mouseY = 0;
    var current = null;
    var isPin = false;
    var mapWrapper = $('.lg-map-wrapper');
    var textArea = $('.lg-map-wrapper .lg-map-text');
    var map = $('.lg-map-wrapper #lg-map');
    var containerWidth = mapWrapper.parent().width();
    var useTextAtBottom;
    var win = $(window);
    var winWidth = win.width();

    window.mobileAndTabletcheck = function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    var isMobile = window.mobileAndTabletcheck();
    var isTouchDevice = 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    $.getScript(mapWrapper.data('map'), function () {

        /////////////////////////////
        //Config
        /////////////////////////////
        var mapWidth = config.mapWidth;
        var mapHeight = config.mapHeight;
        var ratio = mapWidth / mapHeight;
        var oMapWidth = mapWidth;

        /////////////////////////////
        //Mouse position
        /////////////////////////////
        if (config.displayMousePosition) {
            $('<div class="mouse-position"><div class="xPos">X: 0</div><div class="yPos">Y: 0</div></div>').appendTo(mapWrapper);
            $('body').css('cursor', 'crosshair');
        }

        /////////////////////////////
        //Text area
        /////////////////////////////
        //Set initial default text
        if (config.useText) {
            textArea.html(config.defaultText);
        }
        else {
            textArea.hide();
        }

        /////////////////////////////
        //Main map function
        /////////////////////////////
        function createMap() {

            var shapeAr = [];

            //start map
            r = new ScaleRaphael('lg-map', config.mapWidth, config.mapHeight),
                attributes = {
                    fill: '#d9d9d9',
                    cursor: 'crosshair',
                    stroke: config.strokeColor,
                    'stroke-width': 1,
                    'stroke-linejoin': 'round',
                    'font-family': 'Verdana',
                    'font-size': '19px',
                    'font-weight': 'bold'
                },
                arr = new Array();

            var regions = {};

            var boxattrs = {};
            var i = 0;

            for (var state in paths) {

                var shortName = paths[state].name.split('-').join('').toLowerCase();
                regions[shortName] = r.set();

                //Create obj
                var obj = regions[shortName];
                obj.attr(attributes);

                if (!paths[i].enable) {
                    boxattrs = {
                        'fill': config.offColor,
                        stroke: config.offStrokeColor
                    };
                } else {
                    boxattrs = {
                        'fill': paths[i].color,
                        stroke: config.strokeColor,
                        'id': i
                    };
                }


                obj.push(r.path(paths[state].path).attr(boxattrs));
                //Only display text on enabled states unless set in config
                if (paths[i].enable && config.displayAbbreviations || !paths[i].enable && config.displayAbbreviationOnDisabledStates) {
                    obj.push(r.text(paths[state].textX, paths[state].textY, paths[state].abbreviation).attr({
                        "font-family": "Arial, sans-serif",
                        "font-weight": "bold",
                        "font-size": config.abbreviationFontSize,
                        "fill": config.abbreviationColor,
                        'z-index': 1000
                    }));
                }


                if (!paths[i].enable) {
                    obj.toFront();
                }

                obj[0].node.id = i;
                if (obj[1]) {
                    obj[1].toFront();
                }


                shapeAr.push(obj[0]);

                var hitArea = r.path(paths[state].path).attr({
                    fill: "#f00",
                    "stroke-width": 0,
                    "opacity": 0,
                    'cursor': paths[i].enable ? (config.displayMousePosition ? 'crosshair' : 'pointer') : 'default'
                });

                hitArea.node.id = i;

                hitArea.mouseover(function (e) {

                    e.stopPropagation();

                    var id = $(this.node).attr('id');

                    if (paths[id].enable) {

                        //Animate if not already the current state
                        if (shapeAr[id] != current) {
                            shapeAr[id].animate({
                                fill: paths[id].hoverColor
                            }, 500);
                        }

                        //tooltip
                        showTooltip(paths[id].name);

                    }

                });


                hitArea.mouseout(function (e) {

                    var id = $(this.node).attr('id');

                    if (paths[id].enable) {

                        //Animate if not already the current state
                        if (shapeAr[id] != current) {
                            shapeAr[id].animate({
                                fill: paths[id].color
                            }, 500);
                        }

                        removeTooltip();

                    }

                });

                hitArea.mouseup(function (e) {

                    var id = $(this.node).attr('id');

                    if (paths[id].enable) {
                        //Reset scrollbar
                        var t = textArea[0];
                        t.scrollLeft = 0;
                        t.scrollTop = 0;

                        //Animate previous state out
                        if (current) {
                            var curid = $(current.node).attr('id');
                            current.animate({
                                fill: isPin ? pins[curid].color : paths[curid].color
                            }, 500);
                        }
                        isPin = false;

                        //Animate next
                        shapeAr[id].animate({
                            fill: paths[id].selectedColor
                        }, 500);

                        current = shapeAr[id];

                        if (config.useText) {
                            //parsing weekday
                            var weekday = new Array(7);
                            weekday[0] = "Sunday";
                            weekday[1] = "Monday";
                            weekday[2] = "Tuesday";
                            weekday[3] = "Wednesday";
                            weekday[4] = "Thursday";
                            weekday[5] = "Friday";
                            weekday[6] = "Saturday";

                            var cityCache = {};
                            cityCache.name = paths[id].text;
                            $.ajax({
                                type: "POST",
                                url: 'http://localhost:8080/cache/getByName',
                                data: JSON.stringify(cityCache),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    var hours;
                                    var currentDay;
                                    var saveDay;
                                    if (response != null && response != "") {
                                        var saveDate = new Date(response[0].saveDate);
                                        var currentDate = new Date();
                                        currentDay = weekday[new Date(currentDate).getDay()];
                                        saveDay = weekday[new Date(saveDate).getDay()];
                                        hours = Math.abs(currentDate - saveDate) / 36e5;
                                        console.log(currentDay+saveDay);
                                    }
                                    if (response != null && response != "" && hours < 3 && currentDay == saveDay) {
                                        console.log("from cache!");
                                        //hide fav elements
                                        $("#fav").attr("ng-show", "false").attr("class", "ng-scope ng-hide");
                                        $("#mainMessage").attr("ng-show", "false").attr("class", "ng-scope ng-hide");
                                        //show map elements
                                        $("#map").attr("ng-show", "true").attr("class", "ng-scope ng-show");
                                        //Day 1
                                        $("#cty").text(response[0].name);
                                        console.log(response[0].name);
                                        $("#date0").text(response[0].date.split("|")[0]);
                                        $("#icon0").attr("src", response[0].icon.split("|")[0]);
                                        $("#day0").text(weekday[new Date(response[0].date.split("|")[0]).getDay()]);
                                        $("#desc0").text(response[0].description.split("|")[0]);
                                        $("#temp0").text(response[0].temp.split("|")[0]);
                                        $("#feels0").text("Feels like: " + response[0].feels.split("|")[0]);
                                        $("#min0").text(response[0].min.split("|")[0]);
                                        $("#max0").text(response[0].max.split("|")[0]);
                                        $("#humidity0").text("Humidity: " + response[0].humidity.split("|")[0] + "%");
                                        $("#rainfall0").text("Rainfall: " + response[0].rainfall.split("|")[0] + "mm");
                                        $("#windspeed0").text("Wind speed: " + response[0].windSpeed.split("|")[0] + "Km/h");
                                        $("#sunrise0").text("Rise: " + response[0].sunrise.split("|")[0]);
                                        $("#sunset0").text("Set: " + response[0].sunset.split("|")[0]);
                                        $("#moonrise0").text("Rise: " + response[0].moonrise.split("|")[0]);
                                        $("#moonset0").text("Set: " + response[0].moonset.split("|")[0]);

                                        for (var i = 1; i < 3; i++) {
                                            $("#date" + i).text(response[0].date.split("|")[i]);
                                            $("#icon" + i).attr("src", response[0].icon.split("|")[i]);
                                            $("#day" + i).text(weekday[new Date(response[0].date.split("|")[i]).getDay()]);
                                            $("#desc" + i).text(response[0].description.split("|")[i]);
                                            $("#temp" + i).text(response[0].temp.split("|")[i]);
                                            $("#feels" + i).text("Feels like: " + response[0].feels.split("|")[i]);
                                            $("#min" + i).text(response[0].min.split("|")[i]);
                                            $("#max" + i).text(response[0].max.split("|")[i]);
                                            $("#humidity" + i).text("Humidity: " + response[0].humidity.split("|")[i] + "%");
                                            $("#rainfall" + i).text("Rainfall: " + response[0].rainfall.split("|")[i] + "mm");
                                            $("#windspeed" + i).text("Wind speed: " + response[0].windSpeed.split("|")[i] + "Km/h");
                                            $("#sunrise" + i).text("Rise: " + response[0].sunrise.split("|")[i]);
                                            $("#sunset" + i).text("Set: " + response[0].sunset.split("|")[i]);
                                            $("#moonrise" + i).text("Rise: " + response[0].moonrise.split("|")[i]);
                                            $("#moonset" + i).text("Set: " + response[0].moonset.split("|")[i]);
                                        }
                                    } else {
                                        console.log("from api!");
                                        $.ajax({
                                            url: 'http://api.worldweatheronline.com/premium/v1/weather.ashx?q=' + paths[id].text +
                                            '&key=d955d43298874365b29132322162511&format=json&num_of_days=3&tp=24',
                                            success: function (result) {
                                                //hide fav elements
                                                $("#fav").attr("ng-show", "false").attr("class", "ng-scope ng-hide");
                                                $("#mainMessage").attr("ng-show", "false").attr("class", "ng-scope ng-hide");
                                                //show map elements
                                                $("#map").attr("ng-show", "true").attr("class", "ng-scope ng-show");
                                                //adding data
                                                var weekday = new Array(7);
                                                weekday[0] = "Sunday";
                                                weekday[1] = "Monday";
                                                weekday[2] = "Tuesday";
                                                weekday[3] = "Wednesday";
                                                weekday[4] = "Thursday";
                                                weekday[5] = "Friday";
                                                weekday[6] = "Saturday";

                                                var w = result.data;
                                                var current = result.data.current_condition[0];
                                                $("#cty").text(w.request[0].query);
                                                $("#date0").text(w.weather[0].date);
                                                $("#icon0").attr("src", current.weatherIconUrl[0].value);
                                                $("#day0").text(weekday[new Date(w.weather[0].date).getDay()]);
                                                $("#desc0").text(current.weatherDesc[0].value);
                                                $("#temp0").text(current.temp_C);
                                                $("#feels0").text("Feels like: " + current.FeelsLikeC);
                                                $("#min0").text(w.weather[0].mintempC);
                                                $("#max0").text(w.weather[0].maxtempC);
                                                $("#humidity0").text("Humidity: " + current.humidity + "%");
                                                $("#rainfall0").text("Rainfall: " + current.precipMM + "mm");
                                                $("#windspeed0").text("Wind speed: " + current.windspeedKmph + "Km/h");
                                                $("#sunrise0").text("Rise: " + w.weather[0].astronomy[0].sunrise);
                                                $("#sunset0").text("Set: " + w.weather[0].astronomy[0].sunset);
                                                $("#moonrise0").text("Rise: " + w.weather[0].astronomy[0].moonrise);
                                                $("#moonset0").text("Set: " + w.weather[0].astronomy[0].moonset);

                                                for (var i = 1; i < w.weather.length; i++) {
                                                    $("#date" + i).text(w.weather[i].date);
                                                    $("#icon" + i).attr("src", w.weather[i].hourly[0].weatherIconUrl[0].value);
                                                    $("#day" + i).text(weekday[new Date(w.weather[i].date).getDay()]);
                                                    $("#desc" + i).text(w.weather[i].hourly[0].weatherDesc[0].value);
                                                    $("#temp" + i).text(w.weather[i].hourly[0].tempC);
                                                    $("#feels" + i).text("Feels like: " + w.weather[i].hourly[0].FeelsLikeC);
                                                    $("#min" + i).text(w.weather[i].mintempC);
                                                    $("#max" + i).text(w.weather[i].maxtempC);
                                                    $("#humidity" + i).text("Humidity: " + w.weather[i].hourly[0].humidity + "%");
                                                    $("#rainfall" + i).text("Rainfall: " + w.weather[i].hourly[0].precipMM + "mm");
                                                    $("#windspeed" + i).text("Wind speed: " + w.weather[i].hourly[0].windspeedKmph + "Km/h");
                                                    $("#sunrise" + i).text("Rise: " + w.weather[i].astronomy[0].sunrise);
                                                    $("#sunset" + i).text("Set: " + w.weather[i].astronomy[0].sunset);
                                                    $("#moonrise" + i).text("Rise: " + w.weather[i].astronomy[0].moonrise);
                                                    $("#moonset" + i).text("Set: " + w.weather[i].astronomy[0].moonset);
                                                }

                                                //Setting variables for caching!
                                                cityCache.date = w.weather[0].date + "|" + w.weather[1].date + "|" + w.weather[2].date;
                                                cityCache.dayName = weekday[new Date(w.weather[0].date).getDay()] + "|" + weekday[new Date(w.weather[1].date).getDay()] + "|" + weekday[new Date(w.weather[2].date).getDay()];
                                                cityCache.feels = current.FeelsLikeC + "|" + w.weather[1].hourly[0].FeelsLikeC + "|" + w.weather[2].hourly[0].FeelsLikeC;
                                                cityCache.humidity = current.humidity + "|" + w.weather[1].hourly[0].humidity + "|" + w.weather[2].hourly[0].humidity;
                                                cityCache.icon = current.weatherIconUrl[0].value + "|" + w.weather[1].hourly[0].weatherIconUrl[0].value + "|" + w.weather[2].hourly[0].weatherIconUrl[0].value;
                                                cityCache.max = w.weather[0].maxtempC + "|" + w.weather[1].maxtempC + "|" + w.weather[2].maxtempC;
                                                cityCache.min = w.weather[0].mintempC + "|" + w.weather[1].mintempC + "|" + w.weather[2].mintempC;
                                                cityCache.moonrise = w.weather[0].astronomy[0].moonrise + "|" + w.weather[1].astronomy[0].moonrise + "|" + w.weather[2].astronomy[0].moonrise;
                                                cityCache.moonset = w.weather[0].astronomy[0].moonset + "|" + w.weather[1].astronomy[0].moonset + "|" + w.weather[2].astronomy[0].moonset;
                                                cityCache.rainfall = current.precipMM + "|" + w.weather[1].hourly[0].precipMM + "|" + w.weather[2].hourly[0].precipMM;
                                                cityCache.saveDate = new Date();
                                                cityCache.sunrise = w.weather[0].astronomy[0].sunrise + "|" + w.weather[1].astronomy[0].sunrise + "|" + w.weather[2].astronomy[0].sunrise;
                                                cityCache.sunset = w.weather[0].astronomy[0].sunset + "|" + w.weather[1].astronomy[0].sunset + "|" + w.weather[2].astronomy[0].sunset;
                                                cityCache.temp = current.temp_C + "|" + w.weather[1].hourly[0].tempC + "|" + w.weather[2].hourly[0].tempC;
                                                cityCache.windSpeed = current.windspeedKmph + "|" + w.weather[1].hourly[0].windspeedKmph + "|" + w.weather[2].hourly[0].windspeedKmph;
                                                cityCache.description = current.weatherDesc[0].value + "|" + w.weather[1].hourly[0].weatherDesc[0].value + "|" + w.weather[2].hourly[0].weatherDesc[0].value;

                                                $.ajax({
                                                    type: "POST",
                                                    url: 'http://localhost:8080/cache/save',
                                                    data: JSON.stringify(cityCache),
                                                    contentType: "application/json; charset=utf-8",
                                                    dataType: "json",
                                                    success: function (response) {
                                                        console.log(response);
                                                    }
                                                });

                                            }

                                        });

                                    }
                                }
                            });


                            textArea.html(paths[id].text);
                        } else {
                            window.open(paths[id].url, config.hrefTarget);
                        }
                    }
                });


                i++;
            }
            if (!config.displayMousePosition) {
                resizeMap();
                if (config.responsive) {
                    $(window).resize(function () {
                        resizeMap();
                    });
                }
            }

        }

        /////////////////////////////
        //Main pins function
        /////////////////////////////
        function createPins() {

            for (var i = 0; i < pins.length; i++) {

                var pinattrs = {
                    'cursor': 'pointer',
                    'fill': pins[i].color,
                    'stroke': config.strokeColor,
                    'id': i
                };

                var pin = r.circle(pins[i].xPos, pins[i].yPos, config.pinSize).attr(pinattrs);
                pin.node.id = i;

                pin.mouseover(function (e) {

                    e.stopPropagation();

                    var id = $(this.node).attr('id');

                    //Animate if not already the current state
                    if (this != current) {
                        this.animate({
                            fill: pins[id].hoverColor
                        }, 500);
                    }

                    //tooltip
                    showTooltip(pins[id].name);

                });

                pin.mouseout(function (e) {

                    var id = $(this.node).attr('id');

                    //Animate if not already the current state
                    if (this != current) {
                        this.animate({
                            fill: pins[id].color
                        }, 500);
                    }

                    removeTooltip();

                });

                pin.mouseup(function (e) {

                    var id = $(this.node).attr('id');

                    //Reset scrollbar
                    var t = textArea[0];
                    t.scrollLeft = 0;
                    t.scrollTop = 0;

                    //Animate previous state out
                    if (current) {
                        var curid = $(current.node).attr('id');
                        current.animate({
                            fill: isPin ? pins[curid].color : paths[curid].color
                        }, 500);
                    }
                    isPin = true;

                    //Animate next
                    this.animate({
                        fill: pins[id].selectedColor
                    }, 500);

                    current = this;

                    if (config.useText == true) {
                        textArea.html(pins[id].text);
                    } else {
                        window.open(pins[id].url, config.hrefTarget);
                    }

                });

            }
        }


        /////////////////////////////
        //Resize map functions
        /////////////////////////////
        function resizeMap() {

            containerWidth = mapWrapper.parent().width();
            winWidth = win.width();

            if (config.useText) {

                //Force text to bottom on mobile
                useTextAtBottom = winWidth >= 767 ? config.useTextAtBottom : true;

                if (useTextAtBottom) {
                    mapWidth = containerWidth;
                    mapHeight = mapWidth / ratio;
                    mapWrapper.css({
                        'width': mapWidth + 'px',
                        'height': mapHeight + 'px'
                    });
                    textArea.css({
                        'width': mapWidth + 'px',
                        'marginTop': mapHeight + 'px'
                    });
                }
                else {
                    mapWidth = containerWidth - config.textAreaWidth;
                    mapHeight = mapWidth / ratio;
                    mapWrapper.css({
                        'width': winWidth >= 767 ? mapWidth + config.textAreaWidth + 'px' : mapWidth + 'px',
                        'height': mapHeight + 'px'
                    });
                    textArea.css({
                        'width': winWidth >= 767 ? config.textAreaWidth + 'px' : mapWidth + 'px',
                        'height': winWidth >= 767 ? mapHeight + 'px' : config.textAreaHeight,
                        'display': 'inline',
                        'float': winWidth >= 767 ? 'right' : 'none',
                        'marginTop': winWidth >= 767 ? 0 : mapHeight + 'px'
                    });
                }
            }
            else {
                mapWidth = containerWidth;
                mapHeight = mapWidth / ratio;
                mapWrapper.css({
                    'width': mapWidth + 'px',
                    'height': mapHeight + 'px'
                });
            }

            r.changeSize(mapWidth, mapHeight, true, false);

        }

        /////////////////////////////
        //Tooltip
        /////////////////////////////
        function showTooltip(text) {
            if (isTouchDevice && isMobile) {
                return;
            }
            removeTooltip();
            map.after($('<div />').addClass('tooltip'));
            $('.tooltip').html(text).css({
                left: mouseX - 50,
                top: mouseY - 70
            }).fadeIn();
        }

        function removeTooltip() {
            map.next('.tooltip').remove();
        }


        /////////////////////////////
        //Mouse events
        /////////////////////////////

        // Main function to retrieve mouse x-y pos.s
        function getMouseXY(e) {

            var scrollTop = $(window).scrollTop();

            if (e && e.pageX) {
                mouseX = e.pageX;
                mouseY = e.pageY - scrollTop;
            } else {
                mouseX = event.clientX + document.body.scrollLeft;
                mouseY = event.clientY + document.body.scrollTop;
            }
            // catch possible negative values
            if (mouseX < 0) {
                mouseX = 0;
            }
            if (mouseY < 0) {
                mouseY = 0;
            }

            map.next('.tooltip').css({
                left: mouseX - 50,
                top: mouseY - 70
            });

            if (config.displayMousePosition) {
                var scrollTop = win.scrollTop();
                var offset = mapWrapper.offset();
                var relX = Math.round(mouseX - offset.left);
                var relY = Math.round(mouseY - offset.top + scrollTop);
                $('.mouse-position .xPos').text('X: ' + relX);
                $('.mouse-position .yPos').text('Y: ' + relY);
            }
        }

        // Set-up to use getMouseXY function onMouseMove
        document.body.onmousemove = getMouseXY;


        /////////////////////////////
        //Init map
        /////////////////////////////
        createMap();
        createPins();

    });


});