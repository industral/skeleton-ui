Confirm Component
===================

Displays a modal dialog with an optional message and two buttons, OK and Cancel.


```javascript
var modal = new UI.component.Confirm({
    title: 'Confirm',
    content: 'Do you confirm delete?',
    cancel: function() {
        modal.hide();
    }
});

modal.on('ok', function() {
    console.log('ok');
});
```
