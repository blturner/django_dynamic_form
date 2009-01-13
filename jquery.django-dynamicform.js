(function($) {
    $.fn.dynamicform = function(options) {
        var defaults = {
            debug: true,
            add_link_class: 'add-field',
            remove_link_class: 'remove-field',
            container_element: 'table'
        }
        var options = $.extend(defaults, options);
        
        return this.each(function() {
            var obj = $(this);
            // var obj_wrapper = obj.wrap('<div id="formset-wrapper"></div>');
            var add_link = '<tr><td colspan="2"><a class="' + options.add_link_class + '" href="#">Add</a></td></tr>';
            var remove_link = '<a class="' + options.remove_link_class + '" href="#">Remove</a>';
            
            // A more complete form should already have the add and remove buttons
            // and should handle them server-side, but here I'm adding the link
            obj.children(":last").append(add_link);
            
            obj.click(function (e) {
                e.preventDefault();
                var target = $(e.target);
                                
                if (target.hasClass(options.add_link_class)) {
                    target.trigger('add_field');
                }
                if (target.hasClass(options.remove_link_class)) {
                    target.trigger('remove_field');
                }
            });
            
            obj.bind('add_field.dynamicform', add_field);
            obj.bind('remove_field.dynamicform', remove_field);
            
            obj.bind('add_field.dynamicform', fields_changed);
            obj.bind('remove_field.dynamicform', fields_changed); // this isn't firing
            
            function add_field(e) {
                var target = $(e.target);
                debug('add_field() was called by ' + $(e.target).attr("class"));
                var clone = obj.clone(true);
                $(clone).find('.' + options.add_link_class).after(' ' + remove_link);
                obj.after(clone);
                
                // debug($(clone).find('.' + options.add_link_class));
                
                // obj.bind('add_field.dynamicform', add_field);
                // obj.bind('remove_field.dynamicform', remove_field);
                
                // debug('There are ' + obj.count() + ' objects of class ' + obj.get_class() + ' in the DOM.');
                // return;
            }
            
            function remove_field(e) {
                var target = $(e.target);
                $(this).remove();
                debug('remove_field() was called by ' + $(e.target).attr("class"));
            }
            
            function fields_changed(e) {
                debug('fields_changed() was called by ' + $(e.target).attr("class"));
                // debug('There are ' + obj.count() + ' objects of class ' + obj.get_class() + ' in the DOM.');
                // if (obj.count() == 2) {
                //     $(this).find('.' + options.remove_link_class).replaceWith(add_link);
                // }
                // if (!($(this).prev().hasClass($(this).attr("class")))) {
                //     $(this).find('.' + options.add_link_class).replaceWith(remove_link);
                // }
            }
            
            // Helper methods for dealing with the object
            obj.get_class = get_class;
            function get_class() {
                var class_name = "." + $(this).attr("class");
                return class_name;
            }
            
            // Return the number of current obj class elements
            obj.count = count;
            function count() {
                var count = $(obj.get_class()).length;
                return count;
            }
        });
    }
    
    function debug(obj) {
        if (window.console && window.console.log) {
            window.console.log(obj);
        };
    }
})(jQuery);