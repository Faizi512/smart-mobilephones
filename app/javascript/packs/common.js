import 'parsleyjs/src/parsley';
import 'bootstrap/dist/js/bootstrap.js'
import _ from 'lodash'
import $ from "jquery"

class Common {
  constructor() {
    var CI = this;
    this.formResponse=null
    this.formValidation = {}
    this.validate();
    this.currentTab = 0;
    this.repairOption = ""
    this.details = {};
  }

  getFormDetails(form){
    var data = $(form)[0].dataset.details
    this.details = JSON.parse(data)
  }

  popupTerms(){
    $( ".close" ).click(function() {
      $('.modal').hide();
    });
  }

  validate(){
    this.formValidation = $('#msform').parsley({
      trigger: "focusout",
      errorClass: 'error',
      successClass: 'valid',
      errorsWrapper: '<div class="parsley-error-list"></div>',
      errorTemplate: '<label class="error"></label>',
      errorsContainer (field) {
        if(field.$element.hasClass('approve')){
          return $('.error-checkbox')
        }
        if(field.$element.hasClass('error-on-button')){
          return $(field.element.closest(".tab").querySelector(".error-box"))
        }
        return field.$element.parent()
      },
    })
    this.validateEmail()
    this.validateApiPostcode()
    this.validatePhone()
  }

  validateEmail(){
    var CI = this
    window.Parsley.addValidator('validemail', {
      validateString: function(value){
        var xhr = $.ajax('https://go.webformsubmit.com/dukeleads/restapi/v1.2/validate/email?key=50f64816a3eda24ab9ecf6c265cae858&value='+$('.email').val())
        return xhr.then(function(json) {
          if (json.status == "Valid") {
            CI.isEmail = true
            return true
          }else if(json.status == "Invalid"){
            return $.Deferred().reject("Please Enter Valid Email Address");
          }else{
            CI.isEmail = true
            return true
          }
        }).catch(function(e) {
          if (e == "Please Enter Valid Email Address") {
            return $.Deferred().reject("Please Enter Valid Email Address")
          }else{
            CI.isEmail = true
            return true
          }
        });
      },
      messages: {
         en: 'Please Enter Valid Email Address',
      }
    });
  }

  validatePhone(){
    var CI = this
    window.Parsley.addValidator('validphone', {
      validateString: function(value){
        var xhr = $.ajax('https://go.webformsubmit.com/dukeleads/restapi/v1.2/validate/mobile?key=50f64816a3eda24ab9ecf6c265cae858&value='+$('.phone').val())
        return xhr.then(function(json) {
          var skipresponse = ["EC_ABSENT_SUBSCRIBER", "EC_ABSENT_SUBSCRIBER_SM", "EC_CALL_BARRED", "EC_SYSTEM_FAILURE","EC_SM_DF_memoryCapacityExceeded", "EC_NO_RESPONSE", "EC_NNR_noTranslationForThisSpecificAddress", "EC_NNR_MTPfailure", "EC_NNR_networkCongestion"]
          if (skipresponse.includes(json.response) && json.status == "Valid" ) {
            CI.isPhone = true
            $(".global-phone-success").addClass("d-inline-block")
            return true
          }
          else if (json.status == "Valid") {
            $(".global-phone-success").addClass("d-inline-block")
            CI.isPhone = true
            return true
          }else if(json.status == "Invalid"){
            $(".global-phone-success").removeClass("d-inline-block")
            return $.Deferred().reject(`Please Enter Valid Phone Number`);
          }else if(json.status == "Error"){
            return $.Deferred().reject(`Please Enter Valid Phone Number`);
          }else{
            CI.isPhone = true
            return true
          }
        }).catch(function(e) {
          if (e == `Please Enter Valid Phone Number`) {
            return $.Deferred().reject(`Please Enter Valid Phone Number`)
          }else{
            CI.isPhone = true
            $(".global-phone-success").addClass("d-inline-block")
            return true
          }
        });
      },
      messages: {
         en: `Please Enter Valid Phone Number` ,
      }
    });
  }

  validateApiPostcode(){
    var CI = this;
    window.Parsley.addValidator('validapipostcode', {
      validateString: function(value){
        return $.ajax({
          url:`https://api.getAddress.io/find/${$(".postcode").val()}?api-key=NjGHtzEyk0eZ1VfXCKpWIw25787&expand=true`,
          success: function(json){
            $(".property-div").show()
            if (json.addresses.length > 0) {
              var result = json.addresses
              var adresses = []
               adresses.push( `
                <option
                disabled=""
                selected=""
                >
                Select Your Property
                </option>
              `)
              for (var i = 0; i < result.length; i++) {
                adresses.push( `
                    <option
                    data-street="${result[i].line_1 || result[i].thoroughfare}"
                    data-city="${result[i].town_or_city}"
                    data-province="${result[i].county || result[i].town_or_city}"
                    data-street2="${result[i].line_2}"
                    data-building="${result[i].building_number || result[i].sub_building_number || result[i].building_name || result[i].sub_building_name}"
                    >
                    ${result[i].formatted_address.join(" ").replace(/\s+/g,' ')}
                    </option>
                  `)
                }
                $('#property').html(adresses)
                $(".address-div").remove();
              return true
            }else{
              $(".tab").removeClass("in-progress")
              return $.Deferred().reject("Please Enter Valid Postcode");
            }
          },
          error: function(request){
            console.log(request.statusText)
            request.abort();
            if (request.statusText == "timeout") {
              $(".property-div").remove();
            }
          },
          timeout: 5000
        })
      },
      messages: {
         en: 'Please Enter Valid Postcode',
      }
    });
  }

  showTab(n=0) {
    var tabs = $(".tab");
    if (!tabs[n]) return;
    tabs[n].style.display = "block";
    $(".tab").removeClass("in-progress")
  }

  backStep($step, $pag, n){
    if ($step.index() > 0) {
      setTimeout(function(){
        $step.removeClass('animate-out is-showing')
        .prev().addClass('animate-in');
        $pag.removeClass('is-active')
        .prev().addClass('is-active');
      }, 600);
      setTimeout(function(){
        $step.prev().removeClass('animate-in')
        .addClass('is-showing');
      }, 1200);
    }
  }

  showCircle(){
    $(".tab").addClass("in-progress")
  }

  nextStep($step, $pag, n) {
    var CI = this;
    $('#dealform').parsley().whenValidate({
      group: 'block-' + this.currentTab
    }).done(() =>{
      var tabs = $(".tab");
      CI.currentTab = CI.currentTab + n;
      if (CI.currentTab >= tabs.length) {
        if (CI.customValidator('#dealform') == true && CI.isPhone == true && CI.isEmail == true){ 
          $('.but_loader').show()
          $('.nextStep').prop('disabled', true);
          CI.postData()
        }else{
          $('#dealform').parsley().validate()
        }
        return true
      }
      CI.showTab(CI.currentTab);
    })
  }

  getData() {
    var phone = $(".phone").val() || this.getUrlParameter('phone1') || '';
    phone = phone.split(" ").join("");

    return {
      sid: this.getUrlParameter('sid') || 1,
      ssid: this.getUrlParameter('ssid') || 1,
      source: this.getUrlParameter('source') || '',
      optindate: this.getFormattedCurrentDate(),
      optinurl: 'https://smartphonedeals.co.uk' + window.location.pathname,
      firstname: $(".first_name").val() || this.getUrlParameter('firstname') || '',
      lastname: $(".last_name").val() || this.getUrlParameter('lastname') || '',
      email: $(".email").val() || this.getUrlParameter('email') || '',
      phone1: $(".phone").val() || this.getUrlParameter('phone1') || '',
      ipaddress: this.details.ipaddress,
      campaignkey: 'E9F2N6A3R5',
      street1: this.getUrlParameter('street1') || $(".street1").val() || $(".address").val() || 'unknown',
      building: this.getUrlParameter('houseNumber') || $(".houseNumber").val() || "",
      towncity: this.getUrlParameter('towncity') || $(".towncity").val() || 'unknown',
      postcode: this.getUrlParameter('postcode') || $(".postcode").val() || '',
      c1: this.getUrlParameter('c1') || this.getUrlParameter('bstransid') || this.getUrlParameter('transid') || this.c1 || "",
    };
  }

  firePixel(){
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({'event': 'transaction'})
  }

  postData() {
    // Getting Data
    var CI = this;
    var data = this.getData();
    let leadFormData = new FormData()

    leadFormData.append("firstName", $(".first_name").val() || this.getUrlParameter('firstname') || '')
    leadFormData.append("lastName", $(".last_name").val() || this.getUrlParameter('lastname') || '')
    leadFormData.append("email", $(".email").val() || this.getUrlParameter('email') || '')
    leadFormData.append("mobilePhone", $(".phone").val() || this.getUrlParameter('phone1') || '')
    leadFormData.append("apiId", 'A5DB0BA533814A9A9AD70E12BA1389A0')
    leadFormData.append("apiPassword", '40fe38d32')
    leadFormData.append("postCode", this.getUrlParameter('postcode') || $(".postcode").val() || '')
    leadFormData.append("street", this.getUrlParameter('street1') || $(".street1").val() || $(".address").val() || 'unknown')
    leadFormData.append("city", this.getUrlParameter('towncity') || $(".towncity").val() || 'unknown')
    leadFormData.append("testMode", '1')


debugger
    $.ajax({
      type: "POST",
      beforeSend: function(request) {
        request.setRequestHeader("Access-Control-Allow-Origin", "*");
      },
      url: "https://leads-inst47-client.phonexa.uk/lead/",
      data: {
        "firstName": data.firstname,
        "lastName": data.lastname,
        "email": data.email,
        "mobilePhone": data.phone1,
        "postCode": data.postcode,
        "street": data.street1,
        "city": data.towncity,
        "apiId": "A5DB0BA533814A9A9AD70E12BA1389A0",
        "apiPassword": "40fe38d32"
      },
      success: function(data) {
        console.log(data)
      },
      error: function (jqXhr, textStatus, errorMessage) { // error callback 
        console.log(textStatus)
        console.log(errorMessage)
      },
      dataType: "json"
    })
    // Form Submisson
    this.submitLead(data, this.details.camp_id)
    // Redirection after submisson
  }

  submitLead(formData, campid){
    var CI = this
    // this.submitLeadToStore(formData)
    this.checkLeadStatus(formData)
    this.exitDelivery()

    $.ajax({
      type: "POST",
      url: "https://go.webformsubmit.com/dukeleads/waitsubmit?key=eecf9b6b61edd9e66ca0f7735dfa033a&campid=" + campid,
      data: formData,
      success: function(data) {
        console.log(data)
      },
      dataType: "json"
    })
    CI.firePixel();
  }

  exitUrl(data){
    var CI = this
    // if lead is accepted
    if(this.formResponse == "success"){
      window.location = `/api/v1/redirect_url?id=${data.sold_url.id}&url=${this.urlCreator(data.sold_url.url)}`
    }else if(this.formResponse == "reject"){
      window.location = `/api/v1/redirect_url?id=${data.unsold_url.id}&url=${this.urlCreator(data.unsold_url.url)}`
    }else{
      setTimeout(function(){
        CI.exitUrl(data)
      }, 500)
    }
  }

  exitDelivery(){
    var CI = this
    $.ajax({
      type: "GET",
      url: `/api/v1/exit_deliveries?source=${this.getSourceFromURL()}&device=${this.device}`,
      success: function(response) {
        console.log(response)
        CI.exitUrl(response)
      },
      error: function(request){
      },
    })
  }
  checkLeadStatus(formData){
    var CI = this
    $.ajax({
      type: "GET",
      url: `/lead_search?phone=${formData.phone1}`,
      success: function(data) {
        console.log(data)
        console.log("checkLeadStatus: "+new Date())
        if (data.match == 0) {
          CI.formResponse =  'success'
        }else{
          CI.formResponse =  'reject'
          // CI.submitAccpedLead(formData)
        }
      },
      error: function(request){
        console.log(request.statusText)
      },
      dataType: "json"
    })
  }

  getFormattedCurrentDate() {
    var date = new Date();
    var day = this.addZero(date.getDate());
    var monthIndex = this.addZero(date.getMonth() + 1);
    var year = date.getFullYear();
    var min = this.addZero(date.getMinutes());
    var hr = this.addZero(date.getHours());
    var ss = this.addZero(date.getSeconds());

    return day + '/' + monthIndex + '/' + year + ' ' + hr + ':' + min + ':' + ss;
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  getSourceFromURL(){
    return this.getUrlParameter('source') || '';
  }

  getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  urlCreator(redirect_url){
    try {
      var new_url = (new URL(redirect_url))
    }
    catch(err) {
      var new_url = (new URL(location.origin + redirect_url))
    }
    var params = new_url.search.substring("1")
    var base_url = new_url.origin + new_url.pathname
    // params = "&email=[emai]l&source=[source]&sid=[sid]"
    // base_url = "https://megamobiledeals.com"
    var url = []
    var data = this.getData();


    var params_array = _.split(params, '&');  //["", "email=[email]", "source=[source]", "sid=[sid]"]
    _.forEach(params_array, function(param) {
       var key_value = _.split(param, '='); // ["email", "[email]"]
       if(key_value.length > 1 && key_value[1].match(/\[(.*?)\]/)){
         url.push(`${key_value[0]}=${data[key_value[1].match(/\[(.*?)\]/)[1]]}&`) // email
       }else if(key_value.length > 1){
         url.push(`${key_value[0]}=${key_value[1]}&`) // email
       }
    });
    if (base_url.indexOf('?') != -1){ // if base_url contain ?
      return encodeURIComponent(`${base_url}&${_.join(url, "")}`)
    }else{
      return encodeURIComponent(`${base_url}?${_.join(url, "")}`)
    }
  }
}

export default Common;
