/* 
 * Copyright (c) 2016 Bruce Schubert <bruce@emxsys.com>.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */


/**
 * The LocationViewModel ensulates the data representing globe's camera position, i.e., the position 
 * under the crosshairs.
 * @param {OracleJet} oj
 * @param {KnockOut} ko
 * @param {Explorer} explorer
 * @returns {LocationViewModel}
 */
define(['ojs/ojcore', 'knockout', 'model/Explorer'],
        function (oj, ko, explorer) {

            /**
             * Constructs a LocationViewModel.
             * @returns {LocationViewModel} A new instance.
             */
            function LocationViewModel() {
//            var model = controller.model;
//            this.eyePosLatitude = model.viewModel.eyePosLatitude;
//            this.eyePosLongitude = model.viewModel.eyePosLongitude;
            }

            return LocationViewModel;
        });
