import Select2 from 'select2/dist/js/select2.js'
class ExitDelivery{
  constructor(){
    $(document).ready(function(){
      $(".source").select2({
        tags: true,
        tokenSeparators: [',', ' ']
      })
    })
  }
}
export default new ExitDelivery();
