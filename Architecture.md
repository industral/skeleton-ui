# UI Project Description


## Intro

UI part doesn't contains any third-party frameworks, and wrote using vanilla 
JavaScript.

Project adhere:

* [Google JavaScript Style Guides](https://google.github.io/styleguide/javascriptguide.xml)
* [Google HTML/CSS Style Guides](https://google.github.io/styleguide/htmlcssguide.xml)


## Components

JavaScript functionality should be written using `component` approach.

There are 5 types of `components`

* **context** - faceless component that has JavaScript logic running on 
background, such as services, etc.
* **component** - very simple part of component, that could be used by 
someone else, e.g. `confirm`, `loader`, etc.
* **widget** - type of component that represent some logical entity
* **page** - usually contains `widgets`. This type of component will be 
re-render if page name (URL page) change.
* **layout** - layout for page. Do not re-render

Each component can contains the following folders:

* **scripts** - for JavaScript files
* **templates** - for HTML templates
* **styles** - for CSS styles
* **images** - for images


## Name spacing

All components should be defined under some namespace. Only one global entry 
point is `UI`, which is global object. Any other component should be defined
 under that object with the following pattern:
 
 `UI.<COMPONENT_TYPE>.<COMPONENT_NAME>`, e.g.
 
 `UI.widget.Account`, `UI.page.Events`, etc...
 
Similar approach is using for CSS. As **all** CSS files later will be 
concatenate to the one file, selector namespacing should be using

`.cmp-<COMPONENT_TYPE>-<COMPONENT_NAME>`, e.g.

`.cmp-page-events`


## Templates

Project doesn't use template as it, but provide very simple functionality for 
HTML snippets. All component relative snippets should be putted under `templates`
folder. Later build system will automatically handle them and build directly 
into bundle, so no additional AJAX request is needed.

You can access your HTML template via

`var dom = Utils.createDOM('components/<COMPONENT_TYPE>/<COMPONENT_NAME>/templates/<TEMPLATE_NAME>')`

e.g.

`Utils.createDOM('components/widget/login/templates/index')`

that will return real DOM instead of string.


## Event Emitter

Components should communicate with each other via `Events`. For that case 
`Event Emitter` is using.


## Build system


### Profiles

UI part support **profile** functionality, which means that depends on what 
account user was logged in, appropriate **profile** bundle files will be 
provided. That resolve issue with security, so users using another profiles 
can access functionality others.

Currently there are 3 types of profiles:

* **interapt** - super admin, can creates admins
* **admin** - admin, can creates users
* **user** - regular user

To support building with different set of files for different profiles, build
 system was created.Features it supports:
 
* Bundle Profiles create
* Include files in order  
* All JS, CSS, HTML files build in one file
* images to base64
* JavaScript minification and obfuscation

Main build file is `build/build.json`, which contains profiles with a list of
 files that should be included into appropriate profile bundle.

The include syntaxt:

`file#app/assets/styleguide/main.css` - include single file
`component#widget/navigation` - include component, where a keywork after `#` 
could be one of 5 component types mentioned above.
