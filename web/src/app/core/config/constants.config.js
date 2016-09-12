(function(angular) {
    'use strict';

    const MENU = [
        { layout: true, separator: true },
        { name: "Home", options: { icon: "assets/icons/action/ic_dashboard_24px.svg", face : "assets/icons/action/ic_dashboard_24px.svg",  link : '/',  avatarIcon: true }},
        { name: "Mapa", options: { icon: "assets/icons/maps/ic_map_24px.svg", face : "assets/icons/maps/ic_map_24px.svg",  link : '/map',  avatarIcon: true }},
        { name: "Alertas", options: { icon: "assets/icons/action/ic_settings_remote_24px.svg", face : "assets/icons/action/ic_settings_remote_24px.svg", link : '/', avatarIcon: true}},
        { name: "Amigos", options: {icon: "assets/icons/action/ic_supervisor_account_24px.svg", face : "assets/icons/action/ic_supervisor_account_24px.svg", link : '/friends', avatarIcon: true }},
        { name: "Messenger", options: { icon: "assets/icons/action/ic_speaker_notes_24px.svg", face : "assets/icons/action/ic_speaker_notes_24px.svg", link : '/messenger', avatarIcon: true }},
        { layout: true, separator: true },
        { layout: true, header: true , title: "Admin"},
        { name: "Sensores", options: { icon: "assets/icons/action/ic_settings_input_antenna_24px.svg", face : "assets/icons/ic_settings_input_antenna_24px.svg",  link : '/sensors',  avatarIcon: true }},
        { name: "Assinantes", options: {icon: "assets/icons/action/ic_supervisor_account_24px.svg", face : "assets/icons/action/ic_supervisor_account_24px.svg", link : '/subscribers', avatarIcon: true }},
        { name: "Configurações", options: { icon: "assets/icons/action/ic_build_24px.svg", face : "assets/icons/action/ic_build_24px.svg", link : '/admin', avatarIcon: true }},
        { layout: true, separator: true },
        { name: "LogOut", options: { icon: "assets/icons/action/ic_power_settings_new_24px.svg" }, link : '/logout'}
    ];

    const PROTECTED_PATHS = ['/friends', '/home', '/alerts'];

    const MOODLIST = [
        {name: 'verysatisfied', link: "assets/icons/social/ic_sentiment_very_satisfied_24px.svg"},
        {name: 'satisfied', link: "assets/icons/social/ic_mood_24px.svg"},
        {name: 'neutral', link: "assets/icons/social/ic_sentiment_neutral_24px.svg"},
        {name: 'dissatisfied', link: "assets/icons/social/ic_sentiment_dissatisfied_24px.svg"},
        {name: 'verydissatisfied', link: "assets/icons/social/ic_sentiment_very_dissatisfied_24px.svg"}
    ];

    angular
        .module('app.core')
        .constant('CONSTANTS', {
            MENU: MENU,
            PROTECTED_PATHS: PROTECTED_PATHS,
            MOODLIST: MOODLIST
        });

})(angular);
