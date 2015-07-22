// ==UserScript==
// @id             Snapster@vkopt
// @name           Snapster plugin for VkOpt
// @version        1.0
// @namespace      https://greasyfork.org/users/23
// @author         Pmmlabs@github
// @description    Плагин для VkOpt, добавляющий на сайт ВКонтакте веб-клиент Snapster
// @include        *vk.com*
// @run-at         document-end
// @grant none
// ==/UserScript==

if (!window.vkopt_plugins) vkopt_plugins={};
(function(){
    var PLUGIN_ID = 'snapster';
    var PEOPLE_PHOTO_SIZE = 262; // Размер квадратных фоток-миниатюр в разделе "Люди"
    vkopt_plugins[PLUGIN_ID]={
        Name:             'Snapster web-client',
        css: '.quadro-photo {width: '+PEOPLE_PHOTO_SIZE+'px; height: '+PEOPLE_PHOTO_SIZE+'px;}',
        // СОБЫТИЯ
        init: function(){
            // Добавление нового пункта меню в левое меню
            var menu=(ge('sideBar') || ge('side_bar')).getElementsByTagName('ol')[0];
            menu.appendChild(vkCe('li',{'class':'vk_custom_item'},'<a onclick="return true;" onmousemove="vkMenuHide();" class="left_row vk_custom_link" href="/feed?section=snapster">' +
                '<span class="left_label inl_bl">Snapster</span></a>'));
            // Исправление работы кнопки "Назад"
            var original_popstate = data(window,'events').popstate.shift(); // оригинальный обработчик, который выкидывает на /feed , если section кастомная
            data(window, 'events').popstate.push(function () {
                var objLoc = nav.fromStr(location.href);
                if (objLoc.section == 'snapster' && (objLoc.sub!=nav.objLoc.sub || objLoc.hashtag!=nav.objLoc.hashtag))
                    vkopt_plugins[PLUGIN_ID].switchSection(objLoc.sub, objLoc.hashtag || null);
                else
                    original_popstate();
            });
            //this.onLocation(nav.objLoc)
        },                        // При подключении плагина к Вкопту
        onLocation:       function(nav_obj){
            if (nav_obj[0]=='feed' && nav_obj.section=='snapster')
                this.UI(nav_obj.sub, nav_obj.hashtag || null);
        },
        // ПЕРЕМЕННЫЕ
        postTemplate: '<div id="post{post_id}" class="post post_photos post_photos{owner_id}_1" onmouseover="wall.postOver(\'{post_id}\')" onmouseout="wall.postOut(\'{post_id}\')">'+
        '<div class="post_table">'+
            '<div class="post_image">'+
                '<a class="post_image" href="/id{owner_id}"><img src="{avatar}" height="50" width="50"></a>'+
            '</div>'+
            '<div class="post_info">'+
                '<div class="wall_text">'+
                    '<div class="wall_text_name">'+
                        '{name_link}{verified} {friend_status}'+
                    '</div>'+
                    '<div class="page_post_sized_thumbs clear_fix">'+
                        '<a href="/photo{photo_id}" onclick="return showPhoto(\'{photo_id}\', \'photos{owner_id}\', {}, event);" style="width: 537px; height: 537px;" class="page_post_thumb_wrap page_post_thumb_last_row fl_l"><img src="{src_big}" width="537" class="page_post_thumb_sized_photo"></a>'+
                    '</div>' +
                    '<div class="wall_post_text">{text}</div>'+
                '</div>'+
                '<div class="post_full_like_wrap sm fl_r">'+
                    '<div class="post_full_like">'+
                        '<div class="post_like fl_r has_dislike" onmouseover="wall.postLikeOver(\'{photoLike_id}\')" onmouseout="wall.postLikeOut(\'{photoLike_id}\')" onclick="vkopt_plugins[\'{PLUGIN_ID}\'].like(\'{photo_id}\'); event.cancelBubble = true;">'+
                            '<span class="post_like_link fl_l" id="like_link{photoLike_id}">Мне нравится</span>'+
                            '<i class="post_like_icon sp_main  fl_l {mylike}" id="like_icon{photoLike_id}"></i>'+
                            '<span class="post_like_count fl_l" id="like_count{photoLike_id}">{likes}</span>'+
                        '</div>'+
                        '<div class="post_share fl_r" onmouseover="wall.postShareOver(\'{photoLike_id}\')" onmouseout="wall.postShareOut(\'{photoLike_id}\', event)" onclick="vkopt_plugins[\'{PLUGIN_ID}\'].share(\'{photo_id}\',\'{post_id}\'); event.cancelBubble = true;">'+
                            '<span class="post_share_link fl_l" id="share_link{photoLike_id}">Поделиться</span>'+
                            '<i class="post_share_icon sp_main fl_l" id="share_icon{photoLike_id}"></i>'+
                                //'<span class="post_share_count fl_l" id="share_count{photo_id}">9</span>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="replies">'+
                    '<div class="reply_link_wrap sm">'+
                        '<small class="feed_photos_num"><span class="rel_date">{date}</span>, фотография из </small><a onclick="return nav.change({z: \'album{owner_id}_{aid}\'}, event);"  href="/album{owner_id}_{aid}">альбома</a>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
        peopleTemplate: '<div id="post{post_id}" class="post post_photos post_photos{owner_id}_1" onmouseover="wall.postOver(\'{post_id}\')" onmouseout="wall.postOut(\'{post_id}\')">'+
        '<div class="post_table">'+
            '<div class="post_image">'+
                '<a class="post_image" href="/id{owner_id}"><img src="{avatar}" height="50" width="50"></a>'+
            '</div>'+
            '<div class="post_info">'+
                '<div class="wall_text">'+
                    '<div class="wall_text_name">'+
                        '<a class="author" href="/id{owner_id}">{name}</a>{verified} {friend_status}'+
                    '</div>'+
                    '<div class="page_post_sized_thumbs clear_fix">'+
                        '<a href="/photo{photo_id1}" onclick="return showPhoto(\'{photo_id1}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big1}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                        '<a href="/photo{photo_id2}" onclick="return showPhoto(\'{photo_id2}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big2}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                        '<a href="/photo{photo_id3}" onclick="return showPhoto(\'{photo_id3}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big3}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                        '<a href="/photo{photo_id4}" onclick="return showPhoto(\'{photo_id4}\', \'photos{owner_id}\', {}, event);" class="page_post_thumb_wrap quadro-photo fl_l"><img src="{src_big4}" width="'+PEOPLE_PHOTO_SIZE+'" class="page_post_thumb_sized_photo"></a>'+
                    '</div>'+
                '</div>'+
                //'<div class="replies">'+
                //    '<div class="reply_link_wrap sm">'+
                //        '<small class="feed_photos_num"><span class="rel_date">{date}</span>, фотография из </small><a href="/album{owner_id}_{aid}">альбома</a>'+
                //    '</div>'+
                //'</div>'+
            '</div>'+
        '</div>',
        // ФУНКЦИИ
        UI: function(subsection,hashtag) {
            if (isVisible(ge('feed_empty'))) {  // делать интерфейс только если его еще нет, т.е. надпись "новостей нет" все еще видна.
                hide(ge('feed_empty'));
                // Удаление шапки
                var feed_news_bar = ge('feed_news_bar');
                var summary_tabs = geByClass('summary_tab', feed_news_bar);
                for (var i in summary_tabs)
                    feed_news_bar.removeChild(summary_tabs[i]);
                // Формирование шапки. Категории новостей.
                dApi.call('chronicle.getExplore', {}, function (r, response) {
                    response.push({section:'recommended',title:'Рекомендации'});
                    response.push({section:'people_list',title:'Список людей'});
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].section == 'hashtags')
                            vkopt_plugins[PLUGIN_ID].hashtags = response[i].hashtags;
                        feed_news_bar.appendChild(vkCe('div', {'class': 'fl_l summary_tab', 'id':'snapster_'+response[i].section},
                            '<a class="summary_tab2" title="'+response[i].title+'" href="feed?section=snapster&sub=' + response[i].section + '" onclick="if (!checkEvent(event)) {return vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'' + response[i].section + '\');}"><div class="summary_tab3"><nobr>' + response[i].title.split('/')[0] + '</nobr></div></a>'));
                    }
                    // По умолчанию загружается "Популярное"
                    vkopt_plugins[PLUGIN_ID].switchSection(subsection || 'popular_country', hashtag);
                });
            }
        },
        share: function (photo_id, post_id) {   // Нажатие на "Поделиться"
            showBox('like.php', {
                act: 'publish_box',
                object: 'photo' + photo_id,
                list: 'feed1_' + post_id,
                to: 'mail'
            }, {stat: ['page.js', 'page.css', 'wide_dd.js', 'wide_dd.css', 'sharebox.js']});
        },
        like: function(photo_id){
            console.log(photo_id);  // TODO: поставить лайк через API
        },
        processHashtags: function (text) {
            if (window.Emoji && Emoji.emojiToHTML)
                text = Emoji.emojiToHTML(text,true) || text;
            return text.replace(/(#[\wа-яА-Я]+)/g,'<a href="feed?section=snapster&sub=hashtags&hashtag=$1" ' +
                'onclick="return vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'hashtags\',\'$1\');">$1</a>');
        },
        switchSection: function(section, hashtag) {
            if (!ge('feed_rows')) location.reload();    // случай нажатия "назад" не с новостей
            show('feed_progress');
            ge('feed_rows').innerHTML = '';
            removeClass(geByClass('summary_tab_sel')[0], 'summary_tab_sel');
            addClass('snapster_'+section, 'summary_tab_sel');
            postTemplate = this.postTemplate;
            peopleTemplate = this.peopleTemplate;
            switch (section) {
                case 'hashtags':
                    if (hashtag) {
                        dApi.call('chronicle.getExploreSection', {
                            'section': 'hashtag',
                            'count': 30,
                            //'title': title,
                            'fields': 'name,photo_50,friend_status,verified',
                            'hashtag': hashtag
                        }, vkopt_plugins[PLUGIN_ID].renderPosts);
                    } else {
                        for (var i = 0; i < this.hashtags.length; i++) {
                            var photo = this.hashtags[i].photo.top_photo;
                            var oid = photo.split('_')[0];
                            var pid = photo.split('_')[1];
                            ge('feed_rows').appendChild(vkCe('div', {'class': 'feed_row'}, postTemplate
                                    .replace(/\{owner_id\}/g, oid)
                                    .replace(/\{post_id\}/g, '1_' + oid)
                                    .replace(/\{photo_id\}/g, photo)
                                    .replace(/\{photoLike_id\}/g, oid + '_photo' + pid)
                                    .replace(/\{src_big\}/g, this.hashtags[i].photo.src)
                                    .replace(/\{name_link\}/g, '<a class="author" href="feed?section=snapster&sub=hashtags&hashtag=' + this.hashtags[i].hashtag +
                                        '" onclick="return vkopt_plugins[\'' + PLUGIN_ID + '\'].switchSection(\'hashtags\',\'' + this.hashtags[i].hashtag +
                                        '\');">' + this.hashtags[i].hashtag + '</a>')
                                    .replace(/\{date\}/g, '')
                                    .replace(/\{aid\}/g, 0)
                                    .replace(/\{likes\}/g, '')
                                    .replace(/\{PLUGIN_ID\}/g, PLUGIN_ID)
                                    .replace(/\{mylike\}/g, '')
                                    .replace(/\{avatar\}/g, '/images/no_photo.png') // В качестве аватара картинка с фотоаппаратом. Лучше бы найти картинку с решеткой.
                                    .replace(/\{verified\}/g, '')
                                    .replace(/\{text\}/g, '')
                                    .replace(/\{friend_status\}/g, '')
                            ));
                        }
                        hide('feed_progress');
                    }
                    break;
                case 'recommended':
                case 'popular_country':
                    dApi.call('chronicle.getExploreSection', {
                        'section': section,
                        'count': 20,
                        'start_from': 0,
                        'fields': 'name,photo_50,friend_status,verified'
                    }, vkopt_plugins[PLUGIN_ID].renderPosts);
                    break;
                case 'people':
                    dApi.call('chronicle.getExploreSection', {
                        'section': section,
                        //'count': count,
                        'fields': 'name,photo_50,friend_status,verified'
                    }, function (r, response) {
                        // Рендер постов
                        for (var i = 0; i < response.items.length; i++) {
                            var item = response.items[i];
                            ge('feed_rows').appendChild(vkCe('div', {'class': 'feed_row'}, peopleTemplate
                                    .replace(/\{owner_id\}/g, item.profile.uid)
                                    .replace(/\{post_id\}/g, '1_' + item.profile.uid + '_' + item.photos[0].created)
                                    .replace(/\{photo_id1\}/g, item.photos[0].owner_id + '_' + item.photos[0].pid)
                                    .replace(/\{photo_id2\}/g, item.photos[1].owner_id + '_' + item.photos[1].pid)
                                    .replace(/\{photo_id3\}/g, item.photos[2].owner_id + '_' + item.photos[2].pid)
                                    .replace(/\{photo_id4\}/g, item.photos[3].owner_id + '_' + item.photos[3].pid)
                                    .replace(/\{src_big1\}/g, item.photos[0].src_big)
                                    .replace(/\{src_big2\}/g, item.photos[1].src_big)
                                    .replace(/\{src_big3\}/g, item.photos[2].src_big)
                                    .replace(/\{src_big4\}/g, item.photos[3].src_big)
                                    .replace(/\{name\}/g, item.profile.first_name+' '+item.profile.last_name)
                                    .replace(/\{PLUGIN_ID\}/g, PLUGIN_ID)
                                    .replace(/\{size\}/g, vkopt_plugins[PLUGIN_ID].PEOPLE_PHOTO_SIZE)
                                    .replace(/\{avatar\}/g, item.profile.photo_50)
                                    .replace(/\{friend_status\}/g, item.profile.friend_status ? '<span class="explain">(в друзьях)  '+item.profile.friend_status+'</span>' : '')
                                    .replace(/\{verified\}/g, item.profile.verified ? '<span class="vk_profile_verified"></span>' : '')
                            ));
                        }
                        hide('feed_progress');
                    });
                    break;
                case 'people_list':
                    dApi.call('chronicle.getExploreSection', {
                        'section': section,
                        //'count': 12,
                        'fields': 'name,photo_50,photo_100,photo_200,photo_400_orig,sex,status,friend_status,verified,photo_id'
                    }, function (r, response) {
                         //Рендер постов-людей
                        for (var i = 0; i < response.profiles.length; i++) {
                            var item = response.profiles[i];
                            ge('feed_rows').appendChild(vkCe('div', {'class': 'feed_row'}, postTemplate
                                    .replace(/\{owner_id\}/g, item.uid)
                                    .replace(/\{post_id\}/g, '1_' + item.uid)
                                    .replace(/\{photo_id\}/g, item.photo_id || item.uid+'_0')
                                    .replace(/\{photoLike_id\}/g, item.photo_id ? item.photo_id.replace('_','_photo') : item.uid+'_photo0')
                                    .replace(/\{text\}/g, vkopt_plugins[PLUGIN_ID].processHashtags(item.status))
                                    .replace(/\{src_big\}/g, item.photo_400_orig || item.photo_200 || item.photo_100 || item.photo_50)
                                    .replace(/\{name_link\}/g, '<a class="author" href="/id'+item.uid+'">'+item.first_name+' '+item.last_name+'</a>')
                                    .replace(/\{date\}/g, '')
                                    .replace(/\{aid\}/g, '0')
                                    .replace(/\{likes\}/g, '')
                                    .replace(/\{PLUGIN_ID\}/g, PLUGIN_ID)
                                    .replace(/\{mylike\}/g, '')
                                    .replace(/\{avatar\}/g, item.photo_50)
                                    .replace(/\{friend_status\}/g, item.friend_status ? '<span class="explain">(в друзьях)</span>' : '')
                                    .replace(/\{verified\}/g, item.verified ? '<span class="vk_profile_verified"></span>' : '')
                            ));
                        }
                        hide('feed_progress');
                    });
                    break;
            }
            nav.setLoc({'0':'feed','section':'snapster','sub':section,'hashtag':hashtag});
            document.title = 'Snapster - '+section+(hashtag ? ' - '+hashtag : '');
            return false;
        },
        renderPosts: function (r, response) {   // Рендеринг постов в категориях "Популярное" и "Конкретный хештег"
            // Более удобный объект с профилями
            var profiles = {};
            for (var i = 0; i < response.profiles.length; i++)
                profiles[response.profiles[i].uid] = response.profiles[i];
            // Рендер постов
            for (var i = 0; i < response.items.length; i++) {
                var item = response.items[i];
                if (item) ge('feed_rows').appendChild(vkCe('div', {'class': 'feed_row'}, postTemplate
                        .replace(/\{owner_id\}/g, item.owner_id)
                        .replace(/\{post_id\}/g, '1_' + item.owner_id + '_' + item.created)
                        .replace(/\{photo_id\}/g, item.owner_id + '_' + item.pid)
                        .replace(/\{photoLike_id\}/g, item.owner_id + '_photo' + item.pid)
                        .replace(/\{text\}/g, vkopt_plugins[PLUGIN_ID].processHashtags(item.text))
                        .replace(/\{src_big\}/g, item.src_big || item.src)
                        .replace(/\{name_link\}/g, '<a class="author" href="/id'+item.owner_id+'">'+profiles[item.owner_id].first_name+' '+profiles[item.owner_id].last_name+'</a>')
                        .replace(/\{date\}/g, dateFormat(item.created * 1000, "dd.mm.yyyy HH:MM:ss"))
                        .replace(/\{aid\}/g, item.aid)
                        .replace(/\{likes\}/g, item.likes ? item.likes.count : '')
                        .replace(/\{PLUGIN_ID\}/g, PLUGIN_ID)
                        .replace(/\{mylike\}/g, item.likes && item.likes.user_likes ? 'my_like' : '')
                        .replace(/\{avatar\}/g, profiles[item.owner_id].photo_50)
                        .replace(/\{friend_status\}/g, profiles[item.owner_id].friend_status ? '<span class="explain">(в друзьях) '+profiles[item.owner_id].friend_status+' </span>' : '')
                        .replace(/\{verified\}/g, profiles[item.owner_id].verified ? '<span class="vk_profile_verified"></span>' : '')
                ));
            }
            hide('feed_progress');
        }
    };
    if (window.vkopt_ready) vkopt_plugin_run(PLUGIN_ID);
})();