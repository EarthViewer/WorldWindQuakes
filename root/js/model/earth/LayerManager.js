/* 
 * Copyright (c) 2015, Bruce Schubert <bruce@emxsys.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     - Neither the name of Bruce Schubert, Emxsys nor the names of its 
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*global define*/

/**
 * The LayerManager manages categorical, observable lists of Layer objects. It itself observable, 
 * and it injects some observable properties into the individual Layer objects.
 * 
 * @param {Knockout} ko
 * @param {Explorer} explorer
 * @returns {LayerManager}
 */
define([
    'knockout',
    'model/Explorer',
    'worldwind'],
    function (
        ko,
        explorer) {
        "use strict";
        /**
         * 
         * @param {Globe} globe
         * @returns {LayerManager}
         */
        var LayerManager = function (globe) {
            var self = this;
            
            this.globe = globe;
            /**
             * Background layers are always enabled and are not shown in the layer menu.
             */
            this.backgroundLayers = ko.observableArray();
            /**
             * Base layers are opaque and should be shown exclusive of other base layers.
             */
            this.baseLayers = ko.observableArray();
            /**
             * Overlay layers may be translucent and/or contain sparce content, and may be stacked with other layers.
             */
            this.overlayLayers = ko.observableArray();
            /**
             * Data layers are shapes and markers.
             */
            this.dataLayers = ko.observableArray();
            /**
             * Widget layers are fixed controls on the screen and are not shown in the layer menu.
             */
            this.widgetLayers = ko.observableArray();


            /**
             * Toggles a layer on and off.
             * 
             * @param {WorldWind.Layer} layer The layer to be toggled on or off.
             */
            this.toggleLayer = function (layer) {
                // Update the WorldWind.Layer object
                layer.enabled = !layer.enabled;

                // Update the observable so UI elements can reflect the new state
                layer.layerEnabled(layer.enabled);

                self.globe.redraw();
            };
        };

        /**
         * Background layers are always enabled and are not shown in the layer menu.
         * @param {WorldWind.Layer} layer
         */
        LayerManager.prototype.addBackgroundLayer = function (layer) {
            var index = this.backgroundLayers().length;

            LayerManager.applyOptionsToLayer(layer, {hideInMenu: true, enabled: true}, explorer.LAYER_CATEGORY_BACKGROUND);

            this.globe.wwd.insertLayer(index, layer);
            this.backgroundLayers.push(layer);
        };

        /**
         * Base layers are opaque and should be shown exclusive of other base layers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addBaseLayer = function (layer, options) {
            var index = this.backgroundLayers().length + this.baseLayers().length;

            LayerManager.applyOptionsToLayer(layer, options, explorer.LAYER_CATEGORY_BASE);

            this.globe.wwd.insertLayer(index, layer);
            this.baseLayers.push(layer);
        };

        /**
         * Overlay layers may be translucent and/or contain sparce content, and 
         * may be stacked with other layers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addOverlayLayer = function (layer, options) {
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length;

            LayerManager.applyOptionsToLayer(layer, options, explorer.LAYER_CATEGORY_OVERLAY);

            this.globe.wwd.insertLayer(index, layer);
            this.overlayLayers.push(layer);
        };

        /**
         * Data layers are shapes and markers.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         */
        LayerManager.prototype.addDataLayer = function (layer, options) {
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length
                + this.dataLayers().length;

            LayerManager.applyOptionsToLayer(layer, options, explorer.LAYER_CATEGORY_DATA);

            this.globe.wwd.insertLayer(index, layer);
            this.dataLayers.push(layer);
        };

        /**
         * Widget layers are always enabled and are not shown in the layer menu.
         * @param {WorldWind.Layer} layer
         */
        LayerManager.prototype.addWidgetLayer = function (layer) {
            var index = this.backgroundLayers().length + this.baseLayers().length + this.overlayLayers().length
                + this.dataLayers().length + this.widgetLayers().length;

            LayerManager.applyOptionsToLayer(layer, {hideInMenu: true, enabled: true}, explorer.LAYER_CATEGORY_BACKGROUND);

            this.globe.wwd.insertLayer(index, layer);
            this.widgetLayers.push(layer);
        };

        /**
         * Applys or adds the options to the given layer.
         * @param {WorldWind.Layer} layer
         * @param {Object} options
         * @param {String} category
         */
        LayerManager.applyOptionsToLayer = function (layer, options, category) {
            var opt = (options === undefined) ? {} : options;

            // WMT layer type
            layer.category = category;

            // Propagate enabled and pick options to the layer object
            layer.enabled = opt.enabled === undefined ? true : opt.enabled;
            layer.pickEnabled = opt.pickEnabled === undefined ? true : opt.enabled;

            // Add refresh capability
            if (opt.isTemporal) {
                layer.isTemporal = true;
            }

            // Apply the level-of-detail hint, if provided
            if (opt.detailHint) {
                layer.detailHint = opt.detailHint;
            }

            // Apply the opacity, if provided
            if (opt.opacity) {
                layer.opacity = opt.opacity;
            }

            // Create the Knockout LayerViewModel for this layer
            // =================================================
            layer.layerEnabled = ko.observable(layer.enabled);
            layer.showInMenu = ko.observable(opt.hideInMenu === undefined ? true : !opt.hideInMenu);
        };

        return LayerManager;
    }
);

