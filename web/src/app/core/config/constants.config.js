(function(angular) {
    'use strict';

    var MENU = [
        { layout: true, separator: true },
        { name: "Home", options: { icon: "assets/icons/action/ic_dashboard_24px.svg", face : "assets/icons/action/ic_dashboard_24px.svg",  link : '/',  avatarIcon: true, available: true }},
        { name: "Mapa", options: { icon: "assets/icons/maps/ic_map_24px.svg", face : "assets/icons/maps/ic_map_24px.svg",  link : '/map',  avatarIcon: true, available: true }},
        { name: "Receitas", options: { icon: "assets/icons/action/ic_speaker_notes_24px.svg", face : "assets/icons/action/ic_speaker_notes_24px.svg", link : '/recipes', avatarIcon: true, available: true}},
        { name: "Assinaturas", options: { icon: "assets/icons/action/ic_supervisor_account_24px.svg", face : "assets/icons/action/ic_supervisor_account_24px.svg", link : '/subscriptions', avatarIcon: true, available: true }},
        { layout: true, separator: true },
        { layout: true, header: true , title: "Admin"},
        { name: "Sensores", options: { icon: "assets/icons/action/ic_settings_input_antenna_24px.svg", face : "assets/icons/ic_settings_input_antenna_24px.svg",  link : '/sensors',  avatarIcon: true, available: true}},
        { name: "Alertas", options: { available: false, icon: "assets/icons/action/ic_settings_remote_24px.svg", face : "assets/icons/action/ic_settings_remote_24px.svg", link : '/alerts', avatarIcon: true}},
        { name: "Grupos", options: { available: false, icon: "assets/icons/action/ic_speaker_notes_24px.svg", face : "assets/icons/action/ic_speaker_notes_24px.svg", link : '/groups', avatarIcon: true}},
        { name: "Configurações", options: { available: false, icon: "assets/icons/action/ic_build_24px.svg", face : "assets/icons/action/ic_build_24px.svg", link : '/admin', avatarIcon: true }},
        { layout: true, separator: true },
        { name: "LogOut", options: { icon: "assets/icons/action/ic_power_settings_new_24px.svg", link : '/logout', available: true}}
    ];

    var PROTECTED_PATHS = ['/friends', '/home', '/alerts', '/groups'];

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
        MENU: {
            TITLE: "SmartSensors",
            ICONS: {
                MENU: "assets/icons/navigation/ic_menu_24px.svg",
                ADD: "assets/icons/social/ic_share_24px.svg",
                SUBSCRIBE: "assets/icons/social/ic_group_add_24px.svg",
                MSGS: "assets/icons/communication/ic_forum_24px.svg",
                NOTIFICATIONS: "assets/icons/social/ic_notifications_active_24px.svg",
                LOCKED: "assets/icons/action/ic_lock_24px.svg"
            }
        },
        HOME: {
            TITLE: "Home",
            ICONS:{
                WARNING: "assets/icons/alert/ic_warning_24px.svg",
                ASSESSMENT: "assets/icons/action/ic_assessment_24px.svg",
                ACCOUNTS: "assets/icons/action/ic_account_circle_24px.svg",
                FAVORITE: "assets/icons/action/ic_favorite_24px.svg"
            },
            IMAGES:{
                AVATAR: 'assets/images/profile_demo_2.png'
            }
        },
        ALERTS: {
            LIST: {
                TITLE: "Lista de Alertas",

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
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_24px.svg",
                SUBSCRIBERS: "assets/icons/action/ic_visibility_24px.svg"
            }
        },
        SENSORS: {
            LIST: {
                TITLE: "Lista de Sensores",
                CONNECTED: {
                    TITLE: "Sensores Conectados"
                },
                DISCONNECTED: {
                    TITLE: "Sensores Desconectados"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_24px.svg",
                ACCOUNTS: "assets/icons/action/ic_account_box_24px.svg",
                SUBSCRIBERS: "assets/icons/action/ic_subscribers_24px.svg",
                WARNING: "assets/icons/alert/ic_warning_24px.svg",
                AVATAR: "assets/icons/action/ic_info_outline_24px.svg",
                PUBLISH: "assets/icons/editor/ic_publish_24px.svg",
                DELETE: "assets/icons/content/ic_delete_sweep_24px.svg"
            }
        },
        GROUPS: {
            LIST: {
                TITLE: "Groupos",
                SUBSCRIBED: {
                    TITLE: "Assinaturas"
                },
                ALERTS: {
                    TITLE: "Alertas Não Assinados"
                },
                GROUPS: {
                    TITLE: "Grupos de Menssagens Não Assinados"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_24px.svg",
                ACCOUNT: "assets/icons/action/ic_account_circle_24px.svg",
                SUBSCRIBERS: "assets/icons/action/ic_visibility_24px.svg"
            }
        },
        SUBSCRIPTIONS: {
            LIST: {
                TITLE: "Assinaturas",
                SUBSCRIBED: {
                    TITLE: "Assinaturas"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_24px.svg",
                ACCOUNT: "assets/icons/action/ic_account_circle_24px.svg"
            }
        },
        RECIPES: {
            LIST: {
                TITLE: "Receitas",
                SUBSCRIBED: {
                    TITLE: "Receitas Assinadas"
                },
                RECIPES: {
                    TITLE: "Outras Receitas"
                },
                ACTIVE:{
                    TITLE: "Receita Ativa",
                    COLOR: "blue"
                },
                NOTACTIVE:{
                    TITLE: "Sem Receitas",
                    COLOR: "red"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_24px.svg",
                AVATAR: "assets/icons/action/ic_info_outline_24px.svg",
                PUBLISH: "assets/icons/editor/ic_publish_24px.svg",
                DELETE: "assets/icons/content/ic_delete_sweep_24px.svg"
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
