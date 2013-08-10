describe('SimpleSlider', function() {

	var testDiv;

	it('should create a new instance', function(){
		testDiv = document.getElementById('test-div');
		expect(typeof new SimpleSlider(testDiv)).toEqual('object');
	});

});
