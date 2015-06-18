/**
 * rh-icon
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, rhea, undefined) {

	if (rhea.icon) {
		return;
	}

	var flags = {};

	flags.serialize = (typeof XMLSerializer == 'function');

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg.js
	flags.svg = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

	// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg/inline.js
	flags.inlinesvg = (function () {
		var div = document.createElement('div');
		div.innerHTML = '<svg/>';
		return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
	})();

	var svgSymbols = {};
	var xmlSerializer;

	if (flags.serialize) {
		xmlSerializer = new XMLSerializer();
	}

	/**
	 * Returns the child nodes of a <symbol> as a string.
	 *
	 * Symbols are "injected" because <use xlink:href="#symbol"> does not work
	 * on second-level pages, e.g. /path/to/page, if <base> is in <head>.
	 * https://github.com/angular/angular.js/issues/8934
	 *
	 * @param {String} elmId DOM element ID
	 * @returns {Object}
	 */
	function getSvgSymbol (elmId) {
		if (elmId in svgSymbols) {
			return svgSymbols[elmId];
		}

		if (!xmlSerializer) {
			throw new Error('XMLSerializer is not instantiated.');
		}

		var viewBox;
		var inner = '';
		var elm = document.getElementById(elmId);

		// If symbol is an element node.
		if (elm && elm.nodeType === 1) {
			viewBox = elm.getAttribute('viewBox');

			lodash.forEach(elm.childNodes, function (node) {
				// If child node is not a text node.
				if (node.nodeType !== 3) {
					inner += xmlSerializer.serializeToString(node);
				}
			});
		}

		svgSymbols[elmId] = {
			viewBox: viewBox,
			inner: inner
		};

		return svgSymbols[elmId];
	}

	/**
	 *
	 * @param {String} color
	 * @returns {Boolean|String}
	 */
	function getFill (color) {
		var config = rhea.iconConfig.get();
		if (color && color in config.colors) {
			return config.colors[color];
		}
		return false;
	}

	/**
	 *
	 * @param {Object} opts
	 * @returns {String}
	 */
	function renderPng (opts) {
		var config = rhea.iconConfig.get();
		return '<img class="' + opts.className + '" src="' + config.pngUrl + config.prefix + '-' + opts.id + (opts.color ? '-' + opts.color : '') + '.png" alt="" />';
	}

	/**
	 *
	 * @param {Object} opts
	 * @returns {String}
	 */
	function renderSvg (opts) {
		var config = rhea.iconConfig.get();
		var symbol = getSvgSymbol(config.prefix + '-' + opts.id);
		var viewBox = symbol.viewBox || '0 0 ' + opts.width + ' ' + opts.height;
		return '<svg class="' + opts.className + '"' + (opts.fill ? ' fill="' + opts.fill + '"' : '') + ' viewBox="' + viewBox + '" preserveAspectRatio="xMidYMid meet" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + symbol.inner + '</svg>';
	}

	/**
	 *
	 * @returns {rhIconConfig}
	 */
	function rhIconConfig () {
		this.config = {
			colors: {}, // {Object} Colors of default and hover icons, if any. Key: color, value: hexadecimal or named value (compatible with <svg> `fill` attribute)
			prefix: 'icon', // {String}
			pngUrl: '', // {String} URL of directory with PNG fallback images
			size: 128, // {Number} Width and height of SVG (viewBox)
			svg: undefined // {Boolean} Override SVG feature detection (can be used for testing fallback images)
		};
	}

	/**
	 *
	 * @param {Object} values
	 */
	rhIconConfig.prototype.set = function (values) {
		lodash.merge(this.config, values);
	};

	/**
	 *
	 * @returns {Object}
	 */
	rhIconConfig.prototype.get = function () {
		return this.config;
	};

	/**
	 *
	 * @returns {rhIcon}
	 */
	function rhIcon () {

	}

	/**
	 *
	 * @param {jQuery} context
	 */
	rhIcon.prototype.apply = function (context) {
		var config = rhea.iconConfig.get();
		var useSvg = (config.svg === true || (config.svg === undefined && flags.serialize && flags.svg && flags.inlinesvg));

		var $elms;
		if (context instanceof jQuery && context.is('[rh-icon]')) {
			$elms = context;
		}
		else {
			$elms = jQuery('[rh-icon]', context);
		}

		lodash.forEach($elms, function (elm) {
			var $elm = jQuery(elm);
			var attrs = $elm.data() || {};

			if (attrs.rhIconProcessed) {
				return;
			}
			$elm.data('rh-icon-processed', true);

			var prefix = config.prefix;
			var id = attrs.id;
			var hoverId = attrs.hoverId;
			var hoverColor = attrs.hoverColor;
			var title = attrs.title;

			$elm.addClass(prefix + ' ' + prefix + '-' + id + (hoverId || hoverColor ? ' has-hover' : ''));
			$elm.attr('title', title);
			$elm.attr('aria-hidden', 'true');
			$elm.attr('draggable', 'false');
			$elm.attr('ondragstart', 'return false;');

			var color = attrs.color;
			var defaultIcon = {
				className: 'default' + (color ? ' ' + color : ''),
				id: attrs.id,
				color: color,
				fill: getFill(color),
				width: attrs.width || config.size,
				height: attrs.height || config.size
			};

			var hoverIcon;
			if (attrs.hoverId || attrs.hoverColor) {
				hoverColor = attrs.hoverColor || color;
				hoverIcon = {
					className: 'hover' + (hoverColor ? ' ' + hoverColor : ''),
					id: attrs.hoverId || attrs.id,
					color: hoverColor,
					fill: getFill(hoverColor),
					width: defaultIcon.width,
					height: defaultIcon.height
				};
			}

			var html;
			if (useSvg) {
				html = renderSvg(defaultIcon);
				if (hoverIcon) {
					html += renderSvg(hoverIcon);
				}
			}
			else {
				html = renderPng(defaultIcon);
				if (hoverIcon) {
					html += renderPng(hoverIcon);
				}
			}

			$elm.html(html);

			// Use padding-bottom hack on container to preserve aspect ratio.
			// @see https://css-tricks.com/scale-svg
			var ratio = Number(defaultIcon.height / defaultIcon.width * 10000) / 100;
			$elm.attr('style', (ratio === 100 ? '' : 'height: 0; padding: 0 0 ' + ratio + '% 0;'));
		});
	};

	rhea.icon = new rhIcon();
	rhea.iconConfig = new rhIconConfig();

})(window, window.rhea);