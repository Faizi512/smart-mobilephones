class LeadController < ApplicationController

  def lookup_lead_365(key, camp_id)
    data =  {
      "key": key,
      "searches": [
        {
          "campaignId": camp_id,
          "phone": params[:phone]
        }
      ]
    }
    url = "https://lead365.leadbyte.co.uk/restapi/v1.2/leads/search"
    uri = URI(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(url, {'Content-Type' => 'application/json'})
    request.body = data.to_json
    response = http.request(request)
    puts "****" * 30
    puts @result = JSON.parse(response.body)
  end

  def lead_search
    lookup_lead_365(key = '6c67a8ee57305998506ad0bc2c08e296', camp_id = 767)
    if @result["totalMatches"] == 0
      lookup_lead_365(key = '3f2af16146e4c986136846e74f2640bf' , camp_id = 1073)
    end
    puts "****" * 30
    render json: {status: 200, match: @result["totalMatches"]}
  end
end
