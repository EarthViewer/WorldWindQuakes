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

/*global define, WorldWind */

/**
 * The Settings module is responsible for saving and restoring the globe view between sessions.
 * 
 * @author Bruce Schubert
 */
define([
    'model/util/Log',
    'model/Wmt'],
    function (
        Log,
        Wmt) {
        "use strict";
        var Settings = {
            
            STARTUP_LATITUDE_KEY:  "startupLatitude",
            STARTUP_LONGITUDE_KEY:  "startupLongitude",
            STARTUP_ALTITUDE_KEY:  "startupAltitude",
            STARTUP_ROLL_KEY:  "startupRoll",
            STARTUP_TILT_KEY:  "startupTilt",
            STARTUP_HEADING_KEY:  "startupHeading",
            /**
             * 
             * @param {Controller} controller
             */
            saveSessionSettings: function (controller) {
                if (!window.localStorage) {
                    Log.warning("Settings", "saveSessionSettings", "Local Storage is not supported!");
                    return;
                }

                var target = controller.getTargetTerrain(),
                    pos = new WorldWind.Location(target.latitude, target.longitude), // controller.wwd.navigator.lookAtLocation,
                    alt = controller.wwd.navigator.range,
                    heading = controller.wwd.navigator.heading,
                    tilt = controller.wwd.navigator.tilt,
                    roll = controller.wwd.navigator.roll;

                // Save the eye position
                localStorage.setItem(this.STARTUP_LATITUDE_KEY, pos.latitude);
                localStorage.setItem(this.STARTUP_LONGITUDE_KEY, pos.longitude);
                localStorage.setItem(this.STARTUP_ALTITUDE_KEY, alt);

                // Save the globe orientation.
                localStorage.setItem(this.STARTUP_HEADING_KEY, heading);
                localStorage.setItem(this.STARTUP_TILT_KEY, tilt);
                localStorage.setItem(this.STARTUP_ROLL_KEY, roll);

            },
            /**
             * 
             * @param {Controller} controller
             */
            restoreSessionSettings: function (controller) {
                try {
                    if (!localStorage) {
                        Log.warning("Settings", "restoreSessionSettings", "Local Storage is not enabled!");
                        return;
                    }
                    var lat = Number(localStorage.getItem(this.STARTUP_LATITUDE_KEY)),
                        lon = Number(localStorage.getItem(this.STARTUP_LONGITUDE_KEY)),
                        alt = Number(localStorage.getItem(this.STARTUP_ALTITUDE_KEY)),
                        head = Number(localStorage.getItem(this.STARTUP_HEADING_KEY)),
                        tilt = Number(localStorage.getItem(this.STARTUP_TILT_KEY)),
                        roll = Number(localStorage.getItem(this.STARTUP_ROLL_KEY));

                    if (isNaN(lat) || isNaN(lon)) {
                        Log.warning("Settings", "restoreSessionSettings", "Previous state invalid: Using default lat/lon.");
                        lat = Wmt.configuration.startupLatitude;
                        lon = Wmt.configuration.startupLongitude;
                    }
                    if (isNaN(alt)) {
                        Log.warning("Settings", "restoreSessionSettings", "Previous state invalid: Using default altitude.");
                        alt = Wmt.configuration.startupAltitude;
                    }
                    if (isNaN(head) || isNaN(tilt) || isNaN(roll)) {
                        Log.warning("Settings", "restoreSessionSettings", "Previous state invalid: Using default view angles.");
                        head = Wmt.configuration.startupHeading;
                        tilt = Wmt.configuration.startupTilt;
                        roll = Wmt.configuration.startupRoll;
                    }
                    
                    // Initiate animation to target
                    // The animation routine does a better job of 
                    // preparing the map layers than does setting
                    // the view of the target (below) because it
                    // drills down through the various levels-of detail.
                    controller.lookAtLatLon(lat, lon, alt);
                    
                    // Restore view of target
                    // This routine doesn't always load the map level-of-detail
                    // appropriate for low alitudes. And you can't call this
                    // routine while lookAtLatLon is animiating.
//                    controller.wwd.navigator.lookAtLocation.latitude = lat;
//                    controller.wwd.navigator.lookAtLocation.longitude = lon;
//                    controller.wwd.navigator.range = alt;
//                    controller.wwd.navigator.heading = head;
//                    controller.wwd.navigator.tilt = tilt;
//                    controller.wwd.navigator.roll = roll;
//                    controller.wwd.redraw();
                    
                } catch (e) {
                    Log.error("Settings", "restoreSessionSettings",
                        "Exception occurred processing cookie: " + e.toString());
                }

            }
        };
        return Settings;
    }
);
