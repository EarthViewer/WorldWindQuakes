/* 
 * Copyright (c) 2016 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */


/*global define*/

/**
 * Explorer Configuration and constants
 * 
 * @author Bruce Schubert
 */
define([],
    function () {
        "use strict";
        /**
         * This is the top-level Explorer module. It is global.
         * @exports Explorer
         * @global
         */
        var Explorer = {
            /**
             * The Explorer version number.
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
            EVENT_MARKER_ADDED: "markerAdded",
            EVENT_MARKER_CHANGED: "markerChanged",
            EVENT_MARKER_REMOVED: "markerRemoved",
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
            GEOMETRY_POINT: 'point',
            GEOMETRY_POLYGON: 'polygon',
            GEOMETRY_POLYLINE: 'polyline',
            GEOMETRY_UNKNOWN: 'unknown',
            /**
             * Base URL for WMT application images. (Do not use a relative path.)
             */
            IMAGE_PATH: "js/wmt/images/",
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
            LAYER_NAME_MARKERS: "Markers",
            LAYER_NAME_RETICLE: "Crosshairs",
            LAYER_NAME_SKY: "Sky",
            LAYER_NAME_VIEW_CONTROLS: "Controls",
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
             * The local storage key for markers.
             */
            STORAGE_KEY_MARKERS: "markers",
            /**
             * Base URL for Web World Wind SDK. (Do not use a relative path.)
             * @default "js/libs/webworldwind/"
             * @constant
             */
            WORLD_WIND_PATH: "js/libs/webworldwind/"

        };
        /**
         * Holds configuration parameters for WWE. Applications may modify these parameters prior to creating
         * their first Explorer objects. Configuration properties are:
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
         * </ul>
         */
        Explorer.configuration = {
            imageryDetailHint: (window.screen.width < 768 ? -0.1 : (window.screen.width < 1024 ? 0.0 : (window.screen.width < 1280 ? 0.1 : 0.2))),
            markerLabels: Explorer.MARKER_LABEL_NAME,
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
        };

        return Explorer;
    }
);