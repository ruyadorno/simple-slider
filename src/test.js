describe('SimpleSlider', function() {

    var testDivCount = 0;

    var getNewDiv = function() {

        var newDiv = document.createElement('div');
        newDiv.id = 'test-div-' + testDivCount;
        testDivCount++;

        addChildrenDivs(newDiv);

        return newDiv;

    };

    var addChildrenDivs = function(newDiv) {

        var childrenNum = Math.ceil( Math.random()*10 );
        while (childrenNum >= 0) {
            newDiv.appendChild(document.createElement('div'));
            childrenNum--;
        }

    };

    var getNewSlider = function() {

        var testDiv = getNewDiv();
        var ss = new SimpleSlider(testDiv);

        return ss;

    };

    it('should create a new instance', function() {

        expect(typeof getNewSlider()).toEqual('object');

    });

    it('properties should be defined properly', function(){

        // Test default values
        var ss = getNewSlider();
        expect(ss.trProp).toEqual('opacity');
        expect(ss.trVal).toEqual(0);
        expect(ss.trTime).toEqual(0.5);
        expect(ss.delay).toEqual(1);
        expect(ss.startVal).toEqual(100);
        expect(ss.endVal).toEqual(0);
        expect(ss.autoPlay).toEqual(true);

    });

});
