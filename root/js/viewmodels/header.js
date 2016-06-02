/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Header module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojdialog',
  'ojs/ojtoolbar', 'ojs/ojbutton', 'ojs/ojmenu'],
  function (oj, ko, $) {
    /**
     * The view model for the header module
     */
    function HeaderViewModel() {
      var self = this;

      // Application Name used in Branding Area
      self.appName = ko.observable("Wildfire Management Tool");
      self.appShortName = ko.observable("WMT");

      // User Info used in Global Navigation area
      self.userLogin = ko.observable("Guest");

      // Media Queries for repsonsive header
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Dropdown menu states
      self.menuItemSelect = function (event, ui) {
        switch (ui.item.attr("id")) {
          case "about":
            $("#aboutDialog").ojDialog("open");
            break;
          default:
        }
      };

    }
    return new HeaderViewModel();
  }
);
