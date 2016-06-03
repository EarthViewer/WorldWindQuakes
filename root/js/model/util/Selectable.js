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
 * Selectable is a mix-in module that adds the "select" capabilities to an object.
 * @param {Publisher} publisher Extends the object by adding the event generator.
 * @param {Explorer} explorer Constants.
 * @returns {Selectable}
 * 
 * @author Bruce Schubert
 */
define([
    'model/util/Publisher', 
    'model/Explorer'],
    function (publisher, explorer) {
        "use strict";
        
        var Selectable = {
            select: function () {
                if (this.isSelectable) {
                    if (this.selectMe()) {
                        // Fire the selected event if we succeeded.
                        this.fire(explorer.EVENT_OBJECT_SELECTED, this);
                    }
                }
            },
            /**
             * Adds the the Selectable capabilities to the given object.
             * @param {Object} o The object that will become selectable.
             * @param {Boolean Function()} selectCallback The function that performs the edit.
             */
            makeSelectable: function (o, selectCallback) {
                // Ensure we don't duplicate 
                if (o.select) {
                    return; // o is already selectable
                }
                // Add the function(s)
                var i;
                for (i in Selectable) {
                    if (Selectable.hasOwnProperty(i) && typeof Selectable[i] === 'function') {
                        if (Selectable[i] === this.makeSelectable) {
                            continue;
                        }
                        o[i] = Selectable[i];
                    }
                }
                // Add the properties
                o.isSelectable = true;
                o.selectMe = selectCallback;
                
                // Add the Publisher capability so that events can be generated.
                publisher.makePublisher(o);
            }
        };
        return Selectable;
    }
);

