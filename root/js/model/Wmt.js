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
 * WMT Configuration and constants
 * 
 * @author Bruce Schubert
 */
define([],
    function () {
        "use strict";
        /**
         * This is the top-level WMT module. It is global.
         * @exports Wmt
         * @global
         */
        var Wmt = {
            /**
             * The WMT version number.
             * @constant
             */
            VERSION: "0.4.0",
            BUTTON_TEXT_CANCEL: 'Cancel',
            BUTTON_TEXT_DELETE: 'Delete',
            BUTTON_TEXT_GOTO: 'Go To',
            BUTTON_TEXT_NO: 'No',
            BUTTON_TEXT_OK: 'OK',
            BUTTON_TEXT_SAVE: 'Save',
            BUTTON_TEXT_YES: 'Yes',
            EVENT_FIRE_BEHAVIOR_CHANGED: "fireBehaviorChanged",
            EVENT_FIRE_LOOKOUT_ADDED: "fireLookoutAdded",
            EVENT_FIRE_LOOKOUT_CHANGED: "fireLookoutChanged",
            EVENT_FIRE_LOOKOUT_REMOVED: "fireLookoutRemoved",
            EVENT_FUELMOISTURE_CHANGED: "fuelMoistureChanged",
            EVENT_MARKER_ADDED: "markerAdded",
            EVENT_MARKER_CHANGED: "markerChanged",
            EVENT_MARKER_REMOVED: "markerRemoved",
            EVENT_WILDLAND_FIRE_ADDED: "wildlandFireAdded",
            EVENT_WILDLAND_FIRE_CHANGED: "wildlandFireChanged",
            EVENT_WILDLAND_FIRE_REMOVED: "wildlandFireRemoved",
            EVENT_WILDLAND_FIRES_ADDED: "wildlandFiresAdded",
            /**
             * Publish/subscibe event name for notifcation of mouse position on the globe.
             * @constant
             */
            EVENT_MOUSE_MOVED: "mouseMoved",
            EVENT_OBJECT_OPENED: "objectOpened",
            EVENT_OBJECT_CHANGED: "objectChanged",
            EVENT_OBJECT_MOVE_STARTED: "objectMoveStarted",
            EVENT_OBJECT_MOVED: "objectMoved",
            EVENT_OBJECT_MOVE_FINISHED: "objectMoveFinished",
            EVENT_OBJECT_REMOVED: "objectRemoved",
            EVENT_OBJECT_SELECTED: "objectSelected",
            EVENT_PLACE_CHANGED: "placeChanged",
            /**
             * Publish/subscibe event name for notifcation of changes in the sunlight.
             * @constant
             */
            EVENT_SUNLIGHT_CHANGED: "sunlightChanged",
            EVENT_SURFACEFUEL_CHANGED: "surfaceFuelChanged",
            EVENT_SURFACEFIRE_CHANGED: "surfaceFireChanged",
            EVENT_TERRAIN_CHANGED: "terrainChanged",
            /**
             * Publish/subscibe event name for notifcation of changes in the application time.
             * @constant
             */
            EVENT_TIME_CHANGED: "timeChanged",
            /**
             * Publish/subscribe event name for notification of changes in the globe viewpoint.
             * @constant
             */
            EVENT_VIEWPOINT_CHANGED: "viewpointChanged",
            EVENT_WEATHER_CHANGED: "weatherChanged",
            EVENT_WEATHER_SCOUT_ADDED: "weatherScoutAdded",
            EVENT_WEATHER_SCOUT_CHANGED: "weatherScoutChanged",
            EVENT_WEATHER_SCOUT_REMOVED: "weatherScoutRemoved",
            FIRE_LOOKOUT_LABEL_LATLON: "fireLookoutLabelLatLon",
            FIRE_LOOKOUT_LABEL_NAME: "fireLookoutLabelName",
            FIRE_LOOKOUT_LABEL_NONE: "fireLookoutLabelNone",
            FIRE_LOOKOUT_LABEL_PLACE: "fireLookoutLabelPlace",
            /**
             * The URL for the fuel models REST service.
             */
            FUELMODELS_REST_SERVICE: "/wmt-rest/rs/fuelmodels",
            /**
             * The URL for the fuel models REST service.
             */
            FUELMOISTURE_REST_SERVICE: "/wmt-rest/rs/fuelmoisture",
            /**
             * The URL for the GeoMAC MapServer REST service.
             */
            GEOMAC_REST_SERVICE: "http://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_fires/MapServer",
            GEOMETRY_POINT: 'point',
            GEOMETRY_POLYGON: 'polygon',
            GEOMETRY_POLYLINE: 'polyline',
            GEOMETRY_UNKNOWN: 'unknown',
            /**
             * Base URL for WMT application images. (Do not use a relative path.)
             */
            IMAGE_PATH: "js/wmt/images/",
            /**
             * The URL for the LANDFIRE MapServer REST service.
             * LANDFIRE 2012 (LF 2012 - LF_1.3.0) 
             */
            LANDFIRE_REST_SERVICE: "http://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_130/MapServer",
            /**
             * Layer categories
             */
            LAYER_CATEGORY_BACKGROUND: "Background",
            LAYER_CATEGORY_BASE: "Base",
            LAYER_CATEGORY_DATA: "Data",
            LAYER_CATEGORY_OVERLAY: "Overlay",
            LAYER_CATEGORY_WIDGET: "Widget",
            /**
             * The display name for the layer that displays markers.
             */
            LAYER_NAME_COMPASS: "Compass",
            /**
             * The display name for the layer that displays fire behavior lookouts.
             */
            LAYER_NAME_FIRE_BEHAVOR: "Fire Lookouts",
            LAYER_NAME_MARKERS: "Markers",
            LAYER_NAME_RETICLE: "Crosshairs",
            LAYER_NAME_SKY: "Sky",
            LAYER_NAME_VIEW_CONTROLS: "Controls",
            /**
             * The display name for the layer that displays weather stations and lookouts.
             */
            LAYER_NAME_WEATHER: "Weather",
            LAYER_NAME_WIDGETS: "Widgets",
            /**
             * The display name for the layer that displays fire perimeters and related data.
             */
            LAYER_NAME_WILDLAND_FIRES: "Active Fires",
            LAYER_NAME_WILDLAND_FIRE_PERIMETERS: "Active Fire Permimeters",
            MAP_SYMBOL_ALTITUDE_WEATHER: 500,
            MAP_SYMBOL_ALTITUDE_WILDFIRE: 250,
            MARKER_LABEL_LATLON: "markerLabelLatLon",
            MARKER_LABEL_NAME: "markerLabelName",
            MARKER_LABEL_NONE: "markerLabelNone",
            MARKER_LABEL_PLACE: "markerLabelPlace",
            /**
             * The maximum range that the globe can be zoomed out to.
             * @default 20,000,000 meters.
             */
            NAVIGATOR_MAX_RANGE: 20000000,
            PROJECTION_NAME_3D: "3D",
            PROJECTION_NAME_EQ_RECT: "Equirectangular",
            PROJECTION_NAME_MERCATOR: "Mercator",
            PROJECTION_NAME_NORTH_POLAR: "North Polar",
            PROJECTION_NAME_SOUTH_POLAR: "South Polar",
            PROJECTION_NAME_NORTH_UPS: "North UPS",
            PROJECTION_NAME_SOUTH_UPS: "South UPS",
            /**
             * The local storage key for fire lookouts.
             */
            STORAGE_KEY_FIRE_LOOKOUTS: "firelookouts",
            /**
             * The local storage key for markers.
             */
            STORAGE_KEY_MARKERS: "markers",
            /**
             * The local storage key for weather scouts.
             */
            STORAGE_KEY_WEATHER_SCOUTS: "wxscouts",
            /**
             * The URL for the sunlight REST service.
             */
            SUNLIGHT_REST_SERVICE: "/wmt-rest/rs/sunlight",
            /**
             * The URL for the surface fuel REST service.
             */
            SURFACEFUEL_REST_SERVICE: "/wmt-rest/rs/surfacefuel",
            /**
             * The URL for the surface fire REST service.
             */
            SURFACEFIRE_REST_SERVICE: "/wmt-rest/rs/surfacefire",
            /**
             * The URL for the terrain REST service.
             */
            TERRAIN_REST_SERVICE: "/wmt-rest/rs/terrain",
            /**
             * The URL for the weather REST service.
             */
            WEATHER_REST_SERVICE: "/wmt-rest/rs/weather",
            WEATHER_SCOUT_LABEL_LATLON: "weatherScoutLabelLatLon",
            WEATHER_SCOUT_LABEL_NAME: "weatherScoutLabelName",
            WEATHER_SCOUT_LABEL_NONE: "weatherScoutLabelNone",
            WEATHER_SCOUT_LABEL_PLACE: "weatherScoutLabelPlace",
            WILDLAND_FIRE_POINT: "point",
            WILDLAND_FIRE_PERIMETER: "perimeter",
            /**
             * Base URL for Web World Wind SDK. (Do not use a relative path.)
             * @default "js/libs/webworldwind/"
             * @constant
             */
            WORLD_WIND_PATH: "js/libs/webworldwind/"

        };
        /**
         * Holds configuration parameters for WMT. Applications may modify these parameters prior to creating
         * their first WMT objects. Configuration properties are:
         * <ul>
         *     <li><code>startupLatitude</code>: Initial "look at" latitude. Default is Ventura, CA.
         *     <li><code>startupLongitude</code>: Initial "look at" longitude. Default is Venura, CA.
         *     <li><code>startupLongitude</code>: Initial altitude/eye position. Default 0.
         *     <li><code>startupHeading</code>: Initial view heading. Default 0.
         *     <li><code>startupTilt</code>: Initial view tilt. Default 0.
         *     <li><code>startupRoll</code>: Initial view roll. Default 0.
         *     <li><code>viewControlOrientation</code>: horizontal or vertical. Default vertical.
         *     <li><code>showPanControl</code>: Show pan (left/right/up/down) controls. Default false.
         *     <li><code>showExaggerationControl</code>: Show vertical exaggeration controls. Default false.
         *     <li><code>wxForecastDurationHours</code>: Number hours for a weather forecast. Default 24.
         * </ul>
         */
        Wmt.configuration = {
            defaultFuelModelNo: 5, // Brush
            defaultFuelMoistureScenario: 'Very Low Dead, Fully Cured Herb',
            fireLookoutLabels: Wmt.FIRE_LOOKOUT_LABEL_LATLON,
            imageryDetailHint: (window.screen.width < 768 ? -0.1 : (window.screen.width < 1024 ? 0.0 : (window.screen.width < 1280 ? 0.1 : 0.2))),
            markerLabels: Wmt.MARKER_LABEL_NAME,
            startupLatitude: 34.29,
            startupLongitude: -119.29,
            startupAltitude: 1000000,
            startupHeading: 0,
            startupTilt: 0,
            startupRoll: 0,
            showPanControl: false,
            showExaggerationControl: false,
            showFieldOfViewControl: false,
            terrainSampleRadius: 30,
            viewControlOrientation: "vertical",
            weatherScoutLabels: Wmt.WEATHER_SCOUT_LABEL_PLACE,
            wxForecastDurationHours: 48
        };

        return Wmt;
    }
);