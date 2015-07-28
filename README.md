# snapster.user.js
Плагин для VkOpt, добавляющий на сайт ВКонтакте веб-клиент Snapster. Распространяется в виде юзер-скрипта.<br>
В левое меню добавляется новый пункт "Snapster", который является ссылкой на https://vk.com/feed?section=snapster. При переходе по этому адресу на панели категорий новостей появляются кнопки "Популярное", "Популярные хэштеги", "Интересные люди", и т.д., а в ленту загружаются записи из категории "Популярное".

Этот скрипт работает только при установленном расширении VkOpt, т.к. для авторизованного вызова API используются реализованные там функции.
Домашняя страница на greasyfork: [https://greasyfork.org/ru/scripts/11120-snapster-plugin-for-vkopt](https://greasyfork.org/ru/scripts/11120-snapster-plugin-for-vkopt)

Установка
--
Вам потребуется какое-нибудь средство запуска пользовательских скриптов (userscript), например:
   - Для Firefox: дополнение [GreaseMonkey](http://www.greasespot.net/) (или [Scriptish](http://scriptish.org/) - на последних версиях не работает)
   - Для Chrome: дополнение [TamperMonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ru) (через установку без дополнения не работает)

Убедитесь, что у вас установлен [VkOpt](http://vkopt.net)<br>
После этого переходите по ссылке [https://raw.githubusercontent.com/Pmmlabs/snapster/master/snapster.user.js](https://raw.githubusercontent.com/Pmmlabs/snapster/master/snapster.user.js) и нажимайте Install

## Задействованные методы API

   - `chronicle.getExplore`
   - `chronicle.getExploreSection`
   - `chronicle.getPreset`
   - `chronicle.getFeed`
   
## Скриншот

![screenshot](https://cloud.githubusercontent.com/assets/2682026/8810822/5c2bc40c-2ffa-11e5-9ea9-fabb054ef465.jpg)