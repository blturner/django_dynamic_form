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
            var add_link = '<a class="' + options.add_link_class + '" href="#">Add</a>';
            var remove_link = '<a class="' + options.remove_link_class + '" href="#">Remove</a>';
            
            // A more complete form should already have the add and remove buttons
            // and should handle them server-side, but here I'm adding the link            
            obj.children(":last").append(add_link);
            
            // This wraps the first link in the correct element(s). It can probably
            // be adapted to account for form.as_p and form.as_ul
            $('.' + options.add_link_class).wrap('<tr><td colspan="2"></td></tr>');
            
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
            
            // obj.bind('add_field.dynamicform', fields_changed);
            
            function add_field(e) {
                debug('add_field(): add_field() was called by ' + $(e.target).attr("class"));
                // var target = $(e.target);                
                var clone = $(obj).clone(true);
                
                clone.find('.' + options.add_link_class).after(' ' + remove_link);
                
                obj.after(clone);
                
                $(obj.get_class()).bind('remove_field.dynamicform', fields_changed);                
            }
            
            function remove_field(e) {
                debug('remove_field(): remove_field() was called by ' + $(e.target).attr("class"));
                
                var target = $(e.target);
                
                target.parents().filter(obj.get_class()).prev().css("background", "green");
                
                debug(target.parents().filter(obj.get_class()).prev().find('.' + options.add_link_class).attr("class"));
                
                var parent = target.parents().filter(obj.get_class());
                parent.next().css("background", "red");
                
                debug(parent.prev());
                debug(parent.next());
                debug(obj.count());
                
                if ((parent.prev() || parent.next() != 'table')) {
                    debug('Check it.');
                }
                
                if (parent.prev().find('.' + options.add_link_class).attr("class")) {
                    debug('Found the add-link class');
                } else {
                    if ((parent.next()) != ($('table'))) {
                        target.parents().filter(obj.get_class()).prev().find('.' + options.remove_link_class).before(add_link + ' ');
                    }
                }
                
                // if (!($(this).prev().is(':first'))) {
                //     $(this).prev().find('.' + options.remove_link_class).before(add_link + ' ');
                // }
                
                $(this).remove();
                
                // $(obj.get_class()).bind('remove_field.dynamicform', fields_changed);
            }
            
            function fields_changed(e) {
                debug('fields_changed(): fields_changed() was called by ' + $(e.target).attr("class"));
                debug('fields_changed(): There are ' + obj.count() + ' objects of class ' + obj.get_class() + ' in the DOM.');
                
                var target = $(e.target);
                var prev_elem = $(e.currentTarget);
                
                // prev_elem.css("background", "red");
                
                debug('fields_changed(): target is ' + $(e.target.nodeName));
                debug('fields_changed(): currentTarget is ' + $(e.currentTarget));
                
                if (target.hasClass(options.add_link_class)) {
                    debug('fields_changed(): add_field() was called');
                    
                    if (prev_elem.prev().hasClass(obj.get_class())) {
                        debug('fields_changed(): this is not the first object');
                        $(obj.get_class()).prev().find('.' + options.add_link_class + ":last").remove();
                    } else {
                        debug('fields_changed(): this is the first object');
                        prev_elem.find('.' + options.add_link_class).replaceWith(remove_link);
                        $(obj.get_class()).find('.' + options.add_link_class + ":last").after(' ' + remove_link);
                    }
                }
                if (target.hasClass(options.remove_link_class)) {
                    debug('fields_changed(): remove_field() was called');
                    debug('fields_changed(): objects=' + obj.count());
                    debug($(obj.get_class() + ':last').find('.' + options.remove_link_class).attr("class"));
                    
                    $(e.target).css("background", "green");
                    $(e.currentTarget).css("background", "purple");

                    if (obj.count() == 1) {
                        // debug('fields_changed(): ')
                        obj.find('.' + options.remove_link_class).replaceWith(add_link);
                        // obj.bind('add_field.dynamicform', add_field);
                    }
                    else {
                        // Check that an add link does not already exist.
                        // var passed_class = $(obj.get_class() + ':last').find('.' + options.add_link_class));
                        
                        debug($(obj.get_class() + ':last').find('.' + options.add_link_class).eq(0).attr("class"));
                        
                        if (($(e.currentTarget).prev().find('.' + options.add_link_class).eq(0).attr("class")) != ('.' + options.add_link_class)) {
                            // debug('fields_changed(): add link before remove link');
                            // $(e.currentTarget).prev().find('.' + options.remove_link_class).before(add_link + ' ');
                            // $(obj.get_class() + ':last').find('.' + options.remove_link_class).before(add_link + ' ');
                        }
                    }
                }
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
            
            // listEvents(obj);
            // debug($.event.global);
        });
    }
    
    function debug(obj) {
        if (window.console && window.console.log) {
            window.console.log(obj);
        };
    }
    
    function listEvents(elem) {
        $(elem).listHandlers('*', function(e, d) {
            console.info(e, d);
        });
    }
})(jQuery);