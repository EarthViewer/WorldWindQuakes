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
 * Openable is a mix-in module that adds the "Open" capabilities to an object.
 * @param {Publisher} publisher Extends the object by adding the event generator
 * @param {Explorer
 * @returns {Openable}
 * 
 * @author Bruce Schubert
 */
define([
    'model/util/Publisher', 
    'model/Explorer'],
    function (publisher, explorer) {
        "use strict";
        
        var Openable = {
            open: function () {
                if (this.isOpenable) {
                    if (this.openMe()) {
                        // Fire the opened event if we succeeded.
                        this.fire(explorer.EVENT_OBJECT_OPENED, this);
                    }
                }
            },
            /**
             * Adds the the Openable capabilities to the given object.
             * @param {Object} o The object that will become openable.
             * @param {Boolean Function()} openCallback The function that performs the edit.
             */
            makeOpenable: function (o, openCallback) {
                // Ensure we don't duplicate 
                if (o.open) {
                    return; // o is already openable
                }
                // Add the function(s)
                var i;
                for (i in Openable) {
                    if (Openable.hasOwnProperty(i) && typeof Openable[i] === 'function') {
                        if (Openable[i] === this.makeOpenable) {
                            continue;
                        }
                        o[i] = Openable[i];
                    }
                }
                // Add the properties
                o.isOpenable = true;
                o.openMe = openCallback;
                
                // Add the Publisher capability so that events can be generated.
                publisher.makePublisher(o);
            }
        };
        return Openable;
    }
);

