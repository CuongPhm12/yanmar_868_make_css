const sreenHeight = window.screen.height;

$(".tv_content").height(sreenHeight - 310);

function getYearBasedOnMonth() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다

  // 1월부터 3월까지는 작년 년도를 반환
  if (currentMonth >= 1 && currentMonth <= 3) {
    return currentYear - 1;
  } else {
    // 4월부터 12월까지는 현재 년도를 반환
    return currentYear;
  }
}

function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 +1 해주고 2자리로 포맷팅

  return year + "-" + month;
}

$("#start_ym_ser").val(getYearBasedOnMonth() + "-04");
$("#end_ym_ser").val(getCurrentYearMonth());

$("#start_ym_ser").MonthPicker({
  MonthFormat: "yy-mm",
  ShowIcon: false,
});

$("#end_ym_ser").MonthPicker({
  MonthFormat: "yy-mm",
  ShowIcon: false,
});

$(".ym_ser").on("change", function () {
  var inputValue = $(this).val();

  if (inputValue == "") {
    return;
  }

  // 입력된 값이 6자리이고 숫자인 경우에만 처리합니다.
  if (/^\d{6}$/.test(inputValue)) {
    var formattedValue = inputValue.slice(0, 4) + "-" + inputValue.slice(4, 6);
    $(this).val(formattedValue);
    return;
  }

  if (!/^\d{4}-\d{2}$/.test(inputValue)) {
    $(this).val("");
  }
});

var last_date = new Date();

function refreshScreen() {
  var cur_date = new Date();

  var diff = Math.floor((cur_date - last_date) / 1000);
  var min = Math.floor((300 - diff) / 60);
  var sec = (300 - diff) % 60;
  $("#refresh_time").text(min + ":" + sec.toString().padStart(2, "0"));

  // 년, 월, 일, 요일 정보를 추출합니다.
  var year = last_date.getFullYear();
  var month = last_date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  var day = last_date.getDate();
  var dayOfWeek = last_date.toLocaleDateString("ko-KR", { weekday: "long" });

  // 포맷에 맞게 문자열을 구성합니다.
  var formattedDate =
    "기준일 : " + year + "년 " + month + "월 " + day + "일 (" + dayOfWeek + ")";

  $("#cur_date").text(formattedDate);

  if (diff >= 300) {
    last_date = cur_date;
    callData();
  }
}

setInterval(refreshScreen, 1000);

$("#search").on("click", function () {
  last_date = new Date();
  callData();
});

callData();

function callData() {
  if ($("#LOADYN").val() == "Y") {
    $.isLoading({
      tpl: '<span class="isloading-wrapper %wrapper%"><div class="loadingio-spinner-ellipsis-bus78131cg"><div class="ldio-8a4hfl22cb6"><div></div><div></div><div></div><div></div><div></div></div></div></span>',
    });
  }

  //get data
  var dataPost = {};
  dataPost.type = "get_data";
  dataPost.menucode = "M000000868";
  dataPost.UID = nvl($("#UID").val(), "");
  dataPost.view_yn_ser = $("#view_yn_ser").prop("checked") ? "Y" : "N";

  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      if (status === "success") {
        if (response.status == 200) {
          data_list = response.data_list;

          $(".toto_row").remove();

          for (var i = 0; i < 28; i++) {
            var txt = "";
            if (i >= data_list.length) {
              txt += `<tr class="toto_row" data-id="0">`;
              txt += `    <td class="al"></td>`;
              txt += `    <td class="ac"></td>`;
              txt += `    <td class="al al_css"></td>`;
              txt += `    <td class="ar"></td>`;
              txt += `</tr>`;
            } else {
              var item = data_list[i];

              txt += `<tr class="toto_row" data-id="${item.id}">`;
              txt += `    <td class="al">${item.type2}</td>`;
              txt += `    <td class="ac">${item.createdate}</td>`;
              txt += `    <td class="al al_css">${item.title}</td>`;
              txt += `    <td class="ar">${
                item.view_yn == "Y" ? "O" : ""
              }</td>`;
              txt += `</tr>`;
            }

            var tr = $(txt);
            $("#todo").append(tr);
          }
        }
      }

      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {
      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
  });
}

$("#search_list").on("click", function () {
  callList();
});

callList();

function callList() {
  if ($("#LOADYN").val() == "Y") {
    $.isLoading({
      tpl: '<span class="isloading-wrapper %wrapper%"><div class="loadingio-spinner-ellipsis-bus78131cg"><div class="ldio-8a4hfl22cb6"><div></div><div></div><div></div><div></div><div></div></div></div></span>',
    });
  }

  //get data
  var dataPost = {};
  dataPost.type = "get_list";
  dataPost.menucode = "M000000868";
  dataPost.UID = nvl($("#UID").val(), "");
  dataPost.start_ym_ser = $("#start_ym_ser").val();
  dataPost.end_ym_ser = $("#end_ym_ser").val();

  $.ajax({
    type: "POST",
    url: "/ajax.do",
    dataType: "json",
    data: dataPost,
    success: function (response, status, request) {
      console.log(response);

      if (status === "success") {
        if (response.status == 200) {
          data_list = response.data_list;

          $(".list_row").remove();

          $("#prev_month").text(response.prev_header);
          $("#last_month").text(response.cur_header);
          $("#month_0").text(response.cur_header);
          $("#month_1").text(response.next_header);
          $("#month_2").text(response.next2_header);

          for (var i = 0; i < data_list.length; i++) {
            var item = data_list[i];
            var txt = "";
            if (nvl(item.sales_cd, "") == "") {
              txt += `<tr class="list_row">`;
              txt += `    <td class="al">${item.etc5}</td>`;
              txt += `    <td class="ac btn_toggle" data-id="${item.etc5}">┼</td>`;
              txt += `    <td class="ar">${
                item.plan_qty == 0 ? "" : Number(item.plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.plan_amount == 0
                  ? ""
                  : Number(item.plan_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.prev_qty == 0 ? "" : Number(item.prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.prev_amount == 0
                  ? ""
                  : Number(item.prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.cur_qty == 0 ? "" : Number(item.cur_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.cur_amount == 0
                  ? ""
                  : Number(item.cur_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_qty < 0 ? "text_red" : ""
              }">${
                item.diff_qty == 0 ? "" : Number(item.diff_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_amount < 0 ? "text_red" : ""
              }">${
                item.diff_amount == 0
                  ? ""
                  : Number(item.diff_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.rate_qty == 0 ? "" : item.rate_qty + "%"
              }</td>`;
              txt += `    <td class="ar">${
                item.rate_amount == 0 ? "" : item.rate_amount + "%"
              }</td>`;
              txt += `    <td class="ar">${
                item.ok_qty == 0 ? "" : Number(item.ok_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.out_qty == 0 ? "" : Number(item.out_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.special_qty == 0
                  ? ""
                  : Number(item.special_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ng_qty == 0 ? "" : Number(item.ng_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.stock_qty == 0
                  ? ""
                  : Number(item.stock_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ship_plan_qty1 == 0
                  ? ""
                  : Number(item.ship_plan_qty1).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ship_plan_qty2 == 0
                  ? ""
                  : Number(item.ship_plan_qty2).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ship_plan_qty3 == 0
                  ? ""
                  : Number(item.ship_plan_qty3).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.ship_plan_qty == 0
                  ? ""
                  : Number(item.ship_plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.remain_qty == 0
                  ? ""
                  : Number(item.remain_qty).toLocaleString()
              }</td>`;
              txt += `</tr>`;
            } else {
              txt += `<tr class="list_row" data-parent="${item.etc5}" style="display:none;">`;
              txt += `    <td class="al cell_yellow">${item.sales_cd}</td>`;
              txt += `    <td class="ac"></td>`;
              txt += `    <td class="ar">${
                item.plan_qty == 0 ? "" : Number(item.plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.plan_amount == 0
                  ? ""
                  : Number(item.plan_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.prev_qty == 0 ? "" : Number(item.prev_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.prev_amount == 0
                  ? ""
                  : Number(item.prev_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.cur_qty == 0 ? "" : Number(item.cur_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.cur_amount == 0
                  ? ""
                  : Number(item.cur_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_qty < 0 ? "text_red" : ""
              }">${
                item.diff_qty == 0 ? "" : Number(item.diff_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar ${
                item.diff_amount < 0 ? "text_red" : ""
              }">${
                item.diff_amount == 0
                  ? ""
                  : Number(item.diff_amount).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.rate_qty == 0 ? "" : item.rate_qty + "%"
              }</td>`;
              txt += `    <td class="ar">${
                item.rate_amount == 0 ? "" : item.rate_amount + "%"
              }</td>`;
              txt += `    <td class="ar">${
                item.ok_qty == 0 ? "" : Number(item.ok_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.out_qty == 0 ? "" : Number(item.out_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.special_qty == 0
                  ? ""
                  : Number(item.special_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ng_qty == 0 ? "" : Number(item.ng_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.stock_qty == 0
                  ? ""
                  : Number(item.stock_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ship_plan_qty1 == 0
                  ? ""
                  : Number(item.ship_plan_qty1).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ship_plan_qty2 == 0
                  ? ""
                  : Number(item.ship_plan_qty2).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.ship_plan_qty3 == 0
                  ? ""
                  : Number(item.ship_plan_qty3).toLocaleString()
              }</td>`;
              txt += `    <td class="ar cell_yellow">${
                item.ship_plan_qty == 0
                  ? ""
                  : Number(item.ship_plan_qty).toLocaleString()
              }</td>`;
              txt += `    <td class="ar">${
                item.remain_qty == 0
                  ? ""
                  : Number(item.remain_qty).toLocaleString()
              }</td>`;
              txt += `</tr>`;
            }

            var tr = $(txt);
            $("#list").append(tr);
          }

          $(".btn_toggle").on("click", function () {
            if ($(this).text() == "┼") {
              $(this).text("─");

              var parent = $(this).attr("data-id");
              $(`tr[data-parent="${parent}"]`).show();
            } else {
              $(this).text("┼");
              var parent = $(this).attr("data-id");
              $(`tr[data-parent="${parent}"]`).hide();
            }
          });
        }
      }

      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {
      if ($("#LOADYN").val() == "Y") {
        $.isLoading("hide");
      }
    },
  });
}
