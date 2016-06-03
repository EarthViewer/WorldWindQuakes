/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

/*global define, WorldWind*/

/**
 * @exports Compass
 * @author t tgaskins $
 */
define(['model/Explorer',
    'worldwind'],
    function (explorer, ww) {
        "use strict";

        /**
         * Constructs a compass.
         * @alias Compass
         * @constructor
         * @augments ScreenImage
         * @classdesc Displays a compass image at a specified location in the World Window. The compass image rotates
         * and tilts to reflect the current navigator's heading and tilt.
         * @param {Offset} screenOffset The offset indicating the image's placement on the screen. If null or undefined
         * the compass is placed at the upper-right corner of the World Window.
         * Use [the image offset property]{@link ScreenImage#imageOffset} to position the image relative to the
         * screen point.
         * @param {String} imagePath The URL of the image to display. If null or undefined, a default compass image is used.
         */
        var Compass = function () {

            var sOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5),
                iPath = explorer.IMAGE_PATH + "notched-compass.png";

            // Inhererit the ScreenImage properties
            WorldWind.ScreenImage.call(this, sOffset, iPath);
            // Align the center of the image with the screen point.
            this.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
            // Scale the default image.
            this.imageScale = 0.27;
        };
        // Inherit the ScreenImage methods
        Compass.prototype = Object.create(WorldWind.ScreenImage.prototype);

        /**
         * Capture the navigator's heading apply it to the compass' screen image.
         * @param {DrawContext} dc The current draw context.
         */
        Compass.prototype.render = function (dc) {
            // Capture the navigator's heading and tilt and apply it to the compass' screen image.
            this.imageRotation = dc.navigatorState.heading;

            // Call the inherited method to finish the rendering
            WorldWind.ScreenImage.prototype.render.call(this, dc);
        };

        return Compass;
    }
);