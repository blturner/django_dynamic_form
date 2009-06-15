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
            
            function addField(e) {
                // Add a new field
                clone = obj.children('table:last').clone(true);
                clear_values(clone);
                clear_select_values(clone);
                $(clone).find('.errorlist').remove();
                obj.append(clone);
                handleFieldUpdate();
            }
            
            function removeField(e, target) {
                $(target).parents('table').remove();
                handleFieldUpdate();
            }
            
            function handleFieldUpdate(e) {
                // Handle what happens when a new field is created or removed.
                formClass = '.' + $(obj).find('table').attr("class");
                var forms = $(formClass).size();
                
                var fields = obj.children(formClass);
                var last = obj.children(formClass + ":last");
                
                fields.find('.form-controls').remove();
                fields.find('tr:last').after('<tr class="form-controls"><td colspan="2"></td></tr>');
                
                if (fields.size() != 1) {
                    fields.find('.form-controls td').append(remove_link + ' ');
                }
                last.find('.form-controls td').append(add_link);                
                
                // ***********************************************************
                // UPDATE FUNCTIONS FOR DJANGO HIDDEN FORM FIELDS
                
                $(obj).find("input[id*=TOTAL_FORMS]").attr("value", forms);
                
                obj.find(formClass).each(function(i) {
                    debug('Looping...' + i);                    
                    var find = /(\-\d+\-)/;
                    var replace = '-' + i + '-';
                    
                    $(this).find("[id^='id_']").each(function(i) {
                        this.id = this.id.replace(find, replace);
                        this.name = this.name.replace(find, replace);
                        debug('Updating... ' + this);
                    });
                    
                    $(this).find("[for^='id_']").each(function() {
                        var for_value = $(this).attr("for");
                        var new_value = for_value.replace(find, replace);
                        $(this).attr("for", new_value);
                        debug('Updating... ' + this);
                    });
                });
            }
            
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
        });
    }
    
    function debug(obj) {
        if (window.console && window.console.log) {
            window.console.log(obj);
        };
    }
})(jQuery);