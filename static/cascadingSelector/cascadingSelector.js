!function($) {
    "use strict";
    var cascadingSelector = function(element, options) {
        this.init("cascadingSelector", element, options);
    };
    cascadingSelector.prototype = {
        constructor: cascadingSelector,
        init: function(type, element, options) {
            function rappend(e, ps) {
                append(e, ps.shift(), ps[0] ? function(o) {
                    $(o).val(ps[0]), ps.length > 1 ? rappend(e, ps) : "function" == typeof $options.after && $options.after(o);
                } : "");
            }
            function append(e, p, c) {
                $.ajax({
                    url: $options.getChildrenUrl + (p && !isNaN(p) && p || 0),
                    type: $options.requestMethod,
                    dataType: "json",
                    success: function(res) {
                        var html;
                        if (res && res.length > 0) {
                            html = '<select class="' + $options.className + '" onchange="' + $options.onChange + '"><option value="">' + $options.initialText + "</option>";
                            for (var i in res) html += '<option value="' + res[i].value + '">' + res[i].label + "</option>";
                            html += "</select>";
                            var o = $(html);
                            o.appendTo(e), (-1 == $options.depth || --$options.depth > 0) && o.bind("change", function() {
                                var index = $(this).parent().children("select").index($(this));
                                $(this).parent().children("select:gt(" + index + ")").remove(), "" != $(this).val() && append(e, $(this).val());
                            }), "function" == typeof c && c(o);
                        }
                    }
                });
            }
            this.type = type, this.$element = $(element), this.options = this.getOptions(options), 
            "function" == typeof options.before && this.options.before();
            var $options = this.options;
            this.$element.each(function() {
                var $this = $(this);
                Number($options.value) > 0 ? $.ajax({
                    url: $options.getParentsUrl + $options.value,
                    type: $options.requestMethod,
                    dataType: "text",
                    success: function(res) {
                        if (res) {
                            var vals = (res + (res ? "," : "") + $options.value).split(",");
                            vals.splice(0, $.inArray("" + $options.root, vals)), rappend($this, vals);
                        }
                    }
                }) : append($(this), $options.root, options.after);
            });
        },
        getOptions: function(options) {
            return $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
        }
    }, $.fn.cascadingSelector = function(option) {
        switch (option) {
          case "getValue":
            for (var reVal = "", $this = this.children("select"), i = $this.length - 1; i >= 0; i--) {
                var val = $($this[i]).val();
                if ("" != val && "0" != val) {
                    reVal = val;
                    break;
                }
            }
            return reVal;
        }
        return this.each(function() {
            var $this = $(this), data = $this.data("cascadingSelector"), options = "object" == typeof option && option;
            data || $this.data("cascadingSelector", data = new cascadingSelector(this, options)), 
            "string" == typeof option && data[option]();
        });
    }, $.fn.cascadingSelector.Constructor = cascadingSelector, $.fn.cascadingSelector.defaults = {
        className: "",
        value: "",
        root: 0,
        depth: -1,
        onlyText: false,
        initialText: "Please select",
        getChildrenUrl: "data.php?action=getChildren&parent=",
        getParentsUrl: "data.php?action=getParents&child=",
        requestMethod: "get",
        onChange: "",
        before: "",
        after: ""
    };
}(jQuery);
