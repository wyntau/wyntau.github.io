
/**
 * author: PIZn
 * version: 1.0
 * site: http://www.pizn.net
 */
$(document).ready(function() {
    //为什么我会写这个呢？
    var iLotus = {
        Version: "1.0",
        Author: "PIZn"
    };
    /**
     *  goTop
     */
    iLotus.goTop = {
        nodeName: "J-backTop",
        scrollHeight: "100",
        linkBottom: "60px",
        linkRight: 30,
        linkWidth: 32,
        contentWidth: 720,
        contenBigtWidth: 1024,
        _scrollTop: function() {
            if(jQuery.scrollTo) {
                jQuery.scrollTo(0, 800, {queue:true});
            }
        },
        _scrollScreen: function() {
            var that = this, topLink = $('#' + that.nodeName);
            if(jQuery(document).scrollTop() <= that.scrollHeight) {
                topLink.hide();
                return true;
            }  else {
                topLink.fadeIn();
            }
        },
        _resizeWindow: function(right) {
            var that = this, topLink = $('#' + that.nodeName);
            topLink.css({
                'right' : right + 'px',
                'bottom': that.linkBottom
            });
        },
        _changeRight: function() {
            var that = this, right;
            if(jQuery(window).width() > 1440) {
                right = parseInt((jQuery(window).width() - that.contenBigtWidth + 1)/2 - that.linkWidth - that.linkRight, 10);
            } else {

                right = parseInt((jQuery(window).width() - that.contentWidth + 1)/2 - that.linkWidth - that.linkRight, 10);
            }
            if( right < 20 ) {
                right = 20;
            }
            return right;
        },
        run: function() {
            var that = this, topLink = $('<a id="' + that.nodeName + '" href="#" class="lotus-backtop"><i class="fa fa-arrow-circle-up"></i></a>');
            topLink.appendTo($('body'));
            topLink.css({
                'display': 'none',
                'position': 'fixed',
                'right': that._changeRight() + 'px',
                'bottom': that.linkBottom
            });
            if(jQuery.scrollTo) {
                topLink.click(function() {
                    that._scrollTop();
                    return false;
                });
            }
            jQuery(window).resize(function() {
                that._resizeWindow(that._changeRight());
            });
            jQuery(window).scroll(function() {
                that._scrollScreen();

            });

        }
    }
    /**
     * iLotus.changeTheme
     */
    iLotus.changeTheme = {
        A: function() {
            if(this.check() == "A") {
                $("#J-html").addClass("iLight");
                jQuery.cookie('iTheme', 'B', { expires: 7, path: '/' });
            } else {
                $("#J-html").removeClass("iLight");
                jQuery.cookie('iTheme', 'A', { expires: 7, path: '/' });
            }
        },
        B: function() {
            if(this.check() == "B") {
                $("#J-html").addClass("iLight");
            } else {
                $("#J-html").removeClass("iLight");
            }
        },
        check: function() {
            var iThemeCookie = jQuery.cookie("iTheme");
            if(iThemeCookie != null) {
                return iThemeCookie;
            } else {
                jQuery.cookie('iTheme', 'A', { expires: 7, path: '/' });
                return "A";
            }
        },
        init: function() {
            var that = this;
            $("#J-changeTheme").toggle(function(e) {
                that.A();
            }, function(e) {
                that.A();
            });
            this.B();
        }
    }
    /**
     * iLotus JS init
     */
    iLotus.init = {
        run: function() {
            iLotus.goTop.run();
            iLotus.changeTheme.init();
        }
    };
    //run
    iLotus.init.run();
});
