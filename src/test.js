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

    var getNewSlider = function(options) {

        var testDiv = getNewDiv();
        var ss = new SimpleSlider(testDiv, options);

        return ss;

    };

    it('should be able to create a new instance', function() {

        expect(typeof getNewSlider()).toEqual('object');

    });

    it('should throw an error if using an empty html element', function() {

        expect(function(){new SimpleSlider(document.createElement('div'));}).toThrow(SimpleSlider.CONTAINER_ELEMENT_ERROR);

    });

    it('properties should be defined properly', function() {

        // Test default values
        var ss = getNewSlider();
        expect(ss.trProp).toEqual('opacity');
        expect(ss.trTime).toEqual(0.5);
        expect(ss.delay).toEqual(1);
        expect(ss.startVal).toEqual(100);
        expect(ss.endVal).toEqual(0);
        expect(ss.autoPlay).toEqual(true);

        // Test some custom values
        ss = getNewSlider({
            transitionProperty: 'left',
            transitionTime: 1,
            transitionDelay: 2,
            startValue: 300,
            endValue: 100,
            autoPlay:false
        });
        expect(ss.trProp).toEqual('left');
        expect(ss.trTime).toEqual(1);
        expect(ss.delay).toEqual(2);
        expect(ss.startVal).toEqual(300);
        expect(ss.endVal).toEqual(100);
        expect(ss.autoPlay).toEqual(false);

        // Partially defined values
        ss = getNewSlider({
            transitionProperty: 'top',
            startValue: -100,
            autoPlay:false
        });
        expect(ss.trProp).toEqual('top');
        expect(ss.startVal).toEqual(-100);
        expect(ss.autoPlay).toEqual(false);

    });

    it('after init should contain imgs data', function() {

        var newDiv = getNewDiv();
        var ss = new SimpleSlider(newDiv);
        var countChildren = newDiv.children.length-1;

        expect(ss.imgs.length).toEqual(newDiv.children.length);

        while (countChildren>=0) {
            expect(ss.imgs).toContain(newDiv.children[countChildren]);
            countChildren--;
        }

    });

});
