# tabsToSelect
Плагин для реализации табов, превращающихся в селект с колбэками и адаптивностью.

[пример](http://codepen.io/pafnuty/full/QjrXNg/)

## HTML
```html

<div class="tts-tabs">
    <ul class="tts-tabs-switchers">
        <li class="tts-tabs-switcher active">таб 1</li>
        <li class="tts-tabs-switcher">таб 2</li>
        <li class="tts-tabs-switcher">таб 3</li>
    </ul>

    <div class="tts-tabs-item active">контент таба 1</div>      
    <div class="tts-tabs-item">контент таба 2</div> 
    <div class="tts-tabs-item">контент таба 3</div> 
</div>
```

## минимум js для работы плагина 
`$.tabsToSelect();`

## js (полный пример)
```js
$.tabsToSelect({
    // Класс, добавляемый с селекту
    selectCalss: 'styler', 
    // Класс, добавляемый с обёртке селекта
    selectWrapperCalss: 'styler-wrapper', 
    onInit: function () {
       // Срабатывает при инициализации плагина
    },
    beforeTabSwich: function (e) {
        // Срабатывает перед сменой активного таба
        // Если функция вернёт false - смена таба не произойдёт
    },
    afterTabSwich: function (e) {
        // Срабатывает после смены активного таба
    },
    onResized: function () {
        // Срабатывает при изменении размера окна
    },
});
```
