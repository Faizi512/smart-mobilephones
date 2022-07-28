import Common from "./common.js"

class Home extends Common {
  constructor() {
    super();
    var CI = this;
    this.getFormDetails("#msform");

    var current_fs, next_fs, previous_fs; //fieldsets
    var opacity;
    var current = 1;
    var currentTab = 0;
    this.steps = $(".form-card").length;

    this.setProgressBar(current);

    $( ".property" ).change(function() {
      $('.towncity').val($(this).find("option:selected").data("city"))
      $('.street1').val($(this).find("option:selected").data("street"))
      $('.county').val($(this).find("option:selected").data("province"))
      $('.street2').val($(this).find("option:selected").data("street2"))
      $('.building').val($(this).find("option:selected").data("building"))
    });

    $(".next").click(function(){
      current_fs = $(this).parent();
      next_fs = $(this).parent().next();
      //Add Class Active
      $('#msform').parsley().whenValidate({
        group: `block-${current-1}`
      }).done(() =>{
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
          step: function(now) {
          // for making fielset appear animation
            opacity = 1 - now;

            current_fs.css({
              'display': 'none',
              'position': 'relative'
            });
            next_fs.css({'opacity': opacity});
          },
          duration: 500
        });
        if (current == 3) {
          CI.postData();
        }

        CI.setProgressBar(++current);
      })
    });

    $(".previous").click(function(){
      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();
      //Remove class active
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({opacity: 0}, {
        step: function(now) {
          // for making fielset appear animation
          opacity = 1 - now;
          current_fs.css({
            'display': 'none',
            'position': 'relative'
          });
          previous_fs.css({'opacity': opacity});
        },
        duration: 500
      });
      CI.setProgressBar(--current);
    });


    $(".submit").click(function(){
    return false;
    })  

    // $(document).on("click", '.open-form', function() {
    //     $('#formpopup').show()
    //     event.stopPropagation()
    // });  

  }
  setProgressBar(curStep){
    var percent = parseFloat(100 / this.steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
    .css("width",percent+"%")
  }

}
export default new Home();
