# Modal component



```javascript
UI.component.Modal.show({
    title: 'Popup Title',
    content: 'Your content',
    buttons: [
        {
            title: 'Cancel',
            type: '',
            action: function () {
                UI.component.Modal.hide();
            }
        },
        {
            title: 'Submit',
            type: 'submit',
            action: function () {
                console.log(1);
            }
        }
    ]
});
```
