class PagesController < ApplicationController
	include PagesHelper
	def show
    response.headers.except! 'X-Frame-Options'
    # get_deals_data( params[:page_name] )
    respond_to do |format|
      format.html {@partial = render_to_string partial: params[:page_name].to_s}
      format.js {}
    end
  end

  def index
    home
  end

  def privacy
  end

  def terms
  end

  def cookies
  end

end
