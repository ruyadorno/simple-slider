
// mdoc default template
// author: Miller Medeiros
// license: MIT
// version : 0.1.0 (2011/11/27)

(function ($) {


    var _curPath = document.location.pathname.split('/'),
        _curFile = _curPath[_curPath.length - 1];


    var sidebar = (function () {

        var $_sidebar,
            $_search,
            $_toc,
            $_tocList,
            $_tocItems;


        function init() {
            $_sidebar = $('<div id="sidebar" />').prependTo('#wrapper');
            $_sidebar.load('sidebar_.html', onTocLoad);
        }

        function onTocLoad(data) {
            $_search = $('#search');
            $_toc = $_sidebar.find('.toc');
            $_tocList = $_toc.find('.toc-list');
            $_tocItems = $_tocList.find('.toc-item');

            $_tocList.slideUp(0);
            $_sidebar.on('click', 'h3', toggleNavOnClick);
            $('#show-desc').on('change', toggleDescription);
            toggleDescription();
            $_search.on('keyup blur', filterOnSearch);

            $_sidebar.find('.toc-mod-title:has(a[href*="'+ _curFile +'"])').click();
        }

        function toggleNavOnClick(evt) {
            var $el = $(this);
            $el.toggleClass('opened');
            $el.next('.toc-list').stop(true, true).slideToggle(300);
        }

        function toggleDescription() {
            $_toc.find('.desc').toggleClass('hidden');
        }

        function filterOnSearch(evt) {
            var term = $_search.val(),
                rTerm;

            $_tocItems.toggleClass('hidden', !!term);
            $_toc
                .find('.toc-mod-title')
                .toggleClass('hidden', !!term)
                .removeClass('opened');

            if(term){
                rTerm = new RegExp(term, 'gi'); //case insensitive
                $_toc.find('.toc-mod-title').addClass('hidden');

                $_tocList.stop(true).slideDown(0);

                $_tocItems
                    .filter(function(){
                        return rTerm.test( $(this).text() );
                    })
                    .removeClass('hidden');

            } else {
                $_tocList.stop(true).slideUp(0);
            }

        }

        return {
            init : init
        };

    }());


    // ---

    var syntax = {

        init : function(){

            SyntaxHighlighter.defaults['auto-links'] = false;

            SyntaxHighlighter.autoloader(
              'applescript            assets_/js/lib/syntax-highlighter/shBrushAppleScript.js',
              'actionscript3 as3      assets_/js/lib/syntax-highlighter/shBrushAS3.js',
              'bash shell             assets_/js/lib/syntax-highlighter/shBrushBash.js',
              'coldfusion cf          assets_/js/lib/syntax-highlighter/shBrushColdFusion.js',
              'cpp c                  assets_/js/lib/syntax-highlighter/shBrushCpp.js',
              'c# c-sharp csharp      assets_/js/lib/syntax-highlighter/shBrushCSharp.js',
              'css                    assets_/js/lib/syntax-highlighter/shBrushCss.js',
              'delphi pascal          assets_/js/lib/syntax-highlighter/shBrushDelphi.js',
              'diff patch pas         assets_/js/lib/syntax-highlighter/shBrushDiff.js',
              'erl erlang             assets_/js/lib/syntax-highlighter/shBrushErlang.js',
              'groovy                 assets_/js/lib/syntax-highlighter/shBrushGroovy.js',
              'java                   assets_/js/lib/syntax-highlighter/shBrushJava.js',
              'jfx javafx             assets_/js/lib/syntax-highlighter/shBrushJavaFX.js',
              'js jscript javascript  assets_/js/lib/syntax-highlighter/shBrushJScript.js',
              'perl pl                assets_/js/lib/syntax-highlighter/shBrushPerl.js',
              'php                    assets_/js/lib/syntax-highlighter/shBrushPhp.js',
              'text plain             assets_/js/lib/syntax-highlighter/shBrushPlain.js',
              'py python              assets_/js/lib/syntax-highlighter/shBrushPython.js',
              'ruby rails ror rb      assets_/js/lib/syntax-highlighter/shBrushRuby.js',
              'sass scss              assets_/js/lib/syntax-highlighter/shBrushSass.js',
              'scala                  assets_/js/lib/syntax-highlighter/shBrushScala.js',
              'sql                    assets_/js/lib/syntax-highlighter/shBrushSql.js',
              'vb vbnet               assets_/js/lib/syntax-highlighter/shBrushVb.js',
              'xml xhtml xslt html    assets_/js/lib/syntax-highlighter/shBrushXml.js'
            );

            SyntaxHighlighter.all();

        }

    };


    // ----


    function init(){
        sidebar.init();
        syntax.init();
    }

    $(document).ready(init);

}(jQuery));
