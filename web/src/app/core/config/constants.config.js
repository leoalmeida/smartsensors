(function(angular) {
    'use strict';

    var MENU = [
        { layout: true, separator: true },
        { name: "Home", options: { icon: "assets/icons/action/ic_dashboard_24px.svg", face : "assets/icons/action/ic_dashboard_24px.svg",  link : '/',  avatarIcon: true }},
        { name: "Mapa", options: { icon: "assets/icons/maps/ic_map_24px.svg", face : "assets/icons/maps/ic_map_24px.svg",  link : '/map',  avatarIcon: true }},
        { name: "Grupos", options: { icon: "assets/icons/action/ic_speaker_notes_24px.svg", face : "assets/icons/action/ic_speaker_notes_24px.svg", link : '/groups', avatarIcon: true}},
        { name: "Amigos", options: {icon: "assets/icons/action/ic_supervisor_account_24px.svg", face : "assets/icons/action/ic_supervisor_account_24px.svg", link : '/friends', avatarIcon: true }},
        { layout: true, separator: true },
        { layout: true, header: true , title: "Admin"},
        { name: "Sensores", options: { icon: "assets/icons/action/ic_settings_input_antenna_24px.svg", face : "assets/icons/ic_settings_input_antenna_24px.svg",  link : '/sensors',  avatarIcon: true }},
        { name: "Alertas", options: { icon: "assets/icons/action/ic_settings_remote_24px.svg", face : "assets/icons/action/ic_settings_remote_24px.svg", link : '/alerts', avatarIcon: true}},
        { name: "Assinantes", options: {icon: "assets/icons/action/ic_supervisor_account_24px.svg", face : "assets/icons/action/ic_supervisor_account_24px.svg", link : '/subscribers', avatarIcon: true }},
        { name: "Configurações", options: { icon: "assets/icons/action/ic_build_24px.svg", face : "assets/icons/action/ic_build_24px.svg", link : '/admin', avatarIcon: true }},
        { layout: true, separator: true },
        { name: "LogOut", options: { icon: "assets/icons/action/ic_power_settings_new_24px.svg" }, link : '/logout'}
    ];

    var PROTECTED_PATHS = ['/friends', '/home', '/alerts'];

    var MOODLIST = [
        {name: 'verysatisfied', link: "assets/icons/social/ic_sentiment_very_satisfied_24px.svg"},
        {name: 'satisfied', link: "assets/icons/social/ic_mood_24px.svg"},
        {name: 'neutral', link: "assets/icons/social/ic_sentiment_neutral_24px.svg"},
        {name: 'dissatisfied', link: "assets/icons/social/ic_sentiment_dissatisfied_24px.svg"},
        {name: 'verydissatisfied', link: "assets/icons/social/ic_sentiment_very_dissatisfied_24px.svg"}
    ];

    var MAPSCONFIG = {
        key: 'AIzaSyCCO7zMiZZTav3eDQlD6JnVoEcEVXkodns',
        v: '3.26.1', //defaults to latest 3.X anyhow
        libraries: 'placeses,visualization,drawing,geometry,places'
    }

    var SCREENCONFIG = {
        ALERTS: {
            LIST: {
                TITLE: "Lista de Alertas",
                ICONNEW: "content/ic_add_24px.svg",
                SUBSCRIBERS: "action/ic_visibility_24px.svg",
                CONNECTED: {
                    TITLE: "Alertas Conectados"
                },
                DISCONNECTED: {
                    TITLE: "Alertas Desconectados"
                },
                ACTIVE:{
                    TITLE: "Alerta Ativo",
                    COLOR: "blue"
                },
                NOTACTIVE:{
                    TITLE: "Sem Alerta",
                    COLOR: "red"
                }
            }
        },
        SENSORS: {
            LIST: {
                TITLE: "Lista de Sensores",
                ICONNEW: "content/ic_add_24px.svg",
                CONNECTED: {
                    TITLE: "Sensores Conectados"
                },
                DISCONNECTED: {
                    TITLE: "Sensores Desconectados"
                }
            }
        },
        GROUPS: {
            LIST: {
                TITLE: "Groupos",
                ICONNEW: "content/ic_add_24px.svg",
                SUBSCRIBED: {
                    TITLE: "Assinaturas"
                },
                ALERTS: {
                    TITLE: "Alertas Não Assinados"
                },
                GROUPS: {
                    TITLE: "Grupos Não Assinados"
                }
            }
        }
    }

    angular
        .module('app.core')
        .constant('CONSTANTS', {
            MENU: MENU,
            PROTECTED_PATHS: PROTECTED_PATHS,
            MOODLIST: MOODLIST,
            MAPSCONFIG: MAPSCONFIG,
            SCREENCONFIG: SCREENCONFIG
        });

})(angular);
