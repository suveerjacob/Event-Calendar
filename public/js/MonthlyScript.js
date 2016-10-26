

var eventObject = null;
window.onload = () => {

    var d = new Date();
    var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month = d.getMonth();   //0-11
    var year = d.getFullYear(); //2014
    var first_date = month_name[month] + " 1 " + year;
    $("#date_here").text(month_name[month] + " " + year);

    var get_allData = {
        method: "GET",
        url: '/getWholeData'
    };

    $.ajax(get_allData).then(function (allData) {
        eventObject = allData;
        get_calendar(first_date);
    });

    $(".update_month").click(function (e) {

        if ($(this).val() === "prev") {
            //console.log("Prev Clicked");
            if (month == 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
        } else if ($(this).val() === "next") {
            //console.log("Next Clicked");
            if (month == 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
        }

        first_date = month_name[month] + " 1 " + year;
        $("#date_here").text(month_name[month] + " " + year);
        get_calendar(first_date);
    });

    $("#common_add_event_btn").click(() => {
        $("#common_add_event_modal").modal("toggle");
    });

    $("#add_monthly").click(() => {
        console.log("Add Monthly Event called");
        $("#warning").addClass('hidden')

        validateAddEvent().then(function (request_obj) {
            console.log("In Then");
            $.ajax(request_obj).then(function (response) {
                $("#common_add_event_modal").modal("toggle");
                window.location.reload(true);
            });
        }, function (ex) {
            console.log("In Error");
            $("#warning").text("");
            $("#warning").text(ex);
            $("#warning").removeClass('hidden');
        });
    });

    $(document.body).on('click', '.date', function () {
        //console.log("Hello");
        var date_clicked = month_name[month] + " " + $(this).find(".desktop_date").text() + " " + year;
        //console.log(date_clicked);
        window.location.href = '/dailyView?date=' + date_clicked;
    });
}



function validateAddEvent() {
    return new Promise(function (resolve, reject) {
        var date = $("#date_picker").val();
        var title = $("#title").val();
        var location = $("#location").val();
        var description = $("#description").val();

        if (date == "" || date == null || checkDate(date) == false) {
            reject("Invalid Date");
            return;
        }

        if (title == "" || title == null || title == undefined) {
            reject("Invalid Title");
            return;
        }

        if (location == "" || location == null || location == undefined) {
            reject("Invalid Location");
            return;
        }

        if (description == "" || description == null || description == undefined) {
            reject("Invalid Description");
            return;
        }


        $("#warning").addClass('hidden')
        console.log("All test Passed");
        var date_of_event = checkDate(date);
        var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var date_str = month_name[date_of_event.getMonth()] + " " + date_of_event.getDate() + " " + date_of_event.getFullYear();

        var obj = {};
        obj.title = title;
        obj.location = location;
        obj.description = description;
        if (eventObject.hasOwnProperty(date_str)) {
            eventObject[date_str].push(obj);
        } else {
            eventObject[date_str] = [];
            eventObject[date_str].push(obj);
        }

        var saveData = {
            method: 'POST',
            url: '/saveWholeData',
            contentType: "application/json",
            data: JSON.stringify(eventObject)
        };
        resolve(saveData);
    });

}

function checkDate(str) {
    //var matches = str.match(/(\d{1,2})[- \/](\d{1,2})[- \/](\d{4})/);
    var matches = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!matches) {
        return false;
    }

    // convert pieces to numbers
    // make a date object out of it
    var month = parseInt(matches[1], 10);
    var day = parseInt(matches[2], 10);
    var year = parseInt(matches[3], 10);
    var date = new Date(year, month - 1, day);
    if (!date || !date.getTime()) return false;

    // make sure we didn't have any illegal 
    // month or day values that the date constructor
    // coerced into valid values
    if (date.getMonth() + 1 != month ||
        date.getFullYear() != year ||
        date.getDate() != day) {
        return false;
    }
    return (date);
}


function get_calendar(first_date) {
    //console.log(eventObject);
    $("#calendar-dates").empty();
    var dt = new Date(first_date);
    var tmp = dt.toDateString();
    //Mon Sep 01 2014 ...
    var first_day = tmp.substring(0, 3);    //Mon 
    var day_name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day_no = day_name.indexOf(first_day);   //1
    var all_days = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

    //row for the days 
    var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    for (var c = 0; c <= 6; c++) {
        var days_item = document.createElement('div');
        $(days_item).addClass("flex-item days");
        days_item.innerHTML = days[c];
        $("#calendar-dates").append(days_item);
    }

    // Adding Empty Cells
    var c;
    for (c = 0; c <= 6; c++) {
        if (c == day_no) {
            break;
        }
        var days_item = document.createElement('div');
        $(days_item).addClass("flex-item empty");
        $("#calendar-dates").append(days_item);
    }

    for (var i = 1; i <= all_days; i++) {
        var days_item = document.createElement('div');
        $(days_item).addClass("flex-item date");
        var mobile_date = document.createElement('span');
        $(mobile_date).addClass("mobile_date");
        var desktop_date = document.createElement('span');
        $(desktop_date).addClass("desktop_date");
        var d = day_name[c];
        c++;
        if (c == 7) c = 0;

        var currentDate = new Date();
        if (i == currentDate.getDate() && dt.getMonth() == currentDate.getMonth() && dt.getFullYear() == currentDate.getFullYear()) {
            $(days_item).addClass("flex-item date current");
        }
        mobile_date.innerHTML = d + ", " + month_name[dt.getMonth()] + " " + i;
        desktop_date.innerHTML = i;


        $(days_item).append(mobile_date);
        $(days_item).append(desktop_date);
        var date_Str = month_name[dt.getMonth()] + " " + i + " " + dt.getFullYear();

        if (eventObject.hasOwnProperty(date_Str)) {
            //console.log("Exists for: " + date_Str);
            var ul = document.createElement('ul');
            $(ul).addClass("list-group mobile_date");
            $(ul).append("<strong>Events: </strong>");
            var list = [];
            list = eventObject[date_Str];

            var eventIcon = $('<span class="event-icon glyphicon glyphicon-calendar desktop_date"></span>')

            $.each(list, function (index, value) {
                //console.log(value.title);    
                var li = $('<li><span class="glyphicon glyphicon-chevron-right"></span>&nbsp;</li>');
                $(li).addClass("list-group-item");
                $(li).append(value.title);
                $(ul).append(li);
            });
            $(days_item).append(ul);
            $(days_item).append(eventIcon);
        }



        $("#calendar-dates").append(days_item);
    }
}


// Function called when Daily View page is Loaded
function dailyViewLoaded(param) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var get_allData = {
        method: "GET",
        url: '/getWholeData'
    };
    console.log("Daily View Page loaded " + param);
    var dateSelected = new Date(param);

    $.ajax(get_allData).then(function (allData) {
        eventObject = allData;
        changeDate(dateSelected);
    });

    $("#back_to_month").click(() => {
        window.location.href = '/';
    });
    $("div#incr_date").click(() => {
        dateSelected.setDate(dateSelected.getDate() + 1);
        changeDate(dateSelected);
    });

    $("div#decr_date").click(() => {
        dateSelected.setDate(dateSelected.getDate() - 1);
        changeDate(dateSelected);
    });

    $("#daily_add_event_btn").click(() => {
        var date_string_1 = (dateSelected.getMonth() + 1) + "/" + dateSelected.getDate() + "/" + dateSelected.getFullYear();
        $("#date_picker").val(date_string_1);
        $("#date_picker").prop('disabled', true);
        $("#daily_add_event_modal").modal("toggle");
    });

    $("#add_daily").click(() => {
        console.log("Add Monthly Event called");
        $("#warning").addClass('hidden')

        validateAddEvent().then(function (request_obj) {
            $.ajax(request_obj).then(function (response) {
                $("#common_add_event_modal").modal("toggle");
                var date_clicked = months[dateSelected.getMonth()] + " " + dateSelected.getDate() + " " + dateSelected.getFullYear();
                window.location.href = '/dailyView?date=' + date_clicked;
            });
        }, function (ex) {
            $("#warning").text("");
            $("#warning").text(ex);
            $("#warning").removeClass('hidden');
        });
    });
    function days_left(date1) {

        var date2 = new Date("December 31 " + date1.getFullYear());
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = date2.getTime()

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms)

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY)
    }
    function weekspassed(date) {
        var start = new Date("January 01 " + date.getFullYear());
        return Math.floor(Math.abs(start - date) / (1000 * 60 * 60 * 24 * 7));
    }

    function changeDate(focusedDate) {

        $('#day_detail_1').text("Days Left in year : " + days_left(focusedDate));
        $('#day_detail_2').text("Weeks Passed in this year : " + weekspassed(new Date(focusedDate)));

        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var tempSelected = new Date(focusedDate);
        var date_string = months[tempSelected.getMonth()] + " " + tempSelected.getDate() + " " + tempSelected.getFullYear();
        $("#selected_date").text("Events for " + days[tempSelected.getDay()] + ", " + date_string);
        tempSelected.setDate(tempSelected.getDate() - 2);
        for (var i = 1; i <= 5; i++) {
            var mobile_date = document.createElement('span');
            $(mobile_date).addClass("mobile_date");
            var desktop_date = document.createElement('span');
            $(desktop_date).addClass("desktop_date");
            var temp_date_str = months[tempSelected.getMonth()] + " " + tempSelected.getDate() + " " + tempSelected.getFullYear();
            mobile_date.innerHTML = days[tempSelected.getDay()] + ", " + months[tempSelected.getMonth()] + " " + tempSelected.getDate();
            desktop_date.innerHTML = (tempSelected.getMonth() + 1) + "/" + tempSelected.getDate();
            $("#date_" + i).empty();
            $("#date_" + i).data("date", temp_date_str);
            $("#date_" + i).append(desktop_date);
            $("#date_" + i).append(mobile_date);
            tempSelected.setDate(tempSelected.getDate() + 1);
        }

        if (eventObject.hasOwnProperty(date_string)) {
            var list = [];
            list = eventObject[date_string];
            $("#daily-item-list").empty();
            $.each(list, function (index, value) {
                var li = $('<li><span class="glyphicon glyphicon-chevron-right"></span></li>');
                $(li).data('event-detail', value);
                $(li).data('event-date', date_string);
                $(li).addClass("list-group-item");
                $(li).append('<button type="button" class="event btn btn-link">' + value.title + '</button>');
                $("#daily-item-list").append(li);
            });
        } else {
            $("#daily-item-list").empty();
            var li = document.createElement('li');
            $(li).addClass("list-group-item");
            $(li).text("No Events for this date.");
            $("#daily-item-list").append(li);
        }
    }

    $("#daily-item-list").on('click', '.event', function (e) {
        console.log("Event Clicked");
        var event_details = ($(this).parent()).data('event-detail');

        $("#event-title").text(event_details.title);
        $("#event-date").text(($(this).parent()).data('event-date'));
        $("#event-location").text(event_details.location);
        $("#event-description").text(event_details.description);

        $("#event_modal").modal("toggle");

    });

    $(".near_dates").click(function () {
        //console.log("Near dates clicked" );
        //console.log($(this).data("date"));
        window.location.href = '/dailyView?date=' + $(this).data("date");
    });
}

