/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Your viewModel code goes here
 */

define(['ojs/ojcore', 'knockout', 'jquery',
    'promise', 'ojs/ojknockout', 'ojs/ojcollapsible',
    'ojs/ojlistview', 'ojs/ojdatacollection-common'],
    function (oj, ko, $) {
        /**
         * The view model for the primary globe content view template
         */
        function settingsViewModel() {
//            var manager = controller.model.weatherScoutManager;
//
//            this.selectedItems = ko.observableArray([]);
//            this.scouts = new oj.ArrayTableDataSource(manager.scouts, {idAttribute: "id"});
        }

        return settingsViewModel;
    });
