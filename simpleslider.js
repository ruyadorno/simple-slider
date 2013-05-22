(function(){
	'use strict';
	var Banner = function(containerElem, autoPlay, prop, initValue, endValue){
		this.containerElem = containerElem;
		this.transitionProperty = 'opacity';
		this.transitionValue = 0;
		this.transitionTime = 0.5;
		this.initValue = 100;
		this.endValue = 0;
		if( prop ){
			this.transitionProperty = prop;
		}
		if( initValue ){
			this.initValue = initValue;
		}
		if( endValue ){
			this.endValue = endValue;
		}
		if( autoPlay ){
			this.autoPlay = autoPlay;
		}
		this.init();
	};
	Banner.prototype.init = function(){
		var i = this.containerElem.children.length-1;
		var bannerElem = null;
		this.imgs = [];
		while(i>=0){
			this.imgs[i] = bannerElem = this.containerElem.children[i];
			bannerElem.style[this.transitionProperty] = this.endValue;
			i--;
		}
		this.imgs[0].style[this.transitionProperty] = this.initValue;
		this.actualIndex = 0;
		if( this.autoPlay ){
			var scope = this;
			setInterval(function(){
				scope.changeBanner(scope.nextBannerIndex());
			}, 5000);
		}
	};
	Banner.prototype.anim = function(target, diffValue, targetValue){
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
	Banner.prototype.startAnim = function(target, fromValue, targetValue){
		this.transitionValue = fromValue;
		var animEndValue = targetValue-this.transitionValue;
		this.anim(target, animEndValue, targetValue);
	};
	Banner.prototype.removeBanner = function(index){
		this.startAnim(this.imgs[index], this.initValue, this.endValue);
	};
	Banner.prototype.insertBanner = function(index){
		this.startAnim(this.imgs[index], this.endValue, this.initValue);
	};
	Banner.prototype.changeBanner = function(newIndex){
		this.removeBanner(this.actualIndex);
		this.insertBanner(newIndex);
		this.actualIndex = newIndex;
	};
	Banner.prototype.nextBannerIndex = function(){
		var newIndex = this.actualIndex+1;
		if( newIndex >= this.imgs.length ){
			newIndex = 0;
		}
		return newIndex;
	};
	window.Banner = Banner;
})();
