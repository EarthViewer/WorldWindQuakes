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
 *     - Neither the name of Bruce Schubert,  nor the names of its 
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

/*global define, $, WorldWind */

/**
 * The Earth module manages the WorldWindow object and add capabilities to the globe not found in the 
 * Web World Wind library.
 * 
 * @param {DnDController} DnDController Drag-N-Drop controller.
 * @param {EnhancedLookAtNavigator} EnhancedLookAtNavigator Doesn't allow the eye pos to go below the terrain.
 * @param {EnhancedTextSupport} EnhancedTextSupport Provides outline text.
 * @param {EnhancedViewControlsLayer} EnhancedViewControlsLayer Provides a vertical layout.
 * @param {KeyboardControls} KeyboardControls Provides keyboard navigation for the globe.
 * @param {Log} log Logger.
 * @param {ReticuleLayer} ReticuleLayer Crosshairs.
 * @param {SelectController} SelectController Provides select and move of globe renderables.
 * @param {SkyBackgroundLayer} SkyBackgroundLayer Adaptive sky color.
 * @param {Terrain} Terrain Aspect, slope and elevation.
 * @param {TerrainProvider} TerrainProvider Provides terrain data.
 * @param {Viewpoint} Viewpoint Eye position and target terrain.
 * @param {Wmt} explorer Constants.
 * @param {WorldWind} ww
 * @returns {Earth}
 * 
 * @author Bruce Schubert
 */
define([
    'model/earth/DnDController',
    'model/earth/EnhancedLookAtNavigator',
    'model/earth/EnhancedTextSupport',
    'model/earth/layers/EnhancedViewControlsLayer',
    'model/earth/KeyboardControls',
    'model/earth/LayerManager',
    'model/util/Log',
    'model/earth/layers/ReticuleLayer',
    'model/earth/SelectController',
    'model/earth/layers/SkyBackgroundLayer',
    'model/earth/Terrain',
    'model/earth/TerrainProvider',
    'model/earth/Viewpoint',
    'model/util/WmtUtil',
    'model/Explorer',
    'worldwind'],
    function (
        DnDController,
        EnhancedLookAtNavigator,
        EnhancedTextSupport,
        EnhancedViewControlsLayer,
        KeyboardControls,
        LayerManager,
        log,
        ReticuleLayer,
        SelectController,
        SkyBackgroundLayer,
        Terrain,
        TerrainProvider,
        Viewpoint,
        util,
        explorer,
        ww) {
        "use strict";
        /**
         * Creates a Earth object which manages a WorldWindow object created for the given canvas.
         * @constructor
         * @param {String} canvasName The canvas element ID for the WorldWindow canvas.
         * @param {Object} options Optional. Example (with defaults):
         *  {
         *      showBackground: true
         *      showReticule: true, 
         *      showViewControls: true, 
         *      includePanControls: true, 
         *      includeRotateControls: true, 
         *      includeTiltControls: true, 
         *      includeZoomControls: true, 
         *      includeExaggerationControls: false, 
         *      includeFieldOfViewControls: false, 
         *  }
         * @returns {Earth}
         */
        var Earth = function (canvasName, options) {
            // Create the World Window
            this.wwd = new WorldWind.WorldWindow(canvasName);

            // Override the default TextSupport with our custom verion that draws outline text
            this.wwd.drawContext.textSupport = new EnhancedTextSupport();

            this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
            this.isAnimating = false;

            // Add the custom navigator *before* the select controller 
            // so the select controller can consume the mouse events 
            // and preempt the pan/drag operations when moving objects.
            // Event handlers are called in the reverse order in which 
            // they are registered.
            this.wwd.navigator = new EnhancedLookAtNavigator(this.wwd);
            this.wwd.highlightController = new WorldWind.HighlightController(this.wwd);
            this.selectController = new SelectController(this.wwd);
            this.dndController = new DnDController(this.wwd);
            this.keyboardControls = new KeyboardControls(this);
            this.layerManager = new LayerManager(this);

            this.resizeTimer = null;
            this.canvasWidth = null;

            // Add terrain services (aspect, slope) to the globe
            this.terrainProvider = new TerrainProvider(this);

            // Create the default layers
            var self = this,
                showBackground = options ? options.showBackground : true,
                showReticule = options ? options.showReticule : true,
                showViewControls = options ? options.showViewControls : true,
                includePanControls = options ? options.includePanControls : explorer.configuration.showPanControl,
                includeRotateControls = options ? options.includeRotateControls : true,
                includeTiltControls = options ? options.includeTiltControls : true,
                includeZoomControls = options ? options.includeZoomControls : true,
                includeExaggerationControls = options ? options.includeExaggerationControls : explorer.configuration.showExaggerationControl,
                includeFieldOfViewControls = options ? options.includeFieldOfViewControls : explorer.configuration.showFiewOfViewControl,
                layer,
                i, max;
            // Add optional background layer
            if (showBackground || showBackground === undefined) {
                this.layerManager.addBackgroundLayer(new SkyBackgroundLayer(this.wwd));
            }

            // Adjust the level of detail based on screen properties
//            this.adjustTiledImageLayerDetailHints();

            // Add optional reticule
            if (showReticule || showReticule === undefined) {
                this.layerManager.addWidgetLayer(new ReticuleLayer());
            }
            // Add optional view controls layer
            if (showViewControls || showViewControls === undefined) {
                layer = new EnhancedViewControlsLayer(this.wwd);
                layer.showPanControl = (includePanControls === undefined) ? explorer.configuration.showPanControl : includePanControls;
                layer.showHeadingControl = (includeRotateControls === undefined) ? true : includeRotateControls;
                layer.showTiltControl = (includeTiltControls === undefined) ? true : includeTiltControls;
                layer.showZoomControl = (includeZoomControls === undefined) ? true : includeZoomControls;
                layer.showExaggerationControl = (includeExaggerationControls === undefined) ? explorer.configuration.showExaggerationControl : includeExaggerationControls;
                layer.showFieldOfViewControl = (includeFieldOfViewControls === undefined) ? explorer.configuration.showFieldOfViewControl : includeFieldOfViewControls;
                this.layerManager.addWidgetLayer(layer);
            }
            // Add handler to redraw the WorldWindow during resize events
            // to prevent the canvas from looking distorted.
            // Adjust the level of detail proportional to the 
            // window size.
            $(window).resize(function () {
                self.wwd.redraw();

//                clearTimeout(self.resizeTimer);
//                self.resizeTimer = setTimeout(function () {
//                    self.adjustTiledImageLayerDetailHints();
//                }, 2000);
            });

            // Ensure keyboard controls are operational by 
            // setting focus to the globe 
            this.wwd.addEventListener("click", function (event) {
                self.setFocus();
            });

            // Internals
            this.lastEyePoint = new WorldWind.Vec3();
            this.lastViewpoint = new Viewpoint(WorldWind.Position.ZERO, Terrain.ZERO);
        };


        /**
         * Adjusts the level of detail to be proportional to the window size.
         * If the window is twice the size of the base, then the detailHint should be 0.2;
         * if the window half the size then the detail level should be -0.2.
         */
        Earth.prototype.adjustTiledImageLayerDetailHints = function () {
            var width = $(this.wwd.canvas).width(),
                i, len, layer,
                detailHint;

            if (this.canvasWidth === width) {
                return;
            }
            this.canvasWidth = width;

            if (width < 1000) {
                // Mobile
                detailHint = -0.1;
//            } else if (width < 970) {
//                detailHint = 0.0;
//            } else if (width < 1170) {
//                detailHint = 0.1;
//            } else if (width < 1400) {
//                detailHint = 0.15;
            } else {
                detailHint = util.linearInterpolation(width, 1000, 2000, 0, 0.4);
            }

            // $(window).width() / parseFloat($("body").css("font-size"));

            // Process TiledImageLayers
            for (i = 0, len = this.wwd.layers.length; i < len; i++) {
                layer = this.wwd.layers[i];
                if (layer instanceof WorldWind.TiledImageLayer) {
                    layer.detailHint = detailHint;
                }
            }
        };

        /**
         * Finds the World Wind Layer in the layer list with the given display name.
         * @param {String} name Display name of the layer
         * @returns {Layer}
         */
        Earth.prototype.findLayer = function (name) {
            var layer,
                i, len;
            // Find the Markers layer in the World Window's layer list.
            for (i = 0, len = this.wwd.layers.length; i < len; i++) {
                layer = this.wwd.layers[i];
                if (layer.displayName === name) {
                    return layer;
                }
            }
        };

        /**
         * Gets terrain at the given latitude and longitude.
         * @param {Number} latitude
         * @param {Number} longitude
         * @return {Terrain} A WMT Terrain object at the given lat/lon.
         */
        Earth.prototype.getTerrainAtLatLon = function (latitude, longitude) {
            return this.terrainProvider.terrainAtLatLon(latitude, longitude);
        };
        /**
         * EXPERIMENTAL!!
         * Gets terrain at the given latitude and longitude.
         * @param {Number} latitude
         * @param {Number} longitude
         * @param {Number} targetResolution: The desired elevation resolution, in radians. (To compute radians from
         * meters, divide the number of meters by the globe's radius.) Default 1/WorldWind.EARTH_RADIUS.
         * @return {Terrain} A WMT Terrain object at the given lat/lon.
         */
        Earth.prototype.getTerrainAtLatLonHiRes = function (latitude, longitude, targetResolution) {
            return this.terrainProvider.terrainAtLatLon(latitude, longitude, targetResolution || 1 / WorldWind.EARTH_RADIUS);
        };

        /**
         * Gets terrain at the screen point.
         * @param {Vec2} screenPoint Point in screen coordinates for which to get terrain.
         * @return {Terrain} A WMT Terrain object at the screen point.
         */
        Earth.prototype.getTerrainAtScreenPoint = function (screenPoint) {
            var terrainObject,
                terrain;
            // Get the WW terrain at the screen point, it supplies the lat/lon
            terrainObject = this.wwd.pickTerrain(screenPoint).terrainObject();
            if (terrainObject) {
                // Get the WMT terrain at the picked lat/lon
                terrain = this.terrainProvider.terrainAtLatLon(
                    terrainObject.position.latitude,
                    terrainObject.position.longitude);
            } else {
                // Probably above the horizon.
                terrain = new Terrain();
                terrain.copy(Terrain.INVALID);
            }
            return terrain;
        };

        /**
         * Gets the current viewpoint at the center of the viewport.
         * @@returns {Viewpoint} A Viewpoint representing the the eye position and the target position.
         */
        Earth.prototype.getViewpoint = function () {
            try {
                var wwd = this.wwd,
                    centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2),
                    navigatorState = wwd.navigator.currentState(),
                    eyePoint = navigatorState.eyePoint,
                    eyePos = new WorldWind.Position(),
                    target, viewpoint;
                // Avoid costly computations if nothing changed
                if (eyePoint.equals(this.lastEyePoint)) {
                    return this.lastViewpoint;
                }
                this.lastEyePoint.copy(eyePoint);
                // Get the current eye position 
                wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], eyePos);
                // Get the target (the point under the reticule)
                target = this.getTerrainAtScreenPoint(centerPoint);
                // Return the viewpoint
                viewpoint = new Viewpoint(eyePos, target);
                this.lastViewpoint.copy(viewpoint);
                return viewpoint;
            } catch (e) {
                log.error("Earth", "getViewpoint", e.toString());
                return Viewpoint.INVALID;
            }
        };

        /**
         * Updates the globe via animation.
         * @param {Number} latitude Reqd.
         * @param {Number} longitude Reqd.
         * @param {Number} range Optional.
         * @param {Function} callback Optional.
         */
        Earth.prototype.goto = function (latitude, longitude, range, callback) {
            if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                log.error("Earth", "gotoLatLon", "Invalid Latitude and/or Longitude.");
                return;
            }
            var self = this;
            if (this.isAnimating) {
                this.goToAnimator.cancel();
            }
            this.isAnimating = true;
            this.goToAnimator.goTo(new WorldWind.Position(latitude, longitude, range), function () {
                self.isAnimating = false;
                if (callback) {
                    callback();
                }
            });
        };

        /**
         * Updates the globe without animation.
         * @param {Number} latitude Reqd.
         * @param {Number} longitude Reqd.
         * @param {Number} range Optional.
         */
        Earth.prototype.lookAt = function (latitude, longitude, range) {
            if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                log.error("Earth", "lookAt", "Invalid Latitude and/or Longitude.");
                return;
            }
            this.wwd.navigator.lookAtLocation.latitude = latitude;
            this.wwd.navigator.lookAtLocation.longitude = longitude;
            if (range) {
                this.wwd.navigator.range = range;
            }
            this.wwd.redraw();
        };

        /** 
         * Redraws the globe.
         */
        Earth.prototype.redraw = function () {
            this.wwd.redraw();
        };

        /** 
         * Refreshes temporal layers.
         */
        Earth.prototype.refreshLayers = function () {
            var i, len, layer;
            
            // Process TiledImageLayers
            for (i = 0, len = this.wwd.layers.length; i < len; i++) {
                layer = this.wwd.layers[i];
                if (layer.isTemporal) {
                    layer.refresh();
                }
                this.wwd.redraw();
            }
            
        };


        /**
         * Resets the viewpoint to the startup configuration settings.
         */
        Earth.prototype.reset = function () {
            this.wwd.navigator.lookAtLocation.latitude = Number(explorer.configuration.startupLatitude);
            this.wwd.navigator.lookAtLocation.longitude = Number(explorer.configuration.startupLongitude);
            this.wwd.navigator.range = Number(explorer.configuration.startupAltitude);
            this.wwd.navigator.heading = Number(explorer.configuration.startupHeading);
            this.wwd.navigator.tilt = Number(explorer.configuration.startupTilt);
            this.wwd.navigator.roll = Number(explorer.configuration.startupRoll);
            this.wwd.redraw();
        };

        /**
         * Resets the viewpoint to north up.
         */
        Earth.prototype.resetHeading = function () {
            this.wwd.navigator.heading = Number(0);
            this.wwd.redraw();
        };

        /**
         * Resets the viewpoint to north up and nadir.
         */
        Earth.prototype.resetHeadingAndTilt = function () {
            // Tilting the view will change the location due to a bug in 
            // the early release of WW.  So we set the location to the 
            // current crosshairs position (viewpoint) to resolve this issue
            var viewpoint = this.getViewpoint(),
                lat = viewpoint.target.latitude,
                lon = viewpoint.target.longitude;
            this.wwd.navigator.heading = 0;
            this.wwd.navigator.tilt = 0;
            this.wwd.redraw(); // calls applyLimits which changes the location

            this.lookAt(lat, lon);
        };

        Earth.prototype.setFocus = function () {
            this.wwd.canvas.focus();
        };

        /**
         * Establishes the projection for this globe.
         * @param {String} projectionName A PROJECTION_NAME_* constant.
         */
        Earth.prototype.setProjection = function (projectionName) {
            if (projectionName === explorer.PROJECTION_NAME_3D) {
                if (!this.roundGlobe) {
                    this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
                }

                if (this.wwd.globe !== this.roundGlobe) {
                    this.wwd.globe = this.roundGlobe;
                }
            } else {
                if (!this.flatGlobe) {
                    this.flatGlobe = new WorldWind.Globe2D();
                }

                if (projectionName === explorer.PROJECTION_NAME_EQ_RECT) {
                    this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
                } else if (projectionName === explorer.PROJECTION_NAME_MERCATOR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionMercator();
                } else if (projectionName === explorer.PROJECTION_NAME_NORTH_POLAR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
                } else if (projectionName === explorer.PROJECTION_NAME_SOUTH_POLAR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
                } else if (projectionName === explorer.PROJECTION_NAME_NORTH_UPS) {
                    this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
                } else if (projectionName === explorer.PROJECTION_NAME_SOUTH_UPS) {
                    this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
                }

                if (this.wwd.globe !== this.flatGlobe) {
                    this.wwd.globe = this.flatGlobe;
                }
            }
            this.wwd.redraw();
        };

        return Earth;
    }
);
