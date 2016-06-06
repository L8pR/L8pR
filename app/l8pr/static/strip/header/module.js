(function() {
'use strict';

StripHeaderCtrl.$inject = ['login', 'Player', '$state', '$history', 'loop'];
function StripHeaderCtrl(login, Player, $state, $history, loop) {
    var vm = this;
    angular.extend(vm, {
        searchQuery: $state.params.q,
        searchBarVisible: $state.current.name === 'index.open.search' || ($state.params.q && $state.params.q !== ''),
        loopAuthor: loop.username,
        showsCount: loop.shows_list.length,
        loginService: login,
        openLoginView: login.openLoginView,
        exit: function() {
            vm.clear();
            vm.searchBarVisible = false;
            if ($state.current.name === 'index.open.search') {
                $history.back();
            }
        },
        clear: function() {
            vm.searchQuery = '';
        },
        search: function(query) {
            $state.go('index.open.search', {q: query});
        }
    });
}

angular.module('loopr.stripHeader', [])
.controller('StripHeaderCtrl', StripHeaderCtrl)
.directive('l8prStripHeader', [function() {
    return {
            scope: {},
            templateUrl: '/strip/header/template.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: StripHeaderCtrl
    };
}])
.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].focus();
                }
            });
        }
    };
});

})();
