/**
 * rh-icon demo
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, rhea, undefined) {
	'use strict';

	rhea.iconConfig.set({
		colors: {
			black: '#000',
			blue: '#0000FF'
		},
		prefix: 'icon',
		pngUrl: '../demo/img/',
		size: 256
	});

	rhea.icon.apply();

})(window, window.rhea);