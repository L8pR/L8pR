import * as playerAction from '../actions';

SoundcloudDirective.$inject = ['$interval', '$q', '$http', '$ngRedux', 'progression'];
export default function SoundcloudDirective($interval, $q, $http, $ngRedux, progression) {
    return {
        scope: {
            soundcloudItem: '='
        },
        restrict: 'E',
        link: function(scope, element) {

            let disconnect = $ngRedux.connect(state => ({
                player: state.player,
            }), playerAction)(scope);

            scope.$on('$destroy', disconnect);
            var soundcloudPlayer;
            var progressionTracker;

            scope.playPause = function() {
                soundcloudPlayer.then(function(sound) {
                    if (sound.isPlaying()) {
                        pause();
                    } else {
                        play();
                    }
                });
            };

            function mute() {
                soundcloudPlayer.then(function(sound) {
                    sound.setVolume(0);
                });
            }

            function unmute() {
                soundcloudPlayer.then(function(sound) {
                    sound.setVolume(1);
                });
            }

            scope.toggleMute = function() {
                soundcloudPlayer.then(function(sound) {
                    if (sound.getVolume() === 1) {
                        mute();
                    } else {
                        unmute();
                    }
                });
            };

            function clear() {
                if (angular.isDefined(soundcloudPlayer) && soundcloudPlayer) {
                    soundcloudPlayer.then(function(sound) {
                        sound.pause();
                        soundcloudPlayer = null;
                    });
                }
                $interval.cancel(progressionTracker);
                progression.clear();
            }

            function pause() {
                scope.pause();
                soundcloudPlayer.then(function(sound) {
                    sound.pause();
                });
            }

            function play() {
                scope.play();
                soundcloudPlayer.then(function(sound) {
                    sound.play();
                });
            }

            scope.$watch('soundcloudItem', function(n , o) {
                clear();
                var soundDeferred = $q.defer();
                soundcloudPlayer = soundDeferred.promise;
                SC.initialize({client_id: '847e61a8117730d6b30098cfb715608c'});
                SC.resolve(scope.soundcloudItem.url).then(function(data) {
                    SC.stream(data.uri.replace('https://api.soundcloud.com', '')).then(function(player) {
                        play();
                        soundDeferred.resolve(player);
                        if (scope.player.mute) {
                            mute();
                        }
                        $interval.cancel(progressionTracker);
                        progression.bindProgression(function() {
                            if (player.streamInfo) {
                                return (player.currentTime() /  player.streamInfo.duration) * 100;
                            }
                            return 0;
                        });
                        progressionTracker = $interval(function() {
                            if (player.streamInfo) {
                                if (player.currentTime() >  player.streamInfo.duration - 5){
                                    scope.nextItem();
                                }
                            }
                        }, 250);
                    });
                });
            });
            scope.$on('player.seekTo', function(e, percent) {
                soundcloudPlayer.then(function(sound) {
                    sound.seek(Math.ceil((percent/100) * sound.streamInfo.duration));
                });
            });
            scope.$on('player.toggleMute', scope.toggleMute);
            scope.$on('player.playPause', scope.playPause);
            scope.$on('$destroy', function() {
                clear();
            });
        }
    };
}
