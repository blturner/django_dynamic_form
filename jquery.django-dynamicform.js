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
            var link_wrapper = '<tr><td colspan="2"></td></tr>';
            
            // A more complete form should already have the add and remove buttons
            // and should handle them server-side, but here I'm adding the link            
            obj.children(":last").find('tr:last').after(add_link);
            
            // This wraps the first link in the correct element(s). It can probably
            // be adapted to account for form.as_p and form.as_ul
            $('.' + options.add_link_class).wrap(link_wrapper);
            
            obj.click(function (e) {
                e.preventDefault();
                var target = $(e.target);
                                
                if (target.hasClass(options.add_link_class)) {
                    obj.trigger('addField');
                }
                if (target.hasClass(options.remove_link_class)) {
                    obj.trigger('removeField', [target]);
                }
            });
            
            obj.bind('addField.dynamicform', addField);
            obj.bind('removeField.dynamicform', removeField);
            
            obj.bind('addField.dynamicform', handleFieldUpdate);
            obj.bind('removeField.dynamicform', handleFieldUpdate);
            
            handleFieldUpdate();
            
            function addField(e) {
                // Add a new field
                debug('addField() was executed.');
                
                clone = obj.children('table:last').clone(true);
                clear_values(clone);
                obj.append(clone);
            }
            
            function removeField(e, target) {
                // Remove a field
                debug('removeField() was executed.');
                // debug(target);
                
                $(target).parents('table').remove();
                handleFieldUpdate();
            }
            
            function handleFieldUpdate(e) {
                // Handle what happens when a new field is created or removed.
                debug('handleFieldUpdate() was executed.');
                
                formClass = '.' + $(obj).find('table').attr("class");
                var forms = $(formClass).size();                
                
                // ***********************************************************
                // UPDATE FUNCTIONS FOR DJANGO HIDDEN FORM FIELDS
                // ***********************************************************
                
                // Increment the total form count.
                $("input[id*=TOTAL_FORMS]").attr("value", forms);
                
                $(formClass).each(function(i) {
                    // debug('Looping...' + i);
                    
                    var find = /(\-\d+\-)/;
                    var replace = '-' + i + '-';
                    
                    // Loop over the id and name fields and increment the id.
                    $("[id^='id_']").each(function() {
                        this.id = this.id.replace(find, replace);
                        this.name = this.name.replace(find, replace);
                    });
                    
                    // Loop over the label fields and adjust their ids.
                    $('.inline-form').find("[for^='id_']").each(function() {
                        var for_value = $(this).attr("for");
                        var new_value = for_value.replace(find, replace);
                        $(this).attr("for", new_value);
                        // debug(new_value);
                    });
                });
                // ***********************************************************
                
                
                if (forms == 1) {
                    $(formClass).find('tr:last > td').empty().append(add_link);
                }
                else {
                    $(formClass).find('tr:last > td').empty().append(remove_link);
                    $(formClass + ":last").find('.' + options.remove_link_class).before(add_link + ' ');
                }
            }
            
            // ************************************************************ //
            // THIS BIT COMES FROM XIAN                                     //
            // ************************************************************ //
            
            function clear_values (elem) {
                $("input, textarea", elem).each(function () {
                    this.value = "";
                    this.checked = false;
                    this.selected = "";
                    $(this).empty();
                });
                return elem;
            };
        });
    }
    
    
    function debug(obj) {
        if (window.console && window.console.log) {
            window.console.log(obj);
        };
    }
    
    // function listEvents(elem) {
    //     $(elem).listHandlers('*', function(e, d) {
    //         console.info(e, d);
    //     });
    }
})(jQuery);