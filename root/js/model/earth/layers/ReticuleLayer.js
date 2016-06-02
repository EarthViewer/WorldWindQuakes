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

/*global define */

/**
 * The ReticuleLayer renders a reticule (e.g., reticule) in the center of the World Wind globe.
 * @exports ReticuleLayer
 * 
 * @param {Crosshairs} Crosshairs
 * @param {Compass} Crosshairs
 * @param {Object} Wmt - Provides image path.
 * @param {Object} WorldWind
 * @returns {ReticuleLayer}
 */

define([
    'model/earth/Compass',
    'model/earth/Crosshairs',
    'model/Wmt',
    'worldwind'],
    function (
        Compass,
        Crosshairs,
        Wmt,
        ww) {
        "use strict";

        /**
         * Constructs a reticule layer.
         * @alias ReticuleLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Displays a reticule. Reticule layers cannot be shared among World Windows. Each World Window if it
         * is to have a reticule layer must have its own. See the MultiWindow example for guidance.
         */
        var ReticuleLayer = function () {
            WorldWind.RenderableLayer.call(this, "Crosshairs");

            // The compass has been superceded by the LocationWidget
            //this._compass = new Compass(Wmt.IMAGE_PATH);
            this._reticule = new Crosshairs(Wmt.IMAGE_PATH);

            // Put crosshairs on top of the globe
            this.addRenderable(this._reticule);
            //this.addRenderable(this._compass);
        };

        ReticuleLayer.prototype = Object.create(WorldWind.RenderableLayer.prototype);

        Object.defineProperties(ReticuleLayer.prototype, {
            /**
             * The reticule to display.
             * @type {Crosshairs}
             * @default {@link Reticule}
             * @memberof ReticuleLayer.prototype
             */
            reticule: {
                get: function () {
                    return this._reticule;
                },
                set: function (reticule) {
                    if (reticule && reticule instanceof Crosshairs) {
                        this.removeAllRenderables();
                        this.addRenderable(reticule);
                        this._reticule = reticule;
                    }
                }
            },
//            compass: {
//                get: function () {
//                    return this._compass;
//                },
//                set: function (compass) {
//                    if (compass && compass instanceof Compass) {
//                        this.removeAllRenderables();
//                        this.addRenderable(compass);
//                        this._compass = compass;
//                    }
//                }
//            }
        });

        return ReticuleLayer;
    }
);