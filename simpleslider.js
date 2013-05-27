(function(){
	'use strict';
	var SimpleSlider = function(containerElem, options){
		this.containerElem = containerElem;
		if( !options ) options = {};
		this.transitionProperty = options.transitionProperty ? options.transitionProperty : 'opacity';
		this.transitionValue =  options.transitionValue ? options.transitionValue : 0;
		this.transitionTime = options.transitionTime ? options.transitionTime : 0.5;
		this.transitionDelay = options.transitionDelay ? options.transitionDelay : 1;
		this.startValue = options.startValue ? options.startValue : 100;
		this.endValue = options.endValue ? options.endValue : 0;
		this.autoPlay = options.autoPlay ? options.autoPlay : true;
		this.init();
	};
	SimpleSlider.prototype.init = function(){
		var i = this.containerElem.children.length-1;
		var bannerElem = null;
		this.imgs = [];
		while(i>=0){
			this.imgs[i] = bannerElem = this.containerElem.children[i];
			bannerElem.style[this.transitionProperty] = this.endValue;
			i--;
		}
		this.imgs[0].style[this.transitionProperty] = this.startValue;
		this.actualIndex = 0;
		if( this.autoPlay ){
			var scope = this;
			setInterval(function(){
				scope.changeSimpleSlider(scope.nextSimpleSliderIndex());
			}, this.transitionDelay*1000);
		}
	};
	SimpleSlider.prototype.anim = function(target, diffValue, targetValue){
		console.log('anim');
		var nextValue = this.transitionValue+(diffValue/60);
		this.transitionValue = nextValue;
		target.style[this.transitionProperty] = this.transitionValue/100;
		var isPositive = diffValue>0 && nextValue<targetValue;
		var isNegative = diffValue<=0 && nextValue>targetValue;
		if( isPositive || isNegative ){
			var scope = this;
			window.setTimeout(function(){
				scope.anim.apply(scope, [target, diffValue, targetValue]);
			}, (1000*scope.transitionTime)/60);
		} else {
			target.style[this.transitionProperty] = diffValue;
		}
	};
	SimpleSlider.prototype.startAnim = function(target, fromValue, targetValue){
		this.transitionValue = fromValue;
		var animEndValue = targetValue-this.transitionValue;
		this.anim(target, animEndValue, targetValue);
	};
	SimpleSlider.prototype.removeSimpleSlider = function(index){
		this.startAnim(this.imgs[index], this.startValue, this.endValue);
	};
	SimpleSlider.prototype.insertSimpleSlider = function(index){
		this.startAnim(this.imgs[index], this.endValue, this.startValue);
	};
	SimpleSlider.prototype.changeSimpleSlider = function(newIndex){
		this.removeSimpleSlider(this.actualIndex);
		this.insertSimpleSlider(newIndex);
		this.actualIndex = newIndex;
	};
	SimpleSlider.prototype.nextSimpleSliderIndex = function(){
		var newIndex = this.actualIndex+1;
		if( newIndex >= this.imgs.length ){
			newIndex = 0;
		}
		return newIndex;
	};
	window.SimpleSlider = SimpleSlider;
})();
