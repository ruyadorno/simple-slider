(function(){
	'use strict';
	function getdef(val, def){
		return val ? val : def;
	}
	var SimpleSlider = function(containerElem, options){
		this.containerElem = containerElem;
		if( !options ) options = {};
		this.trProp = getdef(options.transitionProperty);
		this.trVal =  getdef(options.transitionValue);
		this.trTime = getdef(options.transitionTime);
		this.delay = getdef(options.transitionDelay);
		this.startVal = getdef(options.startValue);
		this.endVal = getdef(options.endValue);
		this.autoPlay = getdef(options.autoPlay);
		this.init();
	};
	SimpleSlider.prototype.init = function(){
		var i = this.containerElem.children.length-1;
		var bannerElem = null;
		this.imgs = [];
		while(i>=0){
			this.imgs[i] = bannerElem = this.containerElem.children[i];
			bannerElem.style[this.trProp] = this.endVal;
			i--;
		}
		this.imgs[0].style[this.trProp] = this.startVal;
		this.actualIndex = 0;
		if( this.autoPlay ){
			var scope = this;
			setInterval(function(){
				scope.change(scope.nextIndex());
			}, this.delay*1000);
		}
	};
	SimpleSlider.prototype.anim = function(target, diffValue, targetValue){
		var nextValue = this.trVal+(diffValue/60);
		this.trVal = nextValue;
		target.style[this.trProp] = this.trVal/100;
		var isPositive = diffValue>0 && nextValue<targetValue;
		var isNegative = diffValue<=0 && nextValue>targetValue;
		if( isPositive || isNegative ){
			var scope = this;
			window.setTimeout(function(){
				scope.anim.apply(scope, [target, diffValue, targetValue]);
			}, ( 1000 * scope.trTime ) / 60 );
		} else {
			target.style[this.trProp] = diffValue;
		}
	};
	SimpleSlider.prototype.startAnim = function(target, fromValue, targetValue){
		this.trVal = fromValue;
		var animEndValue = targetValue-this.trVal;
		this.anim(target, animEndValue, targetValue);
	};
	SimpleSlider.prototype.remove = function(index){
		this.startAnim(this.imgs[index], this.startVal, this.endVal);
	};
	SimpleSlider.prototype.insert = function(index){
		this.startAnim(this.imgs[index], this.endVal, this.startVal);
	};
	SimpleSlider.prototype.change = function(newIndex){
		this.remove(this.actualIndex);
		this.insert(newIndex);
		this.actualIndex = newIndex;
	};
	SimpleSlider.prototype.nextIndex = function(){
		var newIndex = this.actualIndex+1;
		if( newIndex >= this.imgs.length ){
			newIndex = 0;
		}
		return newIndex;
	};
	window.SimpleSlider = SimpleSlider;
})();
