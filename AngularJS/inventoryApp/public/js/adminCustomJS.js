

$(document).on('keyup', '#addInventory tbody', function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        $(this).find('tr:last').find('td').find('input.focusMe').focus();
    }
});

//$(document).ready(function () {
//   
//    //bootstrap datepicker
////    $('.datepicker').datepicker({
////        format: 'mm/dd/yyyy',
////        startDate: '-3d'
////    });
//
//    //background image change with time 
//    function changeBgImage() {
//        var seconds = 1;
//        function timeDisp() {
//            $(".image-background").backstretch("images/bg/" + seconds + ".jpg");
//            //seconds++;
//            if (seconds > 9) {
//                seconds = 0;
//            } else {
//                seconds++;
//            }
//        }
//        setInterval(timeDisp, 60000);
//    }
//    $(".image-background").backstretch("images/bg/" + 0 + ".jpg");
//    changeBgImage();
//});
