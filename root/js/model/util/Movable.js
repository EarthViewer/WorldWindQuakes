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
 * Movable is a mix-in module that adds "move" capabilites to an object.
 * 
 * @param {Publisher} publisher Extends the object with publish event capabilites.
 * @param {WmtUtil} utils Utilties.
 * @param {Explorer} explorer Constants.
 * @returns {Movable}
 * 
 * @author Bruce Schubert
 */
define([
    'util/Publisher',
    'util/WmtUtil',
    'model/Explorer'],
    function (
        publisher,
        utils,
        explorer) {
        "use strict";
        var Movable = {
            moveStarted: function () {
                if (this.isMovable) {
                    this.fire(explorer.EVENT_OBJECT_MOVE_STARTED, this);
                }
            },
            moveToLatLon: function (latitude, longitude) {
                if (this.isMovable) {
                    this.latitude = latitude;
                    this.longitude = longitude;
                    this.fire(explorer.EVENT_OBJECT_MOVED, this);
                }
            },
            moveFinished: function () {
                if (this.isMovable) {
                    this.fire(explorer.EVENT_OBJECT_MOVE_FINISHED, this);
                }
            },
            /**
             * Adds the the movable capabilities to the given object.
             * @param {Object} o The object that will become movable.
             */
            makeMovable: function (o) {
                // Ensure we don't duplicate 
                if (o.moveToLatLon) {
                    return; // o is already movable
                }
                // Add the functions
                var i;
                for (i in Movable) {
                    if (Movable.hasOwnProperty(i) && typeof Movable[i] === 'function') {
                        if (Movable[i] === this.makeMovable) {
                            continue;
                        }
                        o[i] = Movable[i];
                    }
                }
                // Add the properties
                o.isMovable = true;

                // Add the Publisher capability so that events can be generated.
                publisher.makePublisher(o);
            }
        };
        return Movable;
    }
);

