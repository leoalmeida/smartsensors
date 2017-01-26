(function(angular) {
    'use strict';

    var MENU = [
        { layout: true, separator: true },
        { name: "Home", options: { icon: "assets/icons/action/ic_dashboard_48px.svg", face : "assets/icons/action/ic_dashboard_48px.svg",  link : '/',  avatarIcon: true, available: true }},
        { name: "Mapa", options: { icon: "assets/icons/maps/ic_map_48px.svg", face : "assets/icons/maps/ic_map_48px.svg",  link : '/map',  avatarIcon: true, available: true }},
        { name: "Receitas", options: { icon: "assets/icons/action/ic_speaker_notes_48px.svg", face : "assets/icons/action/ic_speaker_notes_48px.svg", link : '/recipes', avatarIcon: true, available: true}},
        { name: "Assinaturas", options: { icon: "assets/icons/action/ic_supervisor_account_48px.svg", face : "assets/icons/action/ic_supervisor_account_48px.svg", link : '/subscriptions', avatarIcon: true, available: true }},
        { layout: true, separator: true },
        { layout: true, header: true , title: "Admin"},
        { name: "Sensores", options: { icon: "assets/icons/action/ic_settings_input_antenna_48px.svg", face : "assets/icons/ic_settings_input_antenna_48px.svg",  link : '/sensors',  avatarIcon: true, available: true}},
        { name: "Alertas", options: { available: false, icon: "assets/icons/action/ic_settings_remote_48px.svg", face : "assets/icons/action/ic_settings_remote_48px.svg", link : '/alerts', avatarIcon: true}},
        { name: "Grupos", options: { available: false, icon: "assets/icons/action/ic_speaker_notes_48px.svg", face : "assets/icons/action/ic_speaker_notes_48px.svg", link : '/groups', avatarIcon: true}},
        { name: "Configurações", options: { available: false, icon: "assets/icons/action/ic_build_48px.svg", face : "assets/icons/action/ic_build_48px.svg", link : '/admin', avatarIcon: true }},
        { layout: true, separator: true },
        { name: "LogOut", options: { icon: "assets/icons/action/ic_power_settings_new_48px.svg", link : '/logout', available: true}}
    ];

    var PROTECTED_PATHS = ['/friends', '/home', '/alerts', '/groups'];

    var MOODLIST = [
        {name: 'verysatisfied', link: "assets/icons/social/ic_sentiment_very_satisfied_48px.svg"},
        {name: 'satisfied', link: "assets/icons/social/ic_mood_48px.svg"},
        {name: 'neutral', link: "assets/icons/social/ic_sentiment_neutral_48px.svg"},
        {name: 'dissatisfied', link: "assets/icons/social/ic_sentiment_dissatisfied_48px.svg"},
        {name: 'verydissatisfied', link: "assets/icons/social/ic_sentiment_very_dissatisfied_48px.svg"}
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
                MENU: "assets/icons/navigation/ic_menu_48px.svg",
                ADD: "assets/icons/social/ic_share_48px.svg",
                SUBSCRIBE: "assets/icons/social/ic_group_add_48px.svg",
                MSGS: "assets/icons/communication/ic_forum_48px.svg",
                NOTIFICATIONS: "assets/icons/social/ic_notifications_active_48px.svg",
                LOCKED: "assets/icons/action/ic_lock_48px.svg"
            }
        },
        HOME: {
            TITLE: "Home",
            ICONS:{
                WARNING: "assets/icons/alert/ic_warning_48px.svg",
                ASSESSMENT: "assets/icons/action/ic_assessment_48px.svg",
                ACCOUNTS: "assets/icons/action/ic_account_circle_48px.svg",
                FAVORITE: "assets/icons/action/ic_favorite_48px.svg"
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
                NEW: "assets/icons/content/ic_add_48px.svg",
                SUBSCRIBERS: "assets/icons/action/ic_visibility_48px.svg"
            }
        },
        SENSORS: {
            LIST: {
                TITLE: "Lista de Sensores",
                CONNECTED: {
                    TITLE: "Sensores Habilitados"
                },
                DISCONNECTED: {
                    TITLE: "Sensores Bloqueados"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_48px.svg",
                ACCOUNTS: "assets/icons/action/ic_account_box_48px.svg",
                SUBSCRIBERS: "assets/icons/action/ic_subscribers_48px.svg",
                WARNING: "assets/icons/alert/ic_warning_48px.svg",
                AVATAR: "assets/icons/action/ic_info_outline_48px.svg",
                PUBLISH: "assets/icons/editor/ic_publish_48px.svg",
                DELETE: "assets/icons/content/ic_delete_sweep_48px.svg",
                ON: "assets/icons/device/ic_signal_wifi_4_bar_24px.svg",
                OFF: "assets/icons/device/ic_signal_wifi_off_24px.svg"
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
                NEW: "assets/icons/content/ic_add_48px.svg",
                ACCOUNT: "assets/icons/action/ic_account_circle_48px.svg",
                SUBSCRIBERS: "assets/icons/action/ic_visibility_48px.svg"
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
                NEW: "assets/icons/content/ic_add_48px.svg",
                ACCOUNT: "assets/icons/action/ic_account_circle_48px.svg"
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
                NEW: "assets/icons/content/ic_add_48px.svg",
                AVATAR: "assets/icons/action/ic_info_outline_48px.svg",
                PUBLISH: "assets/icons/editor/ic_publish_48px.svg",
                DELETE: "assets/icons/content/ic_delete_sweep_48px.svg",
                REMOVE: "assets/icons/action/ic_delete_forever_48px.svg",
                GOBACK: "assets/icons/content/ic_undo_48px.svg"
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

   /* var loadConfigs = function() {
        vm.allStops = this.data.map(function (stop) {
            return {
                value: stop.stop_id,
                display: stop.stop_name,
                sequence: stop.stop_sequence,
                route: stop.trip_id,
                ref: stop.stop_desc,
                lat: stop.stop_lat,
                lng: stop.stop_lon
            };
        });
        vm.loadingDB--;
        addCheckOption("Paradas", false);
        $scope.$apply();
    };


    function ConfigInfo(key, keyval){
        this.retcode = 0;
        this.retmsg = "";
        this.key = key;
        this.keyval = keyval;
        this.data = [];
    }

    ConfigInfo.prototype.process = function(callback, xhr) {
        var objSchema = {};
        var resp = JSON.parse(xhr.responseText);
        var keyid = null;

        for (column in resp.columns) {
            if (resp.columns[column].name == this.key) keyid = column;
            objSchema[resp.columns[column].name] = column;
        }

        if (this.key & !keyid) {
            this.retcode = -1;
            this.retmsg = "Chave inválida";
        }else {
            for (row in resp.rows) {
                if (this.keyval && (resp.rows[row][keyid] != this.keyval)) continue;

                var object = Object.assign({}, objSchema);
                for (keys in object) {
                    object[keys] = resp.rows[row][object[keys]];
                }
                this.data.push(object);
            }
        }
        callback.call(this);
    }


    // global actions
    function getConfigInfo(storage, cb, key, keyval){
        var xhr = new XMLHttpRequest();
        var t = new ConfigInfo(key, keyval);

        xhr.open("GET", chrome.extension.getURL('/data/'+ storage + '.json'), true);
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                t.process(cb, xhr);
            }
        }

        xhr.send();
    };*/

})(angular);
