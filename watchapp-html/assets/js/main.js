(function ($) {
  "use strict";

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
  });
})(jQuery);


// (function ($) {
//   "use strict";

//   var fullHeight = function () {
//     $(".js-fullheight").css("height", $(window).height());
//     $(window).resize(function () {
//       $(".js-fullheight").css("height", $(window).height());
//     });
//   };
//   fullHeight();

//   $("#sidebarCollapse1").on("click", function () {
//     $("#sidebar1").toggleClass("active");
//   });
// })(jQuery);
