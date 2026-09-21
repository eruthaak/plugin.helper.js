# Helper.js

This helper file lets you manage common form operations, AJAX behaviors, Bootstrap components, and UI utilities in jQuery-based web projects from a single place. When added to your project, it provides a fast and standardized starting infrastructure for collecting form data, sending AJAX requests, displaying toasts, and configuring Select2, DataTables, and Quill components.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Getting form data: serializeObject](#getting-form-data-serializeobject)
- [AJAX helpers](#ajax-helpers)
- [Global AJAX settings](#global-ajax-settings)
- [GlobalConfig helpers](#globalconfig-helpers)
- [Alerts and toast settings](#alerts-and-toast-settings)
- [Examples](#examples)
- [Notes and considerations](#notes-and-considerations)

## Introduction

`helper.js` brings repetitive tasks together in a single file. It is especially useful for:

- serializing form fields into an object
- disabling and re-enabling buttons before and after AJAX requests
- closing Bootstrap modals/offcanvas elements
- showing toast messages based on server responses
- generating standard configurations for Select2, DataTables, and Quill
- centralizing Bootstrap tooltip and focus trap behavior

This file is generally designed for use in Laravel, ASP.NET, Node, or static HTML projects; the basic requirement is that jQuery and some UI libraries are loaded.

## Features

### 1. Form serialization

The `$.fn.serializeObject()` method converts a form into a JavaScript object. It specifically handles the following cases:

- checkbox fields: `true` / `false`
- radio fields: gets the selected value
- Select2 fields: handles both single and multiple selection properly
- multiple fields with the same `name`: collects them as an array
- hidden companion fields / checkbox companion fields and similar cases

### 2. AJAX preparation and completion helpers

Inside `$.fn.ajaxHelpers`:

- disables buttons via `data-ajax-setup`
- adds a spinner
- restores the previous content after AJAX completes
- closes modal/offcanvas templates

### 3. Global AJAX configuration

With `$.ajaxSetup()`, the following behaviors are defined:

- adds the `X-CSRF-TOKEN` header from the CSRF token meta tag
- manages button state in `beforeSend`
- displays server messages as toasts in `success`
- parses and displays error messages in a readable format in `error`

### 4. GlobalConfig helpers

The following are defined in `window.GlobalConfig`:

- `Select2(conf)`
- `DataTable(conf)`
- `Quill(conf)`
- `Bootstrap()`

These functions provide consistent design and behavior across the project.

### 5. Bootstrap and UI standards

- automatic tooltip initialization
- empty implementation for modal/offcanvas focus trap behavior
- DataTable error mode set to `none`

## Prerequisites

To use this helper file, the following dependencies must be available in the project:

- jQuery
- Bootstrap 5 (especially for tooltip, modal, and offcanvas)
- Toastr
- Select2 (optional, but supported in `serializeObject`)
- DataTables (optional, but a configuration function exists)
- Quill (optional, but a configuration function exists)

The example below shows the required loading order for active use:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/css/select2.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css" rel="stylesheet">

<script src="https://code.jquery.com/jquery-3.12.12.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/datatables.net@1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js"></script>
<script src="/path/to/helper.js"></script>
```

> Note: If you are using `X-CSRF-TOKEN`, your page should include a meta tag like this:
>
> ```html
> <meta name="X-CSRF-TOKEN" content="token-value">
> ```

## Installation

Adding this file to a project is very simple:

1. Move the `helper.js` file into your project's `assets/js` folder or a similar directory.
2. Include jQuery and the required UI libraries on the page.
3. Add `helper.js` as the last script.
4. If needed, provide custom settings via `window.GlobalConfig`.

```html
<script src="assets/js/helper.js"></script>
```

The file is prepared to work in `$` and `window` contexts automatically; it does not require a direct `DOMContentLoaded`-style initialization code.

## Basic usage

### 1. Getting data from a form

```html
<form id="userForm">
  <input type="text" name="name">
  <input type="checkbox" name="isActive" checked>
  <select name="role" class="select2">
    <option value="admin">Admin</option>
    <option value="editor">Editor</option>
  </select>
</form>

<script>
  const data = $('#userForm').serializeObject();
  console.log(data);
</script>
```

Example output:

```json
{
  "name": "Ahmet",
  "isActive": true,
  "role": "admin"
}
```

### 2. AJAX request

```javascript
$.ajax({
  url: '/api/users',
  method: 'POST',
  data: $('#userForm').serializeObject(),
  success: function (response) {
    console.log(response);
  }
});
```

This call automatically:

- disables buttons containing `data-ajax-setup`
- shows success/error messages as toasts
- closes modal/offcanvas components after AJAX completes

## Getting form data: serializeObject

Keep the following in mind when using the `serializeObject` method:

### Checkbox

```html
<input type="checkbox" name="status" checked>
```

Result:

```json
{ "status": true }
```

### Radio

```html
<input type="radio" name="gender" value="male" checked>
<input type="radio" name="gender" value="female">
```

Result:

```json
{ "gender": "male" }
```

### Select2 multi-select

```html
<select name="roles" class="select2" multiple>
  <option value="1">Administrator</option>
  <option value="2">Editor</option>
  <option value="3">Guest</option>
</select>
```

Result:

```json
{ "roles": [1, 2] }
```

### Multiple fields with the same name

```html
<input type="text" name="phone[]">
<input type="text" name="phone[]">
```

Result:

```json
{ "phone[]": ["123", "456"] }
```

## AJAX helpers

### `data-ajax-setup`

When this attribute is added to a button or form trigger, it is processed automatically via `$.ajaxSetup`:

```html
<button type="submit" data-ajax-setup>Save</button>
```

When this button is present:

- it gets the `disabled` attribute
- its content is saved
- a spinner is inserted
- the original text is restored after AJAX completes

### `beforeSend` and `complete`

The helper file automatically performs the following:

```javascript
$.fn.ajaxHelpers.beforeSend.setButtonContent();
$.fn.ajaxHelpers.complete.setButtonContent();
$.fn.ajaxHelpers.complete.closeBootstrapComponents();
```

These functions standardize UI requirements during AJAX requests.

## Global AJAX settings

The behaviors defined inside `$.ajaxSetup` are as follows:

```javascript
$.ajaxSetup({
  headers: {
    "X-CSRF-TOKEN": $("meta[name='X-CSRF-TOKEN']").attr("content")
  },
  beforeSend: function () {
    $.fn.ajaxHelpers.beforeSend.setButtonContent();
  },
  success: function (response) {
    const { result, message, entity } = response;
    if (message) {
      if (result) {
        toastr.success(message, "Success");
      } else {
        toastr.error(message, "Error");
      }
    }
  },
  complete: function () {
    $.fn.ajaxHelpers.complete.setButtonContent();
    $.fn.ajaxHelpers.complete.closeBootstrapComponents();
  },
  error: function (xhr, status, error, thrownError) {
    // error message is parsed
  }
});
```

### Expected server response structure

Successful and failed responses can use the following format:

```json
{
  "result": true,
  "message": "The operation was completed successfully."
}
```

or

```json
{
  "result": false,
  "message": "An error occurred while processing the request."
}
```

### Error URL and detail separation

The code uses `xhr.responseJSON.message` and `xhr.responseJSON.detail` if they exist. If `detail` exists, it is shown as the title and `message` is used as the description.

## GlobalConfig helpers

Style and behavior standards are defined via `window.GlobalConfig`.

### `GlobalConfig.Select2(conf)`

```javascript
const selectConfig = GlobalConfig.Select2({
  placeholder: 'Select an option',
  multiple: true
});

$('.my-select').select2(selectConfig);
```

Default values:

- `width: "100%"`
- `allowClear: true`
- `theme: "bootstrap-5"`
- `selectionCssClass: "select2--small"`
- `closeOnSelect: false`

### `GlobalConfig.DataTable(conf)`

```javascript
$('#usersTable').DataTable(GlobalConfig.DataTable({
  ajax: '/api/users',
  columns: [
    { data: 'id' },
    { data: 'name' },
    { data: 'email' }
  ]
}));
```

Default settings:

- `dom: 'Blfrtip'`
- `responsive: true`
- `serverSide: true`
- `paging: true`
- `searching: true`
- `ordering: false`
- `lengthMenu: [25, 50, 75, 100]`
- `pageLength: 25`
- `language` object containing Turkish text

### `GlobalConfig.Quill(conf)`

```javascript
const quill = new Quill('#editor', GlobalConfig.Quill({
  placeholder: 'Write your text...'
}));
```

This configuration includes the snow theme and a rich toolbar list for Quill.

### `GlobalConfig.Bootstrap()`

This function initializes:

- tooltips for `data-bs-toggle="tooltip"`
- modal/offcanvas focus trap behavior by overriding it with empty functions

## Alerts and toast settings

Toastr is initialized globally with the following settings:

```javascript
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "showDuration": "300",
  "hideDuration": "300",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};
```

### Usage examples

```javascript
toastr.success('Registration successful.', 'Success');
toastr.error('An error occurred.', 'Error');
toastr.info('Information message');
toastr.warning('Warning message');
```

## Examples

### Example 1: Form submit and AJAX submission

```html
<form id="customerForm">
  <input type="text" name="full_name" placeholder="Full name">
  <input type="email" name="email" placeholder="Email">
  <button type="submit" data-ajax-setup>Send</button>
</form>

<script>
  $('#customerForm').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
      url: '/api/customers',
      type: 'POST',
      data: $(this).serializeObject(),
      success: function (response) {
        console.log('Success', response);
      }
    });
  });
</script>
```

### Example 2: Select2 + DataTable

```javascript
$('.select2-search').select2(GlobalConfig.Select2({
  placeholder: 'Select a user'
}));

$('#usersTable').DataTable(GlobalConfig.DataTable({
  ajax: '/api/users',
  columns: [
    { data: 'id' },
    { data: 'name' },
    { data: 'email' }
  ]
}));
```

### Example 3: Quill editor

```html
<div id="editor"></div>

<script>
  const editor = new Quill('#editor', GlobalConfig.Quill({
    placeholder: 'Write your content...'
  }));
</script>
```

## Notes and considerations

- The file expects jQuery and Bootstrap-like libraries to be loaded.
- If you use CSRF tokens, the `meta[name='X-CSRF-TOKEN']` field is required.
- `serializeObject` uses the `select2-hidden-accessible` class and `select2('val')`; therefore Select2 must be loaded.
- The DataTable configuration is defined with `serverSide: true`, which means your data must come from the server.
- `window.GlobalConfig.Bootstrap()` runs automatically immediately after the page loads.
- `helper.js` contains `console.log(xhr, status, error, thrownError)` for easier debugging during development.

## Conclusion

`helper.js` aims to centralize common recurring operations in web applications. It is especially useful for:

- admin panels
- CRUD screens
- corporate web interfaces
- rapid prototyping
- jQuery-based UI applications

Once added to a project, this file acts like a core utility layer; instead of rewriting the same logic in every project, it provides one standard approach.

## License and usage

This file is a helper code snippet that can be adapted to fit your project. You are free to use it in your own projects, customize it when needed, and improve it as required.