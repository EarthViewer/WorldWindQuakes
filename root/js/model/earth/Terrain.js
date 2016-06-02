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

define([
    'model/util/Log',
    'model/util/WmtUtil',
    'worldwind'],
    function (
        Log,
        WmtUtil,
        ww) {
        "use strict";

        /**
         * Constructs a terrain from a specified latitude and longitude in degrees and elevation in meters, 
         * and aspect and slope in degrees.
         * @alias Terrain
         * @constructor
         * @classdesc Represents a latitude, longitude, elevation triple, with latitude, longitude, 
         * aspect and slope in degrees and elevation in meters.
         * @param {Number} latitude The latitude in degrees.
         * @param {Number} longitude The longitude in degrees.
         * @param {Number} elevation The elevation in meters.
         * @param {Number} aspect The aspect in degrees.
         * @param {Number} slope The elevation in degrees.
         */
        var Terrain = function (latitude, longitude, elevation, aspect, slope) {
            /**
             * The latitude in degrees.
             * @type {Number}
             */
            this.latitude = latitude;
            /**
             * The longitude in degrees.
             * @type {Number}
             */
            this.longitude = longitude;
            /**
             * The elevation in meters.
             * @type {Number}
             */
            this.elevation = elevation;
            /**
             * The elevation in degrees.
             * @type {Number}
             */
            this.aspect = aspect;
            /**
             * The slope in degrees.
             * @type {Number}
             */
            this.slope = slope;
        };

        /**
         * A Terrain with latitude, longitude, elevation, aspect and slope all 0.
         * @constant
         * @type {Terrain}
         */
        Terrain.ZERO = new Terrain(0, 0, 0, 0, 0);
        /**
         * A Terrain with latitude, longitude, elevation, aspect and slope all Number.NaN.
         * @constant
         * @type {Terrain}
         */
        Terrain.INVALID = new Terrain(Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN);

        /**
         * Returns the computed linear distance between this terrain and another terrain object.
         * @param {Terrain} terrain The other terrain.
         * @returns {Number} Linear distance in meters.
         */
        Terrain.prototype.distanceBetween = function (terrain) {
            return WmtUtil.distanceBetweenLatLons(this.latitude, this.longitude, terrain.latitude, terrain.longitude);
        };
        /**
         * Sets this position to the latitude, longitude and elevation of a specified position.
         * @param {Position} terrain The terrain to copy.
         * @returns {Position} This position, set to the values of the specified position.
         * @throws {ArgumentError} If the specified position is null or undefined.
         */
        Terrain.prototype.copy = function (terrain) {
            if (!terrain) {
                throw new WorldWind.ArgumentError(
                    Log.error("Terrain", "copy", "missingTerrain"));
            }

            this.latitude = terrain.latitude;
            this.longitude = terrain.longitude;
            this.elevation = terrain.elevation;
            this.aspect = terrain.aspect;
            this.slope = terrain.slope;

            return this;
        };

        /**
         * Indicates whether this terrrain has the same values as a specified terran.
         * @param {Terrain} terrain The terrain to compare with this one.
         * @returns {Boolean} true if this terrain is equal to the specified one, otherwise false.
         */
        Terrain.prototype.equals = function (terrain) {
            return terrain
                && terrain.latitude === this.latitude
                && terrain.longitude === this.longitude
                && terrain.elevation === this.elevation
                && terrain.aspect === this.aspect
                && terrain.slope === this.slope;
        };


        /**
         * Returns a string representation of this terrain.
         * @returns {String}
         */
        Terrain.prototype.toString = function () {
            return "(" + this.latitude.toString() + "\u00b0, "
                + this.longitude.toString() + "\u00b0, "
                + this.elevation.toString() + "m, "
                + this.aspect.toString() + "\u00b0, "
                + this.slope.toString() + "\u00b0)";
        };

        return Terrain;
    }
);
