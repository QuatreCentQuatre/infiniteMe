$(document).ready(function() {
    var $scope      = $('#infinite');
    var infinite    = new Me.infinite($scope, {
        debug: true,
        infinite_offset: -5,
        infinite_loader: $scope.find('.loader'),
        item_per_page: 4,
        page_total: 10,
        toggler_button: $scope.find('.toggler'),
        toggler_page_offset: -1,
        event_onload: function(scope) {
            for (var i = 0; i < scope.options.item_per_page; i++) {
                scope.$el.find('.item-list').append($('#item-t').html());
            }
            Me.dispatch.emit('InfiniteMe.onload');
        }
    });
});