require "application_system_test_case"

class ExitDeliveriesTest < ApplicationSystemTestCase
  setup do
    @exit_delivery = exit_deliveries(:one)
  end

  test "visiting the index" do
    visit exit_deliveries_url
    assert_selector "h1", text: "Exit Deliveries"
  end

  test "creating a Exit delivery" do
    visit exit_deliveries_url
    click_on "New Exit Delivery"

    fill_in "Content", with: @exit_delivery.content
    fill_in "Name", with: @exit_delivery.name
    fill_in "Title", with: @exit_delivery.title
    click_on "Create Exit delivery"

    assert_text "Exit delivery was successfully created"
    click_on "Back"
  end

  test "updating a Exit delivery" do
    visit exit_deliveries_url
    click_on "Edit", match: :first

    fill_in "Content", with: @exit_delivery.content
    fill_in "Name", with: @exit_delivery.name
    fill_in "Title", with: @exit_delivery.title
    click_on "Update Exit delivery"

    assert_text "Exit delivery was successfully updated"
    click_on "Back"
  end

  test "destroying a Exit delivery" do
    visit exit_deliveries_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Exit delivery was successfully destroyed"
  end
end
