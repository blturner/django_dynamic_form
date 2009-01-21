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
            
            /*
                When the form encounters an error, this line seems to be
                inserting the first add link on top of the last input elment
                in the first form field.
            */
            // obj.children("table:first").find('tr:last').css("background", "red");
            // debug(obj.children("table:first"));
            obj.children("table").find('tr:last').after(add_link);
            
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
            
            handleFieldUpdate();
            
            obj.bind('addField.dynamicform', handleFieldUpdate);
            // obj.bind('removeField.dynamicform', handleFieldUpdate);
            
            function addField(e) {
                // Add a new field
                debug('addField() was executed.');
                
                clone = obj.children('table:last').clone(true);
                clear_values(clone);
                clear_select_values(clone);
                $(clone).find('.errorlist').remove();
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
                // debug('forms = ' + forms);
                
                // UPDATE THE TOTAL_FORMS FIELD.
                $("input[id*=TOTAL_FORMS]").attr("value", forms);
                // debug($("input[id*=TOTAL_FORMS]").attr("value"));
                
                
                // ***********************************************************
                // UPDATE FUNCTIONS FOR DJANGO HIDDEN FORM FIELDS
                // ***********************************************************
                
                $(formClass).each(function(i) {
                    debug('Looping...' + i);
                    debug(this);
                    
                    var find = /(\-\d+\-)/;
                    var replace = '-' + i + '-';
                    debug('var replace = ' + replace);
                    
                    $(this).find("[id^='id_']").each(function(i) {
                        this.id = this.id.replace(find, replace);
                        this.name = this.name.replace(find, replace);
                        debug('Updating... ' + this);
                    });
                    
                    // $(this).find("[for^='id_']").each(function() {
                    //     debug(this);
                    // });
                    
                    $(this).find("[for^='id_']").each(function() {
                        var for_value = $(this).attr("for");
                        var new_value = for_value.replace(find, replace);
                        $(this).attr("for", new_value);
                        debug('Updating... ' + this);
                    });
                });
                // ***********************************************************
                
                
                if (forms == 1) {
                    $(formClass).find('tr:last > td').empty().append(add_link);
                }
                else {
                    $(formClass).find("tr:last td").empty().append(remove_link);
                    $(formClass + ":last").find('.' + options.remove_link_class).before(add_link + ' ');
                }
            }
            
            // ************************************************************ //
            // THESE BITS COME FROM XIAN                                    //
            // ************************************************************ //
            
            function clear_values (elem) {
                debug('clear_values() was executed.');
                $("input, textarea", elem).each(function () {
                    this.value = "";
                    this.checked = false;
                    this.selected = "";
                    $(this).empty();
                });
                return elem;
            };
            
            function clear_select_values (elem) {
                debug('clear_select_values() was executed.');
                $("select", elem).each(function () {
                    debug(this);
                    $(this).find('option:first').attr("selected", "selected");
                });
                return elem;
            }
            
            function update_names_and_ids (elem, count_field) {
                var find = '-' + (Number(count_field.attr('value')) - 1) + '-'
                var replace = '-' + count_field.attr('value') + '-'
                $("[id^='id_']", elem).each( function () {
                    this.id  = this.id.replace(find, replace);
                    this.name = this.name.replace(find, replace);
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
    
    function listEvents(elem) {
        $(elem).listHandlers('*', function(e, d) {
            console.info(e, d);
        });
    }
})(jQuery);