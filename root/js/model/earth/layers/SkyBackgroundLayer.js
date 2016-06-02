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

/*global define, $ */

/**
 * The SkyBackgroundLayer renders a background for the globe that varies
 * between sky blue and dark blue based on altitude.
 * 
 * @param {WorldWind} WorldWind
 * @returns {SkyBackgroundLayer}
 * 
 * @author Bruce Schubert
 */
define([
    'worldwind'],
    function (
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {WorldWindow} worldWindow
         * @returns {SkyBackgroundLayer}
         */
        var SkyBackgroundLayer = function (worldWindow) {
           
            // Inherits from the basic Layer 
            WorldWind.Layer.call(this, "Sky");
            
            // Store the WorldWindow canvas for doRender 
            this.globeCanvas = $(worldWindow.canvas);
            
            this.MIN_ALT = 100000;
            this.MAX_ALT = 1500000;
            this.SKY_LIGHTNESS_FAR = 30;    // Dark Blue
            this.SKY_LIGHTNESS_NEAR = 70;   // Sky Blue
            this.SKY_HUE = 205;             // Sky Blue
            this.SKY_SATURATION = 47;       // Sky Blue
            
        };
        SkyBackgroundLayer.prototype = Object.create(WorldWind.Layer.prototype);

        /**
         * Sets the background color of the canvas based on the eye position.
         * @param {DrawContext} dc
         */
        SkyBackgroundLayer.prototype.doRender = function (dc) {
            var eyePosition = dc.eyePosition;
            if (!eyePosition) {
                return;
            }
            this.globeCanvas.css('background-color', this.getCSSHSL(this.skyColor(eyePosition.altitude)));
        };

        /**
         * Gets the sky color base on the altitude.
         * @param {Number} altitude Eye position altitude in meters.
         * @returns {Object} HSV Sky color.
         */
        SkyBackgroundLayer.prototype.skyColor = function (altitude) {
            var range = this.MAX_ALT - this.MIN_ALT,
                value = Math.min(Math.max(altitude, this.MIN_ALT), this.MAX_ALT),
                lightness = this.interpolate(this.SKY_LIGHTNESS_NEAR, this.SKY_LIGHTNESS_FAR, range, value);
            
            return {h: this.SKY_HUE, s: this.SKY_SATURATION, l: lightness};
        };


        /**
         * Returns an interpolated value between start and end, based on a count between a number of steps.
         * @param {Number} start Value at lower end of range (steps)
         * @param {Number} end value at upper end of range
         * @param {Number} steps Range 
         * @param {Number} count Value
         * @returns {Number}
         */
        SkyBackgroundLayer.prototype.interpolate = function (start, end, steps, count) {
            var s = start,
                e = end,
                final = s + (((e - s) / steps) * count);
            return Math.floor(final);
        };

        /**
         * Gets a CSS hsl string from a HSL color
         * @param {Object} hsl HSL color object
         * @returns {String} CSS HSL string
         */
        SkyBackgroundLayer.prototype.getCSSHSL = function (hsl) {
            // return the CSS HSL colour value
            return 'hsl(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%)';
        };

        return SkyBackgroundLayer;
    }
);
