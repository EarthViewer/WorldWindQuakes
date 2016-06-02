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

define([
    'worldwind'],
    function (
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {WorldWindow} worldWindow
         * @returns {DnDController}
         */
        var DnDController = function (worldWindow) {
            this.wwd = worldWindow;

            this.isArmed = false;

            var self = this,
                clickRecognizer;

            this.wwd.addEventListener("click", function (event) {
                self.handleDrop(event);
            });
            this.wwd.addEventListener("touchend", function (event) {
                self.handleDrop(event);
            });

            // Listen for tap gestures on mobile devices
//            clickRecognizer = new WorldWind.ClickRecognizer(this.wwd);
//            clickRecognizer.addGestureListener(function (event) {
//                self.handleDrop(event);
//            });

        };

        /**
         * Initiates the DnD operation.  The operation is completed by handleDrop.
         * 
         * @param {Object} dropObject The object who's latitude and longitude properties 
         * will be added or updated with the drop location.
         * @param {type} dropCallback The function what will be called after the drop with updated dropObject.
         */
        DnDController.prototype.armDrop = function (dropObject, dropCallback) {
            this.dropObject = dropObject;
            this.dropCallback = dropCallback;

            this.isArmed = true;
            $(this.wwd.canvas).css('cursor', 'crosshair'); // This should be a function of a Globe object
        };

        /**
         * Handles a mouse click event by dropping the object supplied to the "armDrop" at the terrain pick point.
         * The "drop" action is comprised of setting the latitude and longitude properties of the supplied object,
         * and then calling the supplied callback method, passing the updated drop object to the function.
         * @param {type} event
         */
        DnDController.prototype.handleDrop = function (event) {
            if (!this.isArmed) {
                return;
            }
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var type = event.type,
                x,
                y,
                pickList,
                terrainObject;

            switch (type) {
                case 'click':
                    x = event.clientX;
                    y = event.clientY;
                    break;
                case 'touchend':
                    if (!event.changedTouches[0]) {
                        return;
                    }
                    x = event.changedTouches[0].clientX;
                    y = event.changedTouches[0].clientY;
                    break;
            }
            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            pickList = this.wwd.pickTerrain(this.wwd.canvasCoordinates(x, y));
            terrainObject = pickList.terrainObject();
            if (terrainObject) {
                // Update the drop object with new position
                this.dropObject.latitude = terrainObject.position.latitude;
                this.dropObject.longitude = terrainObject.position.longitude;
                
                // Cleanup and consume this event
                $(this.wwd.canvas).css('cursor', 'pointer');
                this.isArmed = false;
                event.stopImmediatePropagation();
                
                // Transfer control to the callback function with the udpated drop object
                this.dropCallback(this.dropObject);
            }
        };

        return DnDController;
    }
);