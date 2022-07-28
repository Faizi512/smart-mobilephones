class ExitDeliveriesController < ApplicationController
  before_action :set_exit_delivery, only: %i[ show edit update destroy ]
  before_action :authenticate_user!

  # GET /exit_deliveries or /exit_deliveries.json
  def index
    if params[:status]
      @exit_deliveries = ExitDelivery.where(status: params[:status])
    elsif params[:functional]
      @exit_deliveries = ExitDelivery.where(functional: params[:functional])
    else
      @exit_deliveries = ExitDelivery.all
    end
  end

  # GET /exit_deliveries/1 or /exit_deliveries/1.json
  def show
  end

  # GET /exit_deliveries/new
  def new
    @exit_delivery = ExitDelivery.new
  end

  # GET /exit_deliveries/1/edit
  def edit
  end

  # POST /exit_deliveries or /exit_deliveries.json
  def create
    @exit_delivery = ExitDelivery.new(exit_delivery_params)

    respond_to do |format|
      if @exit_delivery.save
        format.html { redirect_to @exit_delivery, notice: "Exit delivery was successfully created." }
        format.json { render :show, status: :created, location: @exit_delivery }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @exit_delivery.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /exit_deliveries/1 or /exit_deliveries/1.json
  def update
    respond_to do |format|
      if @exit_delivery.update(exit_delivery_params)
        format.html { redirect_to @exit_delivery, notice: "Exit delivery was successfully updated." }
        format.json { render :show, status: :ok, location: @exit_delivery }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @exit_delivery.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /exit_deliveries/1 or /exit_deliveries/1.json
  def destroy
    @exit_delivery.destroy
    respond_to do |format|
      format.html { redirect_to exit_deliveries_url, notice: "Exit delivery was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_exit_delivery
      @exit_delivery = ExitDelivery.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def exit_delivery_params
      params.require(:exit_delivery).permit(:url, :name, :percentage,
        :status, :priority, :cap, :count, :operational, :is_default, :is_mobile, :source_rule,
        :functional).merge(copy_percentage: params[:exit_delivery][:percentage], source: params[:exit_delivery][:source].reject(&:blank?))
    end
end
