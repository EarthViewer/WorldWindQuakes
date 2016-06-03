/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * Require.js boostrap javascript
 */
requirejs.config({
// Path mappings for the logical module names
    paths:
            //injector:mainReleasePaths
            {
                'knockout': 'libs/knockout/knockout-3.4.0',
                'jquery': 'libs/jquery/jquery-2.1.3.min',
                'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.11.4.min',
                'promise': 'libs/es6-promise/promise-1.0.0.min',
                'hammerjs': 'libs/hammer/hammer-2.0.4.min',
                'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
                'ojs': 'libs/oj/v2.0.1/debug',
                'ojL10n': 'libs/oj/v2.0.1/ojL10n',
                'ojtranslations': 'libs/oj/v2.0.1/resources',
                'signals': 'libs/js-signals/signals.min',
                'text': 'libs/require/text',
                'model': 'model', // root app path
                'worldwind': [
                    //"js/libs/webworldwind/worldwindlib",
                    "http://worldwindserver.net/webworldwind/worldwindlib"
                ]
            }
            //endinjector
            ,
            // Shim configurations for modules that do not expose AMD
            shim: {
                'jquery': {
                    exports: ['jQuery', '$']
                }
            },
            // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
            // resources with a custom translation file.
            // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
            // a path that is relative to the location of this main.js file.
            config: {
                ojL10n: {
                    merge: {
                        //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
                    }
                }
            }
        });
/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 * 
 * @param {OracleJet} oj
 * @param {Knockout} ko
 * @param {JQuery} $
 * @param {Explorer} explorer
 * @param {ExplorerApp} app
 * @param {WorldWind} ww
 * @returns {undefined}
 */
require(['ojs/ojcore', 'knockout', 'jquery', 'model/Explorer', 'model/ExplorerApp', 'worldwind',
    'ojs/ojknockout', 'ojs/ojrouter', 'ojs/ojmodule', 'ojs/ojoffcanvas', 'ojs/ojnavigationlist', 'ojs/ojarraytabledatasource'],
        function (oj, ko, $, explorer, app, ww) { // this callback gets executed when all required modules are loaded

            // Specify the where the World Wind resources are located.
            ww.configuration.baseUrl = explorer.WORLD_WIND_PATH;
            // Set the logging level for the World Wind library
            ww.Logger.setLoggingLevel(ww.Logger.LEVEL_WARNING);

            // Override the ModuleBinding defaults to conform to this project's directory structure
            oj.ModuleBinding.defaults.modelPath = 'viewmodels/'; // the original is 'viewModels'

            // Retrieve the router static instance and configure the states.
            var router = oj.Router.rootInstance;
            router.configure({
                'location': {label: 'Location', isDefault: true},
                'layers': {label: 'Layers'},
                'markers': {label: 'Markers'},
                'settings': {label: 'Settings'},
                'help': {label: 'Help'}
            });

            function RootViewModel() {
                var self = this;
                self.router = router;

                // Shared navigation data and callbacks in an ArrayTableDataSource 
                // for nav bar (medium+ screens) and nav drawer (small screens)
                var navData = [
                    {name: 'Location', id: 'location', iconClass: 'fa fa-crosshairs fa-lg oj-navigationlist-item-icon'},
                    {name: 'Layers', id: 'layers', iconClass: 'fa fa-list fa-lg oj-navigationlist-item-icon'},
                    {name: 'Markers', id: 'markers', iconClass: 'fa fa-map-marker fa-lg oj-navigationlist-item-icon'},
                    {name: 'Settings', id: 'settings', iconClass: 'fa fa-gear fa-lg oj-navigationlist-item-icon'},
                    {name: 'Help', id: 'help', iconClass: 'fa fa-question fa-lg oj-navigationlist-item-icon'}
                ];
                self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
                self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

                /**
                 * Toggles between the the nav bar and and nav drawer.
                 * @param {type} event Not used.
                 * @param {type} ui
                 */
                self.navChange = function (event, ui) {
                    if (ui.option === 'selection' && ui.value !== self.router.stateId()) {
                        // Only toggle navigation drawer when it's shown on small screens
                        if (self.smScreen())
                            self.toggleDrawer();
                        self.router.go(ui.value);
                    }
                };

                // Parameters used by toggleDrawer.
                self.drawerParams = {
                    displayMode: 'push',
                    selector: '#offcanvas',
                };

                /**
                 * Toggles the nav drawer. Called by navigation drawer 
                 * toggle button and after selection of a nav drawer item.
                 */
                self.toggleDrawer = function () {
                    return oj.OffcanvasUtils.toggle(self.drawerParams);
                };

                // Close the drawer for medium and up screen sizes
                self.mdScreen.subscribe(function () {
                    oj.OffcanvasUtils.close(self.drawerParams);
                });
            }

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            oj.Router.sync().then(
                    function () {
                        // Create the web app object and make it accessable via a global variable.
                        window.APP = new app();

                        // Bind the RootViewModel for the content of the whole page body.
                        ko.applyBindings(new RootViewModel(), document.getElementById('globalBody'));
                    },
                    function (error) {
                        oj.Logger.error('Error in root start: ' + error.message);
                    }
            );
        }
);
