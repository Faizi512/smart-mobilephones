require "test_helper"

class ExitDeliveriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @exit_delivery = exit_deliveries(:one)
  end

  test "should get index" do
    get exit_deliveries_url
    assert_response :success
  end

  test "should get new" do
    get new_exit_delivery_url
    assert_response :success
  end

  test "should create exit_delivery" do
    assert_difference('ExitDelivery.count') do
      post exit_deliveries_url, params: { exit_delivery: { content: @exit_delivery.content, name: @exit_delivery.name, title: @exit_delivery.title } }
    end

    assert_redirected_to exit_delivery_url(ExitDelivery.last)
  end

  test "should show exit_delivery" do
    get exit_delivery_url(@exit_delivery)
    assert_response :success
  end

  test "should get edit" do
    get edit_exit_delivery_url(@exit_delivery)
    assert_response :success
  end

  test "should update exit_delivery" do
    patch exit_delivery_url(@exit_delivery), params: { exit_delivery: { content: @exit_delivery.content, name: @exit_delivery.name, title: @exit_delivery.title } }
    assert_redirected_to exit_delivery_url(@exit_delivery)
  end

  test "should destroy exit_delivery" do
    assert_difference('ExitDelivery.count', -1) do
      delete exit_delivery_url(@exit_delivery)
    end

    assert_redirected_to exit_deliveries_url
  end
end
