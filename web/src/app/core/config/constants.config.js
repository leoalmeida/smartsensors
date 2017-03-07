(function(angular) {
    'use strict';

    var ICONS = {
            "temperature": "assets/icons/thermometer.svg",
            "acoustic": "assets/icons/sensor.svg",
            "airmoisture": "assets/icons/humidity.svg",
            "distance": "assets/icons/sensor.svg",
            "eletric": "assets/icons/sensor.svg",
            "gas": "assets/icons//sensor.svg",
            "light": "assets/icons/light.svg",
            "motion": "assets/icons/motion.svg",
            "pressure": "assets/icons/sensor.svg",
            "rainmoisture": "assets/icons/humidity.svg",
            "soilmoisture": "assets/icons/humidity.svg",
            "waterflow": "assets/icons/waterflow.svg",
            "CLOCK": "assets/icons/action/ic_query_builder_48px.svg",
            "NEW": "assets/icons/content/ic_add_48px.svg",
            "ACCOUNT": "assets/icons/action/ic_account_circle_48px.svg",
            "SUBSCRIBERS": "assets/icons/action/ic_visibility_48px.svg",
            "BACKTOP": "assets/icons/editor/ic_vertical_align_top_24px.svg",
            "TOBOTTOM": "assets/icons/editor/ic_vertical_align_bottom_24px.svg",
            "PLAY": "assets/icons/av/ic_play_arrow_48px.svg"
    };
    var COLORS = ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4', '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#b9f6ca', '#69f0ae', '#00e676', '#00c853', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00', '#d7ccc8', '#bcaaa4', '#795548', '#d7ccc8', '#bcaaa4', '#8d6e63', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#cfd8dc', '#b0bec5', '#78909c'];

    var MENU = [
        { layout: true, separator: true },
        { name: "Home", options: { icon: "assets/icons/action/ic_dashboard_48px.svg", face : "assets/icons/action/ic_dashboard_48px.svg",  link : '/home',  avatarIcon: true, available: true }},
        { name: "Mapa", options: { icon: "assets/icons/maps/ic_map_48px.svg", face : "assets/icons/maps/ic_map_48px.svg",  link : '/map',  avatarIcon: true, available: true }},
        { name: "Receitas", options: { icon: "assets/icons/action/ic_speaker_notes_48px.svg", face : "assets/icons/action/ic_speaker_notes_48px.svg", link : '/recipes', avatarIcon: true, available: true}},
        { name: "Assinaturas", options: { icon: "assets/icons/action/ic_supervisor_account_48px.svg", face : "assets/icons/action/ic_supervisor_account_48px.svg", link : '/subscriptions', avatarIcon: true, available: true }},
        { name: "Relatórios", options: { icon: "assets/icons/action/ic_receipt_48px.svg", face : "assets/icons/action/ic_receipt_48px.svg",  link : '/info',  avatarIcon: true, available: true}},
        { layout: true, separator: true },
        { layout: true, header: true , title: "Admin"},
        { name: "Atuadores", options: { icon: "assets/icons/action/ic_play_for_work_48px.svg", face : "assets/icons/action/ic_play_for_work_48px.svg",  link : '/actuators',  avatarIcon: true, available: true}},
        { name: "Sensores", options: { icon: "assets/icons/action/ic_settings_input_antenna_48px.svg", face : "assets/icons/action/ic_settings_input_antenna_48px.svg",  link : '/sensors',  avatarIcon: true, available: true}},
        { name: "Sinks", options: { icon: "assets/icons/hardware/ic_device_hub_48px.svg", face : "assets/icons/hardware/ic_device_hub_48px.svg",  link : '/sinks',  avatarIcon: true, available: true}},
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
                TITLE: "Alertas",

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
                TITLE: "Sensores",
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
        ACTUATORS: {
            LIST: {
                TITLE: "Atuadores",
                CONNECTED: {
                    TITLE: "Atuadores Habilitados"
                },
                DISCONNECTED: {
                    TITLE: "Atuadores Bloqueados"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_48px.svg",
                ON: "assets/icons/device/ic_signal_wifi_4_bar_24px.svg",
                OFF: "assets/icons/device/ic_signal_wifi_off_24px.svg"
            }
        },
        SINKS: {
            LIST: {
                TITLE: "Sinks",
                SENSORS: {
                  TITLE: "Sensores"
                },
                ACTUATORS: {
                  TITLE: "Atuadores"
                }
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_48px.svg",
                ON: "assets/icons/device/ic_signal_wifi_4_bar_24px.svg",
                OFF: "assets/icons/device/ic_signal_wifi_off_24px.svg",
                PLAY: "assets/icons/av/ic_play_arrow_48px.svg"
            }
        },
        INFO: {
            LIST: {
                TITLE: "Relatório"
            },
            ICONS:{
                NEW: "assets/icons/content/ic_add_48px.svg"
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
                    TITLE: "Alertas Assinados"
                },
                CATALOG:{
                    TITLE: "Catálogo de Alertas"
                }
            }
        },
        RECIPES: {
            LIST: {
                TITLE: "Receitas",
                OWNED: {
                    TITLE: "Suas receitas"
                },
                COPIED: {
                    TITLE: "Outras receitas"
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
            ICONS: ICONS,
            MENU: MENU,
            PROTECTED_PATHS: PROTECTED_PATHS,
            MOODLIST: MOODLIST,
            MAPSCONFIG: MAPSCONFIG,
            SCREENCONFIG: SCREENCONFIG,
            RANDOMCOLOR: randomColor(),
            RANDOMSPAN: randomSpan()
        });

    function randomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    };

    function randomSpan() {
        var r = Math.random();
        if (r < 0.8) {
            return 1;
        } else if (r < 0.9) {
            return 2;
        } else {
            return 3;
        }
    };

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
