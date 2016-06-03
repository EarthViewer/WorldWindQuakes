/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */


/*global define, WorldWind*/

/**
 * Web Application.
 * 
 * @param {OracleJet} oj 
 * @param {KnockOut} ko 
 * @param {JQuery} $  
 * @param {Earth} Earth The globe.
 * @param {Explorer} explorer Constants.
 * 
 * @returns {ExplorerApp}
 * 
 * @author Bruce Schubert
 */
define([
    'ojs/ojcore', 'knockout', 'jquery',
    'model/earth/Earth',
    'model/Explorer'
],
    function (
        oj, ko, $,
        Earth,
        explorer) {
        "use strict";
        var ExplorerApp = function () {

            // Create the primary globe
            var globeOptions = {
                showBackground: true,
                showReticule: true,
                showViewControls: true,
                includePanControls: explorer.configuration.showPanControl,
                includeRotateControls: true,
                includeTiltControls: true,
                includeZoomControls: true,
                includeExaggerationControls: explorer.configuration.showExaggerationControl,
                includeFieldOfViewControls: explorer.configuration.showFiewOfViewControl};


            // Create the primary globe associated with an HTML5 canvas
            this.earth = new Earth("canvasOne", globeOptions);

            // Configure the Earth's layers
            this.earth.layerManager.addBaseLayer(new WorldWind.BMNGLayer(), {enabled: true, hideInMenu: true, detailHint: explorer.configuration.imageryDetailHint});            
            this.earth.layerManager.addBaseLayer(new WorldWind.BMNGLandsatLayer(), {enabled: false, detailHint: explorer.configuration.imageryDetailHint});
            this.earth.layerManager.addBaseLayer(new WorldWind.BingAerialWithLabelsLayer(null), {enabled: false, detailHint: explorer.configuration.imageryDetailHint});
            this.earth.layerManager.addBaseLayer(new WorldWind.BingRoadsLayer(null), {enabled: false, opacity: 0.7, detailHint: explorer.configuration.imageryDetailHint});
            this.earth.layerManager.addBaseLayer(new WorldWind.OpenStreetMapImageLayer(null), {enabled: true, opacity: 0.7, detailHint: explorer.configuration.imageryDetailHint});
            this.earth.layerManager.addDataLayer(new WorldWind.RenderableLayer(explorer.LAYER_NAME_MARKERS), {enabled: true, pickEnabled: true});
            this.earth.layerManager.addWidgetLayer(new WorldWind.RenderableLayer(explorer.LAYER_NAME_WIDGETS), {enabled: true, pickEnabled: false});


            // Now that the globe is setup, initialize the Model-View-Controller framework.
            // The controller will create model and the views on the primary globe. 
//            controller.initialize(this.earth);


            // Add event handler to save the current view (eye position) when the window closes
            window.onbeforeunload = function () {
//                controller.saveSession();
                // Return null to close quietly on Chrome FireFox.
                //return "Close WMT?";
                return null;
            };

            // Now that MVC is set up, restore the model from the previous session.
            // But wait for the globe (specically the elevation model) to finish 
            // loading before adding placemarks, else the terrain data will be
            // inaccurate.
//            controller.restoreSession();
        };

        return ExplorerApp;
    }
);

