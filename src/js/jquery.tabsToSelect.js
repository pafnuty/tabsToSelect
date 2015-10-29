/**!
 * Плагин для реализации адаптивных табов, превращающихся в селект
 * @link https://github.com/pafnuty/tabsToSelect
 * @date 27.10.2015
 * @version 1.0.0
 * 
 */
(function ($, window, document) {
	'use strict';
	var pluginName = 'tabsToSelect',
		previousResizeWidth = 0,
		$window = $(window),
		$tabs = $('.tts-tabs'),
		defaults = {
			// Класс, добавляемый с селекту
			selectCalss: '',
			// Класс, добавляемый с обёртке селекта
			selectWrapperCalss: '',
			// Срабатывает при инициализации плагина
			onInit: function () {},
			// Срабатывает перед сменой активного таба
			beforeTabSwich: function (event) {
				return true;
			},
			// Срабатывает после смены активного таба
			afterTabSwich: function (event) {},
			// Срабатывает при изменении размера окна
			onResized: function () {},

		};


	function Plugin(obj, options) {
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this.init();
	}


	$.extend(Plugin.prototype, {

		init: function () {
			var self = this;

			// Пробегаем по табам
			$.each($tabs, function () {
				var $this = $(this), // Текущий блок с табами
					$select = $('<select class="tts-tabs-select ' + self.settings.selectCalss + '" />'), // Блок с селектом
					$tabSwitchers = $this.find('.tts-tabs-switcher'), // Переключатели табов
					$selectInner = []; // Массив для option`s

				// Пробегаем по переключателям табов и формируем селект
				$.each($tabSwitchers, function (i, tabSwitcher) {
					var $tabSwitcher = $(tabSwitcher), // Текущий переключатель
						selected = ($tabSwitcher.hasClass('active')) ? 'selected' : '', // Определяем активный таб
						option = '<option value="' + i + '" ' + selected + '>' + $tabSwitcher.text() + '</option>';

					$selectInner.push(option);
				});

				$select
				// Добавляем в селект пункты
					.html($selectInner.join(''))
					// Навешиваем обработчик на изменение этого селекта
					.on('change.' + pluginName, function (e) {
						// e.flag — для предотвращения рекурсии при клике на переключатель таба
						if (!e.flag) {
							var tab = $(this).val() * 1;
							// Запускаем событие смены активного таба
							$(this).trigger({
								type: 'tabSwitch.' + pluginName,
								tab: tab,
							});
						}
					});

				$this
				// Вставляем сформированный селект в начало блока с табами
					.prepend($select)
					// Навешиваем обработчик на клик по неативным переключателям
					.on('click.' + pluginName, '.tts-tabs-switcher:not(.active)', function () {
						var tab = $(this).index();
						// Запускаем событие смены активного таба
						$(this).trigger({
							type: 'tabSwitch.' + pluginName,
							tab: tab,
						});
					})
					// Навешиваем обработчик для смены активного таба
					.on('tabSwitch.' + pluginName, function (e) {
						// Выполняем колбэк перед сменой активного таба
						var beforeTabSwich = self.settings.beforeTabSwich.call($this, e);

						if (beforeTabSwich) {
							var $thisTab = $($tabSwitchers[e.tab]),
								$tabContent = $thisTab.closest('.tts-tabs').find('.tts-tabs-item'),
								$thisTabContent = $tabContent.eq($thisTab.index());

							// Меняем активные пункт селекта
							$select.val(e.tab).trigger({
								type: 'change',
								flag: true, // для предотвращения рекурсии при клике на переключатель таба
							});

							// Меняем активный таб 
							$thisTab
								.addClass('active')
								.siblings().removeClass('active');

							$tabContent.removeClass('active');
							$thisTabContent.addClass('active');

							$thisTab.trigger({
								type: 'tabClick.' + pluginName,
								tab: $thisTabContent
							});
						}


						// Выполняем колбэк после смены активного таба
						self.settings.afterTabSwich.call($this, e);
					});
				// Заворачиваем селект в контейнер
				$select.wrap('<div class="tts-tabs-select-wrapper ' + self.settings.selectWrapperCalss + '"></div>');
			});

			$window.on('resize.' + pluginName + ' orientationchange.' + pluginName, function (event) {
				self.winResize(event);
			});

			// Выполняем колбэк после инициализации плагина
			self.settings.onInit.call($tabs);


		},

		winResize: function (event) {
			if (event && (event.type === 'resize' || event.type === 'orientationchange')) {
				var windowWidth = $window.width();

				if (windowWidth === previousResizeWidth) {
					return;
				}

				// Выполняем колбэк при ресайзе окна
				this.settings.onResized();

				previousResizeWidth = windowWidth;
			}
		}
	});

	if ($[pluginName] == undefined) {

		$[pluginName] = function (options) {
			return new Plugin(this, options);
		};
	}

}(jQuery, window, document));