
class ExitDelivery < ApplicationRecord
  validate :validate_percentage
  validate :validate_priority
  validate :is_already_default

  scope :sold, -> { where(status: "sold", is_default: false).order(priority: :asc) }
  scope :unsold, -> { where(status: "unsold", is_default: false).order(priority: :asc) }
  scope :active_sold, -> { where(status: "sold", is_default: false, operational: "active", functional: "active").order(priority: :asc) }
  scope :active_unsold, -> { where(status: "unsold", is_default: false, operational: "active", functional: "active").order(priority: :asc) }

  scope :active, -> { where(is_default: false, operational: "active", functional: "active").order(priority: :asc) }
  scope :active_sold_with_no_source_smartphone, -> { where(status: "sold", is_default: false, operational: "active",is_mobile: true, functional: "active", source: []|| [""]).order(priority: :asc) }
  scope :active_unsold_with_no_source_smartphone, -> { where(status: "unsold", is_default: false, operational: "active", functional: "active",is_mobile: true, source: [] || [""]).order(priority: :asc) }

  scope :active_sold_with_no_source_desktop, -> { where(status: "sold", is_default: false, operational: "active",is_mobile: false, functional: "active", source: []|| [""]).order(priority: :asc) }
  scope :active_unsold_with_no_source_desktop, -> { where(status: "unsold", is_default: false, operational: "active", functional: "active",is_mobile: false, source: [] || [""]).order(priority: :asc) }

  scope :is_mobile, -> {where(is_mobile: true)}
  scope :is_desktop, -> {where(is_mobile: false)}
  enum source_rule: {Is: 0, Contains: 1, Does_not_contains: 2 }

  def self.match_type_query(urls, sourceVal)
    @exit_urls_ids = []
    urls.each do |url|
      source_exists, sourceCount = check_existence(url, sourceVal)

      if url.source_rule == 'Is' and sourceCount == 1 && source_exists
        @exit_urls_ids.push(url.id)
      elsif url.source_rule == 'Contains' and source_exists
        debugger
        @exit_urls_ids.push(url.id)
      elsif url.source_rule == 'Does not contains' and !source_exists
        @exit_urls_ids.push (url.id)
      elsif url.source.empty?
        @exit_urls_ids.push (url.id)
      end
    end
    return @exit_urls_ids
  end

  def self.check_existence(url, sourceVal)
    check = url.source.map{ |src| src.downcase.include?(sourceVal.downcase) }
    check = check.include?(true)
    return [check, url.source.length]
  end

  def operational?
    self.operational == "active"
  end

  def functional?
    self.functional == "active"
  end

  def is_already_default
    is_default = ExitDelivery.where.not(id: self.id).where(status: self.status).where(functional: "active", is_default: true).any? && self.is_default
    if is_default
      errors.add(
        :is_default, ": One only URl can be default"
      )
    end
  end

  def validate_percentage
    return if self.is_default

    if self.source.present?
      total_percent = ExitDelivery.where.not(id: self.id).where(status: self.status, operational: "active", functional: "active" , is_default: false, is_mobile: self.is_mobile).filter{|url| url if (url.source & self.source).present?}.pluck(:percentage).sum
    else
      total_percent = ExitDelivery.where.not(id: self.id).where(status: self.status, operational: "active", functional: "active" , is_default: false, is_mobile: self.is_mobile, source: []).pluck(:percentage).sum
    end

    unless total_percent + self.percentage <= 100
      errors.add(
        :percentage, ": Enter less than or equal to #{100 - total_percent}"
      )
    end
  end

  def validate_priority
     priorities = ExitDelivery.where.not(id: self.id).where(status: self.status, is_mobile: self.is_mobile).pluck(:priority)
    if priorities.include?(self.priority)
      errors.add(
        :priority, ": Already taken"
      )
    end
  end
end
