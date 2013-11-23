/*
 * 	jQuery LayerIt UI Widget 1.0
 * 	Copyright 2013 Matt Downs
 * 
 * 	https://github.com/mdowns56/layerit
 * 
 * 	Depends:
 * 		jQuery 1.4.2
 * 		jQuery UI 1.8 widget factory
 * 
 *  Licensed under MIT license.:
 * 		http://www.opensource.org/licenses/mit-license.php
 */

(function($){

	$.widget( "mdowns.layerIt", {
		options: {
			layers: [],
			zIndex: 0
		},
		_create: function() {
			var o = this.options;
			
			//add class and set background color
			this.element.addClass( "layerIt" );
			this.element.css({'background-color':o.bgColor});
			
			//create the layers
			for(var i=0;i<o.layers.length; i++) {
				this._createLayer(o.layers[i], o.zIndex + i);
			}
		},
		_setOption: function( key, value ) {
			//if the color is set, set the element background
			if('bgColor' === key) {
				this.element.css('background-color',value);
			}
			this._super( key, value );
		},
		_setOptions: function( options ) {
			this._super( options );
		},
		//gets a layer's index
		_getLayerIndex: function(name) {
			//loop through the layers and find the correct one
			var layers = this.options.layers;
			
			//find the layer with the given name
			for(var i=0; i<layers.length; i++) {
				var layer = layers[i];
			
				if(!layer || !layer.name) continue;
				
				if(name === layer.name){
					return i;
				}
			}
			
			//return -1 if not found
			return -1;
		},
		//add a layer
		add: function(layer){
			this._addLayer(layer);
		},
		//update a layer
		update: function(name, layerUpdate){
			//find the layer
			var index = this._getLayerIndex(name);
			
			//only update the layer, if it exists
			if(index >= 0){
				//only update what was given
				$.extend(true,this.options.layers[index].image , layerUpdate);
				
				//redraw the layer
				this._drawLayer(name);
			}
		},
		//hide a layer
		hide: function(name) {
			this._hideLayer(name);
		},
		//show a layer
		show: function(name) {
			this._showLayer(name);
		},
		//remove layer
		remove: function(name) {
			this._removeLayer(name);
		},
		move: function(name, direction) {
			var index = this._getLayerIndex(name);
			
			if(index < 0) {
				return;
			}
			
			if(direction == 'forward') {
				if(index == this.options.layers.length - 1){
					return;
				}
				
				index++;
			}
			else if(direction == 'back'){
				if(index == 0) {
					return;
				}
				
				index--;
			}
			else {
				throw 'Direction \'' + direction + '\' not supported.';
			}
			
			this._moveLayer(name,index);
		},
		color: function(value){
			this._setOption('bgColor',value);
		},
		//create a layer
		_createLayer: function(layer, index) {
			var img = $("<img id='layer_" + layer.name + "'/>").css({position:'absolute',zIndex:index});
			this.element.append(img);
			this._drawLayer(layer.name);
		},
		//hide a layer
		_hideLayer: function(name) {
			this._getLayerElement(name).hide();
		},
		//show a layer
		_showLayer: function(name) {
			this._getLayerElement(name).show();
		},
		//get the element corresponding to the layer
		_getLayerElement: function(name){
			return $("img#layer_"+name);
		},
		//add a layer
		_addLayer: function(layer) {
			var index = this._getLayerIndex(layer.name);
			
			//check the index
			if(index >= 0){
				return;
			}
			
			//add the layer to the array
			var layers = this.options.layers;
			layers.push(layer);
			
			//get the index
			var index = layers.length - 1;
			
			//create the layer
			this._createLayer(layer, index);
		},
		//remove a layer
		_removeLayer: function(name) {
			var index = this._getLayerIndex(name);
			
			//check the index
			if(index < 0){
				return;
			}
			
			//remove the element from the array
			this.options.layers.splice(index,1);
			
			//remove the DOM element
			this._getLayerElement(name).remove();
		},
		//move a layer to a new z-index
		_moveLayer: function(name, newIndex){
			var index = this._getLayerIndex(name);
			
			if(index < 0) {
				return;
			}
			
			var layers = this.options.layers;
			
			layers.splice(newIndex, 0, layers.splice(index,1)[0]);

			this._redrawLayers();
		},
		//draw a layer
		_drawLayer: function(name) {
			var index = this._getLayerIndex(name);
			
			//check the index
			if(index < 0){
				return;
			}
			
			//get the layer
			var layer = this.options.layers[index];
			
			//set the src and css for the image
			var el = this._getLayerElement(name).attr('src',layer.image.src);
			
			if(layer.image.css) {
				el.css(layer.image.css);
			}
		},
		//redraw all the layers
		_redrawLayers: function(){
			var layers = this.options.layers;
			for(var i=0; i< layers.length; i++) {
				var layer = layers[i];
				var css = {zIndex : this.options.zIndex + i};
				$.extend(css,layer.image.css);
				this._getLayerElement(layer.name).attr('src',layer.image.src).css(css);
			}
		},
		//destroy the widget
		_destroy: function() {
			//remove the layerIt class and set the background to transparent
			this.element.removeClass("layerIt" );
			this.element.css({'background-color':'transparent'});
			
			//remove the layers
			var length = this.options.layers.length;
			for(var i=0;i<length;i++) {
				this._removeLayer(i);
			}
		}
	});
})(jQuery);
