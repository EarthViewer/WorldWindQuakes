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
 * The LandfireLayer renders LANDFIRE fuel models.
 * @exports LandfireLayer
 * 
 * @returns {LandfireLayer}
 * 
 * See: http://landfire.gov/data_access.php
 * 
 * WMS Capabilities:
 * http://landfire.cr.usgs.gov/arcgis/services/Landfire/US_130/MapServer/WMSServer?service=wms&request=GetCapabilities&version=1.3.0
 * 
 */

define([
    'model/Wmt',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";

        /**
         * Constructs a LANDFIRE layer.
         * @alias LandfireLayer
         * @constructor
         * @augments WmsLayer
         *  <FormatSuffix>.png</FormatSuffix>
         *  <NumLevels count="12" numEmpty="0"/>
         *  <Sector>
         *      <SouthWest>
         *          <LatLon latitude="22.6952681387" longitude="-128.0067177405" units="degrees"/>
         *      </SouthWest>
         *      <NorthEast>
         *          <LatLon latitude="51.6768794844" longitude="-65.2077897436" units="degrees"/>
         *      </NorthEast>
         *  </Sector>
         *  <TileOrigin>
         *  <LatLon latitude="-90.0" longitude="-180.0" units="degrees"/>
         *  </TileOrigin>
         *  <TileSize>
         *      <Dimension height="512" width="512"/>
         *  </TileSize>
         *  <LevelZeroTileDelta>
         *      <LatLon latitude="36.0" longitude="36.0" units="degrees"/>
         *  </LevelZeroTileDelta>
         *  <ImageFormat>image/png</ImageFormat>
         *  <UseTransparentTextures>true</UseTransparentTextures>
         */
        var LandfireLayer = function () {
            var //capabilities = WorldWind.WmsCapabilities(wmt.IMAGE_PATH + '../globe/LANDFIRE.FBFM40.xml'),
                //config = WorldWind.WmsLayer.formLayerConfiguration(capabilities),
                cfg = {
                    title: "Fuel Models (13)",
                    version: "1.3.0",
                    service: "http://landfire.cr.usgs.gov/arcgis/services/Landfire/US_130/MapServer/WMSServer?",
                    layerNames: "US_130FBFM13",
                    sector: new WorldWind.Sector(22.6952681387, 51.6768794844, -128.0067177405, -65.2077897436),
                    levelZeroDelta: new WorldWind.Location(36, 36),
                    numLevels: 12,
                    format: "image/png",
                    size: 512,
                    coordinateSystem: "EPSG:4326", // optional
                    styleNames: "" // (optional): {String} A comma separated list of the styles to include in this layer.</li>
                };
                
            WorldWind.WmsLayer.call(this, cfg);
            
            // Make this layer translucent
            this.opacity = 0.5;

        };

        LandfireLayer.prototype = Object.create(WorldWind.WmsLayer.prototype);

        return LandfireLayer;
    }
);