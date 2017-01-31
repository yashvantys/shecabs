var Entity = function() {
    return {
        load: function(className, clientId, entityType, competitor) {
            $('.' + className).select2('val', '');
            var url = SocialView.base_url + 'management/verification/' + clientId + '/entity-search/';
            $('.' + className)
                .select2({
                    placeholder: 'Search an Entity',
                    allowClear: true,
                    minimumInputLength: 2,
                    ajax: {
                        url: url,

                        dataType: 'json',
                        quietMillis: 300,
                        data: function(term) {
                        	var data =  {
                                term: term
                            };
                        	var dependentEntityId = $(this).attr("dependent-entity-id");
                        	if(dependentEntityId !== undefined) {
                        		
                        		data.dependentEntityId = $("#"+dependentEntityId).val();
                        	}
                        	var dependentEntityType = $(this).attr("dependent-entity-type");
                        	if(dependentEntityType !== undefined) {
                        		data.dependentEntityType = dependentEntityType;
                        	}
                            return data;
                        },
                        results: function(data) {
                            return {
                                results: $.map(data, function(item) {
                                    return {
                                        text: item.name + " (Id - " + item.id + ") (NPI - " + item.code + ") (Type - " + item.type + ")",
                                        id: item.id,
                                        type: item.type
                                    }
                                })
                            };
                        }
                    },

                    initSelection: function(element, callback) {
                        if ((typeof SocialView.Filter[entityType
                                .toLowerCase() + 'Data'] != 'undefined') && typeof SocialView.Filter[entityType
                                .toLowerCase() + 'Data'] != null) {
                            var data = jQuery
                                .parseJSON(SocialView.Filter[entityType
                                    .toLowerCase() + 'Data']);
                            return callback(data);
                        }
                        return '[]';
                    }
                });
        } ,
    loadClient : function(className, clientId, entityType, formatlevel){
        $('.' + className).select2('val', '');
        var url = SocialView.base_url + 'management/content/' + clientId +'/entityfind';
        $('.' + className)
            .select2({
                placeholder: 'Search an Entity',
                allowClear: true,
                minimumInputLength: 2,
                ajax: {
                    url: url,
                    dataType: 'json',
                    quietMillis: 300,
                    data: function(term) {
                    	var data =  {
                            term: term
                        };
                    	var dependentEntityType = $(this).attr("entity-type");
                    	var competitorFlag = $(this).attr("comp-type");
                    	if(competitorFlag !== undefined) {
                    	 	data.Competitor = competitorFlag;
                    	}
                    	if(dependentEntityType !== undefined) {
                    		data.EntityType = dependentEntityType;
                    	}
                        return data;
                    },
                    results: function(data) {
                        return {
                            results: $.map(data, function(item) {
                            	if(formatlevel==1){
                            		return {
                                        text: item.name + " (Id - " + item.id + ")",
                                        id: item.id,
                                        type: item.type
                                    }
                            	}
                                return {
                                    text: item.name + " (Id - " + item.id + ") (NPI - " + item.code + ") (Type - " + item.type + ")",
                                    id: item.id,
                                    type: item.type
                                }
                            })
                        };
                    }
                },

                initSelection: function(element, callback) {
                    if ((typeof SocialView.Filter[entityType
                            .toLowerCase() + 'Data'] != 'undefined') && typeof SocialView.Filter[entityType
                            .toLowerCase() + 'Data'] != null) {
                        var data = jQuery
                            .parseJSON(SocialView.Filter[entityType
                                .toLowerCase() + 'Data']);
                        return callback(data);
                    }
                    return '[]';
                }
            });
    }
    };
}();