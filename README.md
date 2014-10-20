#infiniteMe

Library to enable infinite scrolling easily

---

### Dependencies

**jQuery-1.9.1 ++** (http://jquery.com/download/)

**helpMe.js** (https://github.com/QuatreCentQuatre/helpMe)

**dispatchMe.js** (https://github.com/QuatreCentQuatre/dispatchMe)

---

### Getting Started

Place the **spriteMe.js** file in your default JavaScript vendor directory. Link the script before the end of your **body** and after **jquery.js**.

```
<script src="js/vendor/jquery-1.9.1.min.js"></script>
<script src="js/vendor/helpMe.js"></script>
<script src="js/vendor/dispatchMe.js"></script>
<script src="js/vendor/infiniteMe.js"></script>
```
Here you go ! You're now ready to use infiniteMe. Here the basics !

**Don't forgot to check the demos for more informations!**

#### HTML:
~~~
<div id="infinite">
    <div class="item-list">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
    </div>
    <div class="loader">Loading</div>
    <div class="toggler"><a href="#">Toggler</a></div>
</div>

<div id="item-template" style="display:none;">
    <div class="item"></div>
</div>
~~~

#### Javascript:

```
//Parameters
//-infinite_container: Container
//-infinite_offset: Number of pixels needed to be at based on the container (Ex:-5, 5 pixel before the end of the container)
//-infinite_loader: Loading Message or Icon (Showed before adding new items)
//-item_per_page: Number of items per page
//-page_total: Number total of pages
//-toggler_button: Infinite Button on click add more items. (Can be desactivated toggler_enabled: false)
//-toggler_page_offset: When the button appear by default it's after the 3rd page (toggler_page_offset: 3, -1 being infinite)

var $scope = $('#infinite');
var infinite = new Me.infinite({
    infinite_container: $scope,
    infinite_offset: -5,
    infinite_loader: $scope.find('.loader'),
    item_per_page: 4,
    page_total: 10,
	toggler_button: $scope.find('.toggler'),
    toggler_page_offset: -1,
    event_onload: function(scope){
    for(var i = 0; i < scope.options.item_per_page; i++) {
            scope.$el.find('.item-list').append($('#item-template').html());
        }
        Me.dispatch.sendEvent('infiniteMe.onload');
    }
});

```
---